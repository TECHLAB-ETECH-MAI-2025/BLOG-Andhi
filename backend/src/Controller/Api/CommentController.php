<?php

namespace App\Controller\Api;

use App\DTO\CommentDTO;
use App\Entity\Article;
use App\Entity\Comment;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class CommentController extends ApiController
{
    #[Route('/comment/{articleId}', methods: ['POST'])]
    public function add(int $articleId, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $article = $entityManager->getRepository(Article::class)->find($articleId);
    
            if (!$article) {
                return $this->error('Invalid article');
            }
            
            $data = json_decode($request->getContent(), true);
    
            $reqContent = $data['content'] ?? null;
            $reqUserId = $data['user_id'] ?? null;
            
            if (!$reqContent) {
                return $this->error('Comment can not be empty');
            }
    
            // $user = $this->getUser();
    
            // temporary req for user
            $user = $entityManager->getRepository(User::class)->find($reqUserId);
    
            $comment = new Comment();
            $comment->setContent($reqContent);
            $comment->setAuthor($user);
            $comment->setArticle($article);
            $comment->setCreatedAt(new \DateTimeImmutable());
    
            $entityManager->persist($comment);
            $entityManager->flush();

            $resComment = new CommentDTO();
            $resComment->content = $comment->getContent();
            $resComment->created_at = $comment->getCreatedAt();
            $resComment->author_id = $comment->getAuthor()->getId();
            $resComment->author_username = $comment->getAuthor()->getUsername();
    
            return $this->success([
                'comment' => $resComment
            ], $user->getUsername().' commented', 201);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/comment/{articleId}/edit/{commentId}', methods: ['PUT'])]
    public function edit(int $articleId, int $commentId, Request $request, EntityManagerInterface $entityManager): JsonResponse {
        try {
            $comment = $entityManager->getRepository(Comment::class)->find($commentId);
    
            if (!$comment) {
                return $this->error('Invalid comment');
            }

            if ($comment->getArticle()->getId() !== $articleId) {
                return $this->error('Invalid article');
            }

            $data = json_decode($request->getContent(), true);

            $reqContent = $data['content'] ?? null;
            $reqUserId = $data['user_id'] ?? null;
            
            if (!$reqContent) {
                return $this->error('Comment can not be empty');
            }
    
            // $user = $this->getUser();
    
            // temporary req for user
            $user = $entityManager->getRepository(User::class)->find($reqUserId);

            $comment->setContent($reqContent);

            $entityManager->persist($comment);
            $entityManager->flush();

            $resComment = new CommentDTO();
            $resComment->content = $comment->getContent();
            $resComment->created_at = $comment->getCreatedAt();
            $resComment->author_id = $comment->getAuthor()->getId();
            $resComment->author_username = $comment->getAuthor()->getUsername();

            return $this->success([
                'comment' => $resComment
            ], 'Comment edited', 204);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    #[Route('/comment/{articleId}/remove/{commentId}', methods: ['DELETE'])]
    public function remove(int $articleId, int $commentId, EntityManagerInterface $entityManager): JsonResponse {
        try {
            $comment = $entityManager->getRepository(Comment::class)->find($commentId);
    
            if (!$comment) {
                return $this->error('Invalid comment');
            }

            if ($comment->getArticle()->getId() !== $articleId) {
                return $this->error('Invalid article');
            }

            $entityManager->remove($comment);
            $entityManager->flush();

            return $this->success(null, 'Comment removed', 204);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
