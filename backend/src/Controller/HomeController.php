<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/')]
class HomeController extends AbstractController  {

    #[Route('/', name: 'app_public_home', methods: ['GET'])]
    public function index() {
        return $this->render('public/home.html.twig', []);
    }
}