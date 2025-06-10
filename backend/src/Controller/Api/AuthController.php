<?php

namespace App\Controller\Api;

use App\DTO\UserDTO;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Services\TokenServices;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class AuthController extends ApiController
{
    #[Route(path: '/login', methods: ['POST'])]
    // public function index(#[CurrentUser] ?User $user): Response
    public function login(Request $request, UserRepository $userRepo): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $reqEmail = $data['email'] ?? null;
            $reqPassword = $data['password'] ?? null;

            if (!$reqEmail || !$reqPassword) {
                return $this->error('Empty input');
            }

            $user = $userRepo->findOneBy([
                'email' => $reqEmail,
            ]);

            if (null === $user || !password_verify($reqPassword, $user->getPassword())) {
                return $this->error('Credential error');
            }

            
            $resUser = new UserDTO();
            $resUser->id = $user->getId();
            $resUser->username = $user->getUsername();
            $resUser->email = $user->getEmail();
            
            // Generate token
            $token = TokenServices::createToken($user);

            return $this->success([
                'user' => $resUser,
                'token' => $token
            ], 'User logged in successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route(path: '/logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return $this->success([], 'User logged out successfully');
    }

    #[Route(path: '/register', methods: ['POST'])]
    public function register(
        Request $request,
        UserRepository $userRepo,
        UserPasswordHasherInterface $userPasswordHasher,
        ValidatorInterface $validator,
        EntityManagerInterface $em
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            $reqUsername = $data['username'] ?? null;
            $reqEmail = $data['email'] ?? null;
            $reqPassword = $data['password'] ?? null;
            $reqConfirmPassword = $data['confirmPassword'] ?? null;

            if (!$reqUsername || !$reqEmail || !$reqPassword || !$reqConfirmPassword) {
                return $this->error('Empty input');
            }

            if ($reqPassword !== $reqConfirmPassword) {
                return $this->error('Password and confirmation password are not match');
            }

            $emailAlreadyExist = $userRepo->findOneBy([
                'email' => $reqEmail,
            ]);

            if ($emailAlreadyExist) {
                return $this->error('This email is already used');
            }

            $user = new User();
            $user->setUsername($reqUsername);
            $user->setEmail($reqEmail);
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $reqPassword
                )
            );
            $user->setCreatedAt(new DateTimeImmutable());

            $errors = $validator->validate($user);

            if (count($errors) > 0) {
                return $this->error((string) $errors[0]->getMessage());
            }

            $em->persist($user);
            $em->flush();

            return $this->success([
                'user' => [
                    'id' => $user->getId(),
                    'username' => $user->getUsername(),
                    'email' => $user->getEmail(),
                ],
            ], 'User registered', 201);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
