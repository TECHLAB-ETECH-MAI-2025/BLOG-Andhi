<?php

namespace App\Controller\Api;

use App\DTO\UserDTO;
use App\Repository\UserRepository;
use App\Services\TokenServices;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class UserController extends ApiController
{
    #[Route('/user/{id}')]
    public function profile(int $id, Request $request, UserRepository $userRepository): JsonResponse
    {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $targetUser = $userRepository->findOneBy([
                'id' => $id
            ]);

            if (!$targetUser) {
                return $this->error('User not found');
            }

            $user = new UserDTO();
            $user->id = $targetUser->getId();
            $user->username = $targetUser->getUsername();
            $user->email = $targetUser->getEmail();
            $user->roles = $targetUser->getRoles();
            $user->created_at = $targetUser->getCreatedAt();

            return $this->success([
                'user' => $user
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/user/{id}/edit', methods: ['PUT'])]
    public function editProfile(int $id, Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            if ($token['user']->getId() !== $id) {
                return $this->error('Forbidden request');
            }

            $targetUser = $userRepository->findOneBy([
                'id' => $id
            ]);

            if (!$targetUser) {
                return $this->error('User not found');
            }

            $data = json_decode($request->getContent(), true);

            $reqUsername = $data['username'] ?? null;

            if (!$reqUsername) {
                return $this->error('Error on body');
            }

            $targetUser->setUsername($reqUsername);
            $entityManager->persist($targetUser);
            $entityManager->flush();

            $user = new UserDTO();
            $user->id = $targetUser->getId();
            $user->username = $targetUser->getUsername();
            $user->email = $targetUser->getEmail();
            $user->roles = $targetUser->getRoles();
            $user->created_at = $targetUser->getCreatedAt();

            $token = TokenServices::createToken($targetUser);

            return $this->success([
                'user' => $user,
                'token' => $token
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/users')]
    public function userList(Request $request, UserRepository $userRepository): JsonResponse
    {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $user = $token['user'];

            $users = $userRepository->findAll();

            $resUsers = [];

            foreach ($users as $oneUser) {
                if ($oneUser->getId() === $user->getId()) {
                    continue;
                }
                $resUser = new UserDTO();
                $resUser->id = $oneUser->getId();
                $resUser->username = $oneUser->getUsername();
                $resUser->email = $oneUser->getEmail();
                $resUser->roles = $oneUser->getRoles();
                $resUser->created_at = $oneUser->getCreatedAt();

                $resUsers[] = $resUser;
            }

            return $this->success([
                'users' => $resUsers
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
