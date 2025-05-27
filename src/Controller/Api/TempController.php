<?php

namespace App\Controller\Api;

use App\Services\TempService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class TempController extends AbstractController
{
    #[Route('/api/exchange-rate-calculator/{amount}', name: 'api_temp_exchange', methods: ['GET'])]
    public function calculate(TempService $tempService, int $amount): JsonResponse
    {
        if (!$amount) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Amount error'
            ], 400);
        }
        $content = $tempService->getCalcultator($amount);
        return new JsonResponse([
            'test' => 'test ok',
            'content' => $content
        ]);
    }
}