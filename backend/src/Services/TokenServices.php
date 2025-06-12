<?php

namespace App\Services;

use App\Entity\User;

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

    public static function verifyToken(string $token, ?User $user = null): bool {
        $tokenVal = explode('.', $token);
        
        $expDate = json_decode(base64_decode($tokenVal[1]), true);
        
        if ($expDate['expDate'] < time()) {
            return false;
        }

        if ($user) {
            $payload = json_decode(base64_decode($tokenVal[0]), true);
    
            if ($payload['email'] !== $user->getEmail() && $payload['roles'] !== $user->getRoles()) {
                return false;
            }
        }

        return true;
    }
}
