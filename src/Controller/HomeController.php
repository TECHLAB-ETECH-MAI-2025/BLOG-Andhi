<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/')]
class HomeController extends AbstractController  {

    #[Route('/', name: 'app_public_home', methods: ['GET'])]
    public function index(ArticleRepository $articleRepository) {
        $articles = $articleRepository->getLastArticles(3);
        return $this->render('public/home.html.twig', [
            'articles' => $articles
        ]);
    }
}