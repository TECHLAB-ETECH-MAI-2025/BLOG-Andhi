<?php

namespace App\Controller\Api;

use App\DTO\ArticleDTO;
use App\DTO\CategoryDTO;
use App\Entity\Article;
use App\Entity\ArticleLike;
use App\Entity\Category;
use App\Entity\User;
use App\Repository\ArticleLikeRepository;
use App\Repository\ArticleRepository;
use App\Repository\UserRepository;
use App\Services\TokenServices;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class ArticleController extends ApiController
{
    #[Route('/articles', methods: ['GET'])]
    public function index(
        Request $request,
        ArticleRepository $articleRepository,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            // $reqPage = $request->query->getInt('page');
            $data = $articleRepository->findAll();

            if (count($data) === 0) {
                return $this->success([
                    'articles' => []
                ], 'Empty article list');
            }

            $resArticles = [];

            foreach ($data as $article) {
                $resArticle = new ArticleDTO();
                $resArticle->id = $article->getId();
                $resArticle->title = $article->getTitle();
                $resArticle->content = $article->getContent();
                $resArticle->created_at = $article->getCreatedAt();
                $resArticle->author_id = $article->getAuthor()->getId();
                $resArticle->author_username = $article->getAuthor()->getUsername();
                $resArticle->categories = array_map(function (Category $articleCategory) {
                    $resCategory = new CategoryDTO();
                    $resCategory->id = $articleCategory->getId();
                    $resCategory->name = $articleCategory->getName();
                    return $resCategory;
                }, $article->getCategories()->toArray());
                $resArticle->like_count = $article->getLikes()->count();
                $resArticle->comment_count = $article->getComments()->count();

                $resArticles[] = $resArticle;
            }

            return $this->success([
                'articles' => $resArticles
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/article/create', methods: ['POST'])]
    public function create(
        Request $request,
        ValidatorInterface $validator,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $data = json_decode($request->getContent(), true);

            $reqTitle = $data['title'] ?? null;
            $reqContent = $data['content'] ?? null;
            $reqCategories = $data['categories'] ?? []; // all seleted category_id

            if (!$reqTitle && !$reqContent) {
                return $this->error('Empty input: title and content are required');
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

            $user = $entityManager->getRepository(User::class)->find($token['user']->getId());

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
            $resArticle->categories = array_map(function (Category $articleCategory) {
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
    public function show(
        int $id,
        Request $request,
        ArticleRepository $articleRepository,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

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
            $resArticle->categories = array_map(function (Category $articleCategory) {
                $resCategory = new CategoryDTO();
                $resCategory->id = $articleCategory->getId();
                $resCategory->name = $articleCategory->getName();
                return $resCategory;
            }, $article->getCategories()->toArray());
            $resArticle->like_count = $article->getLikes()->count();
            $resArticle->comment_count = $article->getComments()->count();
            $resArticle->is_liked = array_map(function (ArticleLike $like) {
                return $like->getUser()->getId();
            }, $article->getLikes()->toArray());

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
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $article = $articleRepository->find($id);

            if (!$article) {
                return $this->error('Article not found');
            }

            $user = $token['user'];
            if ($article->getAuthor() !== $user) {
                return $this->error('Forbidden request');
            }

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
            $resArticle->categories = array_map(function (Category $articleCategory) {
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
    public function delete(
        int $id,
        Request $request,
        ArticleRepository $articleRepository,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $article = $articleRepository->find($id);

            if (!$article) {
                return $this->error('Article not found');
            }

            $user = $token['user'];
            if ($article->getAuthor() !== $user) {
                return $this->error('Forbidden request');
            }

            $entityManager->remove($article);
            $entityManager->flush();

            return $this->success(null, 'Article "' . $article->getId() . '" is deleted successfully', 204);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/articles/search', methods: ['GET'])]
    public function searchArticles(Request $request, ArticleRepository $articleRepository): JsonResponse
    {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'));

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $query = $request->query->get('s', '');

            if (strlen($query) < 2) {
                return $this->error('Invalid query parameter');
            }

            $data = $articleRepository->searchByTitle($query, 10);

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
                $resArticle->categories = array_map(function (Category $articleCategory) {
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

    #[Route('/article/user/{id}', methods: ['GET'])]
    public function articleByUser(int $id, Request $request, ArticleRepository $articleRepository): JsonResponse
    {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'));

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $data = $articleRepository->getArticleByUser($id);

            if (count($data) === 0) {
                return $this->success([
                    'articles' => []
                ], 'Empty article list');
            }

            $resArticles = [];

            foreach ($data as $article) {
                $resArticle = new ArticleDTO();
                $resArticle->id = $article->getId();
                $resArticle->title = $article->getTitle();
                $resArticle->content = $article->getContent();
                $resArticle->created_at = $article->getCreatedAt();
                $resArticle->author_id = $article->getAuthor()->getId();
                $resArticle->author_username = $article->getAuthor()->getUsername();
                $resArticle->categories = array_map(function (Category $articleCategory) {
                    $resCategory = new CategoryDTO();
                    $resCategory->id = $articleCategory->getId();
                    $resCategory->name = $articleCategory->getName();
                    return $resCategory;
                }, $article->getCategories()->toArray());

                $resArticles[] = $resArticle;
            }

            return $this->success([
                'articles' => $resArticles
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/article/{id}/like')]
    public function likeArticle(
        Article $article,
        Request $request,
        EntityManagerInterface $entityManager,
        ArticleLikeRepository $likeRepository,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);

            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $user = $token['user'];

            $existingLike = $likeRepository->findOneBy([
                'article' => $article,
                'user' => $user
            ]);

            if ($existingLike) {
                $entityManager->remove($existingLike);
                $entityManager->flush();

                return $this->success([
                    'liked' => false,
                    'like_count' => $article->getLikes()->count()
                ]);
            } else {
                $like = new ArticleLike();
                $like->setArticle($article);
                $like->setUser($user);
                $like->setCreatedAt(new \DateTimeImmutable());

                $entityManager->persist($like);
                $entityManager->flush();

                return $this->success([
                    'liked' => true,
                    'like_count' => $article->getLikes()->count()
                ]);
            }
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
