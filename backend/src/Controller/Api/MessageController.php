<?php

namespace App\Controller\Api;

use App\DTO\MessageDTO;
use App\DTO\UserDTO;
use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use App\Services\TokenServices;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class MessageController extends ApiController
{
    #[Route('/chat/{receiverId}')]
    public function messages(
        int $receiverId,
        Request $request,
        MessageRepository $messageRepository,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $user = $token['user'];

            if (!$user) {
                return $this->error('no user');
            }

            $receiver = $userRepository->find($receiverId);

            $messagesData = $messageRepository->findConversation($user->getId(), $receiverId);

            $resReceiver = new UserDTO();
            $resReceiver->id = $receiver->getId();
            $resReceiver->username = $receiver->getUsername();
            $resReceiver->roles = $receiver->getRoles();

            $resMessages = [];

            foreach ($messagesData as $message) {
                $resMessage = new MessageDTO();
                $resMessage->id = $message->getId();
                $resMessage->content = $message->getContent();
                $resMessage->created_at = $message->getCreatedAt();
                $resMessage->sender_id = $message->getSender()->getId();
                $resMessage->sender_username = $message->getSender()->getUsername();
                $resMessage->receiver_id = $message->getReceiver()->getId();
                $resMessage->receiver_username = $message->getReceiver()->getUsername();

                $resMessages[] = $resMessage;
            }

            return $this->success([
                'messages' => $resMessages,
                'receiver' => $resReceiver
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/chat/send', methods: ['POST'])]
    public function sendMessage(
        Request $request,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $user = $token['user'];

            $data = json_decode($request->getContent(), true);

            $reqMessage = $data['message'] ?? null;
            $reqReceiver = $data['receiver'] ?? null;

            $message = new Message();
            $message->setSender($this->getUser());
            $message->setReceiver($entityManager->getRepository(User::class)->find($reqReceiver));
            $message->setContent($reqMessage);
            $message->setCreatedAt(new \DateTimeImmutable());

            $entityManager->persist($message);
            $entityManager->flush();

            return $this->success([
                'message' => $message
            ], null, 201);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
