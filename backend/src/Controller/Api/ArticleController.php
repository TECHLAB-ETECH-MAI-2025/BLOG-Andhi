<?php

namespace App\Controller\Api;

use App\DTO\ArticleDTO;
use App\DTO\CategoryDTO;
use App\Entity\Article;
use App\Entity\Category;
use App\Entity\User;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class ArticleController extends ApiController
{
    #[Route('/articles', methods: ['GET'])]
    public function index(ArticleRepository $articleRepository): JsonResponse
    {
        try {
            // $reqPage = $request->query->getInt('page');
            $data = $articleRepository->findAll();
            
            if (count($data) === 0) {
                return $this->success([
                    'articles' => []
                ], 'Empty article list');
            }
            
            $resCategories = [];

            foreach ($data as $article) {
                $resArticle = new ArticleDTO();
                $resArticle->id = $article->getId();
                $resArticle->title = $article->getTitle();
                $resArticle->content = $article->getContent();
                $resArticle->created_at = $article->getCreatedAt();
                $resArticle->author_id = $article->getAuthor()->getId();
                $resArticle->author_username = $article->getAuthor()->getUsername();
                $resArticle->categories = array_map(function ($articleCategory) {
                    $resCategory = new CategoryDTO();
                    $resCategory->id = $articleCategory->getId();
                    $resCategory->name = $articleCategory->getName();
                    return $resCategory;
                }, $article->getCategories()->toArray());

                $resCategories[] = $resArticle;
            }

            return $this->success([
                'articles' => $resCategories
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/article/create', methods: ['POST'])]
    public function create(
        Request $request,
        ValidatorInterface $validator,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            $reqTitle = $data['title'] ?? null;
            $reqContent = $data['content'] ?? null;
            $reqUserId = $data['user_id'] ?? null;
            $reqCategories = $data['categories'] ?? []; // all seleted category_id

            if (!$reqTitle && !$reqContent) {
                return $this->error('Empty input: title and content are required');
            }

            if (!$reqUserId) {
                return $this->error('Invalid user_id');
            }

            if (empty($data['categories'])) {
                return $this->error('An article need at least one category');
            }

            $article = new Article();
            $article->setTitle($reqTitle);
            $article->setContent($reqContent);

            // categoryId list is not empty, now check if there are exists
            foreach ($reqCategories as $categoryId) {
                $category = $entityManager->getRepository(Category::class)->find($categoryId);
                if ($category) {
                    $article->getCategories()->add($category);
                }
            }

            // RESULT: not exist or undefined category
            if (count($article->getCategories()) === 0) {
                return $this->error('Invalid categories');
            }

            $user = $entityManager->getRepository(User::class)->find($reqUserId);

            if (!$user) {
                return $this->error('Invalid user');
            }

            $article->setAuthor($user);
            $article->setCreatedAt(new \DateTimeImmutable());

            $errors = $validator->validate($article);

            if (count($errors) > 0) {
                return $this->error((string) $errors[0]->getMessage());
            }

            $entityManager->persist($article);
            $entityManager->flush();

            $resArticle = new ArticleDTO();
            $resArticle->id = $article->getId();
            $resArticle->title = $article->getTitle();
            $resArticle->content = $article->getContent();
            $resArticle->created_at = $article->getCreatedAt();
            $resArticle->author_id = $article->getAuthor()->getId();
            $resArticle->author_username = $article->getAuthor()->getUsername();
            $resArticle->categories = array_map(function ($articleCategory) {
                $resCategory = new CategoryDTO();
                $resCategory->id = $articleCategory->getId();
                $resCategory->name = $articleCategory->getName();
                return $resCategory;
            }, $article->getCategories()->toArray());

            return $this->success([
                'article' => $resArticle
            ], 'Article created successfully', 201);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/article/{id}', methods: ['GET'])]
    public function show(int $id, ArticleRepository $articleRepository): JsonResponse
    {
        try {
            $article = $articleRepository->find($id);

            if (!$article) {
                return $this->error('Article not found');
            }

            $resArticle = new ArticleDTO();
            $resArticle->id = $article->getId();
            $resArticle->title = $article->getTitle();
            $resArticle->content = $article->getContent();
            $resArticle->created_at = $article->getCreatedAt();
            $resArticle->author_id = $article->getAuthor()->getId();
            $resArticle->author_username = $article->getAuthor()->getUsername();
            $resArticle->categories = array_map(function ($articleCategory) {
                $resCategory = new CategoryDTO();
                $resCategory->id = $articleCategory->getId();
                $resCategory->name = $articleCategory->getName();
                return $resCategory;
            }, $article->getCategories()->toArray());

            return $this->success([
                'article' => $resArticle
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/article/{id}/edit', methods: ['PUT'])]
    public function edit(
        int $id,
        ArticleRepository $articleRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $article = $articleRepository->find($id);

            if (!$article) {
                return $this->error('Article not found');
            }

            // $user = $this->getUser();

            // if ($article->getAuthor() !== $user) {
            //     return $this->error('Unauthorized request');
            // }

            $data = json_decode($request->getContent(), true);

            $reqTitle = $data['title'] ?? null;
            $reqContent = $data['content'] ?? null;
            $reqCategories = $data['categories'] ?? []; // all seleted category_id

            if (
                ($reqTitle === $article->getTitle() && $reqContent === $article->getContent()) ||
                (!$reqTitle && !$reqContent)
            ) {
                return $this->success(null, 'This article has not been changed');
            }

            $article->setTitle($reqTitle);
            $article->setContent($reqContent);
            $article->getCategories()->clear();

            // verify if categories selected are exists
            foreach ($reqCategories as $categoryId) {
                $category = $entityManager->getRepository(Category::class)->find($categoryId);
                if ($category) {
                    $article->getCategories()->add($category);
                }
            }

            // RESULT: not exist or undefined category
            if (count($article->getCategories()) === 0) {
                return $this->error('Invalid categories');
            }

            $entityManager->persist($article);
            $entityManager->flush();

            $resArticle = new ArticleDTO();
            $resArticle->id = $article->getId();
            $resArticle->title = $article->getTitle();
            $resArticle->content = $article->getContent();
            $resArticle->created_at = $article->getCreatedAt();
            $resArticle->author_id = $article->getAuthor()->getId();
            $resArticle->author_username = $article->getAuthor()->getUsername();
            $resArticle->categories = array_map(function ($articleCategory) {
                $resCategory = new CategoryDTO();
                $resCategory->id = $articleCategory->getId();
                $resCategory->name = $articleCategory->getName();
                return $resCategory;
            }, $article->getCategories()->toArray());

            return $this->success([
                'article' => $resArticle,
            ], 'Article has been changed');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/article/{id}/delete', methods: ['DELETE'])]
    public function delete(int $id, ArticleRepository $articleRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $article = $articleRepository->find($id);

            if (!$article) {
                return $this->error('Article not found');
            }

            if ($article->getAuthor() !== $this->getUser()) {
                return $this->error('Unauthorized request');
            }

            $entityManager->remove($article);
            $entityManager->flush();

            return $this->success(null, 'Article "' . $article->getId() . '" is deleted successfully', 204);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
