<?php

namespace App\DTO;

class CategoryDTO {
    public int $id;
    public string $name;
    public string $description;
    public \DateTimeImmutable $created_at;
    public int $article_count;
    public array $articles;
}