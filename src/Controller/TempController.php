<?php

namespace App\Controller;

use App\Services\TempService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/temp', name: 'app_temp_')]
class TempController extends AbstractController
{
    #[Route('/json', name: 'jsonplaceholder')]
    public function index(TempService $tempService): Response
    {
        $content = $tempService->getJsonPlaceholder();
        return $this->render('temp/index.html.twig', [
            'content' => $content,
        ]);
    }

    #[Route('/exchange-rate-calculator', name: 'exchange')]
    public function calculate(): Response
    {
        return $this->render('temp/calculate.html.twig');
    }
}
