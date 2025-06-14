<?php

namespace App\DTO;

class ArticleDTO {
    public int $id;
    public string $title;
    public string $content;
    public \DateTimeImmutable $created_at;
    public int $author_id;
    public string $author_username;
    public array $categories;
    public array $is_liked;
    public int $like_count;
    public int $comment_count;
}