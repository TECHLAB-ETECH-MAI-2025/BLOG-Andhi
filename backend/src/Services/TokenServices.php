<?php

namespace App\Services;

use App\DTO\UserDTO;
use App\Entity\User;
use App\Repository\UserRepository;

class TokenServices {
    public static function createToken(User $user): string {
        // Encode user information (json) to unreadable string
        $payload = base64_encode(json_encode([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]));

        // Encode expiration date to unreadable string
        $expDate = base64_encode(json_encode([
            'expDate' => time() + (30 * 24 * 60 * 60)
        ]));
        
        return $payload.'.'.$expDate;
    }

    public static function verifyToken(string $token, ?UserRepository $userRepository = null): array {
        if (!$token && !$userRepository) {
            return [
                'isValid' => false
            ];
        }

        $tokenVal = explode('.', $token);
        
        $expDate = json_decode(base64_decode($tokenVal[1]), true);
        
        if ($expDate['expDate'] < time()) {
            return [
                'isValid' => false
            ];
        }

        if (!$userRepository) {
            return [
                'isValid' => true
            ];
        }

        $payload = json_decode(base64_decode($tokenVal[0]), true);

        $user = $userRepository->find($payload['id']);

        if ($payload['email'] !== $user->getEmail() && $payload['roles'] !== $user->getRoles()) {
            return [
                'isValid' => false
            ];
        }

        return [
            'user' => $user,
            'isValid' => true
        ];
    }
}
