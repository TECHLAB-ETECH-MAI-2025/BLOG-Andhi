<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * parent class, will extended by API controllers for
 * reusable return
 */
class ApiController extends AbstractController {

    // success json return
    protected function success(mixed $data = null, ?string $message = null, int $httpCode = 200): JsonResponse {
        return $this->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $httpCode);
    }

    // even error, the HTTP code must be 200 (OK)
    protected function error(string $message, mixed $data = null): JsonResponse {
        return $this->json([
            'success' => false,
            'data' => $data,
            'message' => $message,
        ], 200);
    }

}