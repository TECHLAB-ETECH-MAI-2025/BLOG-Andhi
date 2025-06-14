<?php

namespace App\Controller\Api;

use App\DTO\UserDTO;
use App\Repository\UserRepository;
use App\Services\TokenServices;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class UserController extends ApiController
{
    #[Route('/user/{id}')]
    public function profile(int $id, Request $request, UserRepository $userRepository): JsonResponse
    {
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
    }
}
