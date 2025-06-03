<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends ApiController
{
    #[Route(path: '/api/login', methods: ['POST'])]
    // public function index(#[CurrentUser] ?User $user): Response
    public function index(Request $request, UserRepository $userRepo): JsonResponse
    {
        try {

            $data = json_decode($request->getContent(), true);

            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;

            if (!$email || !$password) {
                return $this->error('Empty input');
            }
            
            $user = $userRepo->findOneBy([
                'email' => $email,
            ]);
            
            if (null === $user || !password_verify($password, $user->getPassword())) {
                return $this->error('Credential error');
            }
    
            // temporary token
            $token = '1234';
    
            return $this->success([
                'user' => [
                    'id' => $user->getId(),
                    'username' => $user->getUsername(),
                    'email' => $user->getEmail(),
                ],
                'token' => $token
            ], 'User logged in successfully');
            
        } catch (\Throwable $th) {

            return $this->error($th->getMessage());

        }
        
    }

    #[Route(path: '/api/logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        
        return $this->success([], 'User logged out successfully');

    }

    #[Route(path: '/api/register', methods: ['POST'])]
    public function register(
        Request $request,
        UserRepository $userRepo,
        UserPasswordHasherInterface $userPasswordHasher,
        ValidatorInterface $validator,
        EntityManagerInterface $em
        ): JsonResponse
    {
        try {

            $data = json_decode($request->getContent(), true);

            $username = $data['username'] ?? null;
            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;

            if (!$username || !$email || !$password) {
                return $this->error('Empty input');
            }
            
            $emailAlreadyExist = $userRepo->findOneBy([
                'email' => $email,
            ]);
            
            if ($emailAlreadyExist) {
                return $this->error('This email is already used');
            }
    
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $password
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
            ], 'User registered');
            
        } catch (\Throwable $th) {

            return $this->error($th->getMessage());

        }
    }
}