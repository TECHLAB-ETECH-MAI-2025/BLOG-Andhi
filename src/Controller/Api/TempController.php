<?php

namespace App\Controller\Api;

use App\Services\TempService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class TempController extends AbstractController
{
    #[Route('/api/exchange-rate-calculator', name: 'api_temp_exchange', methods: ['POST'])]
    public function calculate(Request $request, TempService $tempService): JsonResponse
    {
        $amount = $request->request->get('amount');
        $fromCurr = $request->request->get('fromCurr');
        $toCurr = $request->request->get('toCurr');
        if (!$amount && !$fromCurr && $toCurr) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Erreur du montant ou des devises'
            ], 200);
        }
        $content = $tempService->getCalcultator($amount, $fromCurr, $toCurr);
        return new JsonResponse([
            'status' => 'success',
            'content' => $content
        ]);
    }
}