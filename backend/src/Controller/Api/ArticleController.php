<?php

namespace App\Controller\Api;

use App\Entity\Article;
use App\Entity\ArticleLike;
use App\Entity\Comment;
use App\Form\CommentType;
use App\Repository\ArticleLikeRepository;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ArticleController extends AbstractController
{
    #[Route('/api/articles', name: 'api_articles_index', methods: ['POST'])]
    public function index(Request $request, ArticleRepository $articleRepository): JsonResponse
    {
        $draw = $request->request->getInt('draw');
        $start = $request->request->getInt('start');
        $length = $request->request->getInt('length');
        $search = $request->request->all('search')['value'] ?? null;
        $orders = $request->request->all('order') ?? [];

        $columns = [
            0 => 'a.id',
            1 => 'a.title',
            2 => 'user',
            3 => 'categories',
            4 => 'likesCount',
            5 => 'commentsCount',
            6 => 'a.createdAt',
        ];

        $orderColumn = $columns[$orders[0]['column'] ?? 0] ?? 'a.id';
        $orderDir = $orders[0]['dir'] ?? 'desc';

        $results = $articleRepository->findForDataTable($start, $length, $search, $orderColumn, $orderDir);

        $data = [];
        foreach ($results['data'] as $article) {
            $categoryNames = array_map(function($category) {
                return sprintf('%s', $category->getTitle());
            }, $article->getCategories()->toArray());

            $data[] = [
                'id' => $article->getId(),
                'title' => sprintf('<a href="%s" class="text-dark text-decoration-none link:text-decoration-underline">%s</a>',
							$this->generateUrl('app_article_show', ['id' => $article->getId()]),
							htmlspecialchars($article->getTitle())
                ),
                'user' => $article->getAuthor()->getUsername(),
                'categories' => implode(' ', $categoryNames),
                'commentsCount' => $article->getComments()->count(),
                'likesCount' => $article->getLikes()->count(),
                'createdAt' => $article->getCreatedAt()->format('d/m/Y H:i'),
                'actions' => $this->renderView('article/_delete_form.html.twig', [
                    'article' => $article
                ])
            ];
        }
        
        return new JsonResponse([
            'draw' => $draw,
            'recordsTotal' => $results['totalCount'],
            'recordsFiltered' => $results['filteredCount'],
            'data' => $data
        ]);
    }

    #[Route('/articles/search', name: 'api_articles_search', methods: ['GET'])]
    public function search(Request $request, ArticleRepository $articleRepository): JsonResponse
    {
        $query = $request->query->get('q', '');

        if (strlen($query) < 2) {
            return new JsonResponse(['results' => []]);
        }

        $articles = $articleRepository->searchByTitle($query, 10);

        $results = [];
        foreach ($articles as $article) {
            $categoryNames = array_map(function($category) {
                return $category->getTitle();
            }, $article->getCategories()->toArray());

            $results[] = [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'categories' => $categoryNames
            ];
        }

        return new JsonResponse(['results' => $results]);
    }

    #[Route('/article/{id}/comment', name: 'api_article_comment', methods: ['POST'])]
    public function addComment(Article $article, Request $request, EntityManagerInterface $entityManager):JsonResponse
    {
        $user = $this->getUser();
        $comment = new Comment();
        $comment->setAuthor($user);
        $comment->setArticle($article);
        $comment->setCreatedAt(new \DateTimeImmutable());

        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($comment);
            $entityManager->flush();

            return new JsonResponse([
                'success' => true,
                'commentHtml' => $this->renderView('comment/_comment_item_list.html.twig', [
                    'comment' => $comment
                ]),
                'commentsCount' => $article->getComments()->count()
            ]);
        }

        // En cas d'erreur, renvoyer les erreurs du formulaire
        $errors = [];
        foreach ($form->getErrors(true) as $error) {
            $errors[] = $error->getMessage();
        }

        return new JsonResponse([
            'success' => false,
            'error' => count($errors) > 0 ? $errors[0] : 'Formulaire invalide'
        ], Response::HTTP_BAD_REQUEST);
    }

    #[Route('/article/{id}/like', name: 'api_article_like', methods: ['GET', 'POST'])]
    public function likeArticle(
        Article $article,
        EntityManagerInterface $entityManager,
        ArticleLikeRepository $likeRepository,
    ): JsonResponse {

        $user = $this->getUser();

        $existingLike = $likeRepository->findOneBy([
            'article' => $article,
            'user' => $user
        ]);

        if ($existingLike) {
            $entityManager->remove($existingLike);
            $entityManager->flush();
            
            return new JsonResponse([
                'success' => true,
                'liked' => false,
                'likesCount' => $article->getLikes()->count()
            ]);
        } else {
            $like = new ArticleLike();
            $like->setArticle($article);
            $like->setUser($user);
            $like->setCreatedAt(new \DateTimeImmutable());

            $entityManager->persist($like);
            $entityManager->flush();

            return new JsonResponse([
                'success' => true,
                'liked' => true,
                'likesCount' => $article->getLikes()->count()
            ]);
        }
    }
}
