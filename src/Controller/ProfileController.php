<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends AbstractController
{
    #[Route('/profile/{id}', name: 'app_profile_index')]
    public function index(int $id, UserRepository $userRepository): Response
    {
        $isCurrentUser = $this->getUser()->getId() == $id;
        $targetUser = $userRepository->findOneBy([
            'id' => $id
        ]);

        return $this->render('profile/index.html.twig', [
            'user_target' => $targetUser,
            'is_current_user' => $isCurrentUser
        ]);
    }
}
