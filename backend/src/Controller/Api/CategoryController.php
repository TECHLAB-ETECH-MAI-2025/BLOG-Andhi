<?php

namespace App\Controller\Api;

use App\DTO\ArticleDTO;
use App\DTO\CategoryDTO;
use App\Entity\Category;
use App\Repository\CategoryRepository;
use App\Repository\UserRepository;
use App\Services\TokenServices;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class CategoryController extends ApiController
{
    #[Route('/categories', methods: ['GET'])]
    public function index(
        Request $request,
        CategoryRepository $categoryRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'));
            
            if (!$token['isValid']) {
                return $this->error('Unauthenticated');
            }
            // $reqPage = $request->query->getInt('page');
            $data = $categoryRepository->findAll();

            if (count($data) === 0) {
                return $this->success([
                    'categories' => []
                ], 'Empty category list');
            }

            $resCategories = [];

            foreach ($data as $category) {
                $resCategory = new CategoryDTO();
                $resCategory->id = $category->getId();
                $resCategory->name = $category->getName();
                $resCategory->description = $category->getDescription();
                $resCategory->created_at = $category->getCreatedAt();
                $resCategory->article_count = count($category->getArticles());

                $resCategories[] = $resCategory;
            }

            return $this->success([
                'categories' => $resCategories
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/category/create', methods: ['POST'])]
    // #[IsGranted('ROLE_ADMIN')]
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

            if (!in_array('ROLE_ADMIN', $token['user']->getRoles())) {
                return $this->error('Forbidden request');
            }

            $data = json_decode($request->getContent(), true);

            $reqName = $data['name'] ?? null;
            $reqDescription = $data['description'] ?? '';

            if (!$reqName) {
                return $this->error('Name is required.');
            }

            $category = new Category();
            $category->setName($reqName);
            $category->setDescription($reqDescription);
            $category->setCreatedAt(new \DateTimeImmutable());

            $errors = $validator->validate($category);

            if (count($errors) > 0) {
                return $this->error((string) $errors[0]->getMessage());
            }

            $entityManager->persist($category);
            $entityManager->flush();

            return $this->success([
                'category' => $category
            ], 'Category "' . $category->getName() . '" created successfully', 201);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/category/{id}', methods: ['GET'])]
    // #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function show(int $id, Request $request, CategoryRepository $categoryRepository): JsonResponse
    {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'));
            
            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            $category = $categoryRepository->find($id);

            if (!$category) {
                return $this->error('Category not found');
            }

            $resCategory = new CategoryDTO();
            $resCategory->id = $category->getId();
            $resCategory->name = $category->getName();
            $resCategory->description = $category->getDescription();
            $resCategory->created_at = $category->getCreatedAt();
            $resCategory->article_count = count($category->getArticles());
            $resCategory->articles = array_map(function ($article) {
                $resArticle = new ArticleDTO();
                $resArticle->id = $article->getId();
                $resArticle->title = $article->getTitle();
                $resArticle->created_at = $article->getCreatedAt();
                $resArticle->categories = array_map(function ($artcileCategory) {
                    return $artcileCategory->getName();
                }, $article->getCategories()->toArray());
                return $resArticle;
            }, $category->getArticles()->toArray());

            return $this->success([
                'category' => $resCategory
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/category/{id}/edit', methods: ['PUT'])]
    // #[IsGranted('ROLE_ADMIN')]
    public function edit(
        int $id,
        CategoryRepository $categoryRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);
            
            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            if (!in_array('ROLE_ADMIN', $token['user']->getRoles())) {
                return $this->error('Forbidden request');
            }

            $category = $categoryRepository->find($id);

            if (!$category) {
                return $this->error('Category not found');
            }

            $data = json_decode($request->getContent(), true);

            $reqName = $data['name'] ?? null;
            $reqDescription = $data['description'] ?? null;

            if (
                ($reqName === $category->getName() && $reqDescription === $category->getDescription()) ||
                (!$reqName && !$reqDescription)
            ) {
                return $this->success(null, 'This category has not been changed');
            }

            $category->setName($reqName);
            $category->setDescription($reqDescription);

            $entityManager->persist($category);
            $entityManager->flush();

            $resCategory = new CategoryDTO();
            $resCategory->id = $category->getId();
            $resCategory->name = $category->getName();
            $resCategory->description = $category->getDescription();
            $resCategory->created_at = $category->getCreatedAt();
            $resCategory->article_count = count($category->getArticles());

            return $this->success([
                'category' => $resCategory,
            ], 'Category "' . $category->getName() . '" has been changed');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/category/{id}/delete', methods: ['DELETE'])]
    // #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id, Request $request, CategoryRepository $categoryRepository, EntityManagerInterface $entityManager, UserRepository $userRepository): JsonResponse
    {
        try {
            $token = TokenServices::verifyToken($request->headers->get('Authorization'), $userRepository);
            
            if (!$token['isValid']) {
                return $this->error('Unauthorized request');
            }

            if (!in_array('ROLE_ADMIN', $token['user']->getRoles())) {
                return $this->error('Forbidden request');
            }

            $category = $categoryRepository->findOneBy(['id' => $id]);

            if (!$category) {
                return $this->error('Category not found');
            }

            $entityManager->remove($category);
            $entityManager->flush();

            return $this->success(null, 'Category "' . $category->getName() . '" is deleted successfully', 204);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/categories/search', methods: ['GET'])]
    public function searchCategory(Request $request, CategoryRepository $categoryRepository): JsonResponse
    {
        try {
            if (!TokenServices::verifyToken($request->headers->get('Authorization'))) {
                return $this->error('Forbidden request');
            }
            
            $query = $request->query->get('s', '');

            if (strlen($query) < 2) {
                return $this->error('Invalid query parameter');
            }

            $data = $categoryRepository->searchByName($query);

            if (count($data) === 0) {
                return $this->success([
                    'categories' => []
                ], 'Empty category list');
            }

            $resCategories = [];

            foreach ($data as $category) {
                $resCategory = new CategoryDTO();
                $resCategory->id = $category->getId();
                $resCategory->name = $category->getName();
                $resCategory->description = $category->getDescription();
                $resCategory->created_at = $category->getCreatedAt();

                $resCategories[] = $resCategory;
            }

            return $this->success([
                'categories' => $resCategories
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
