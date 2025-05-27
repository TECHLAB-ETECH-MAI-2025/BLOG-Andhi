<?php

namespace App\Controller\Api;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ChatController extends AbstractController {
    #[Route('/api/chat/{receiverId}', name: 'api_chat_messages', methods: ['GET'])]
    public function messages(MessageRepository $messageRepository, int $receiverId): JsonResponse {
        $currentUser = $this->getUser();

        $messagesData = $messageRepository->findConversation($currentUser->getId(), $receiverId);

        if (!$messagesData) {
            return new JsonResponse([
                'success' => false,
                'error' => "Error on getting messages"
            ], 400);
        }

        if (!$currentUser) {
            return new JsonResponse([
                'success' => false,
                'error' => 'User not authenticated'
            ], 401);
        }

        $messages = array_map(function ($message) {
            return [
                'id' => $message->getId(),
                'content' => $message->getContent(),
                'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
                'sender' => [
                    'id' => $message->getSender()->getId(),
                    'username' => $message->getSender()->getUsername()
                ],
                'receiver' => [
                    'id' => $message->getReceiver()->getId(),
                    'username' => $message->getReceiver()->getUsername()
                ],
            ];
        }, $messagesData);
        
        return new JsonResponse([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    #[Route('/api/chat/send', name: 'api_chat_send', methods: ['POST'])]
    public function sendMessage(EntityManagerInterface $entityManager, Request $request): JsonResponse {
        $content = $request->request->get('content');
        $receiverId = $request->request->get('receiver');
        
        $message = new Message();
        $message->setSender($this->getUser());
        $message->setReceiver($entityManager->getRepository(User::class)->find($receiverId));
        $message->setContent($content);
        $message->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($message);
        $entityManager->flush();
        
        return new JsonResponse([
            'success' => true,
            'messageHtml' => $this->renderView('components/message/_message_item.html.twig', [
                    'message' => $message
                ]),
        ]);
    }
}