<?php

namespace App\DTO;

class CommentDTO {
    public string $content;
    public \DateTimeImmutable $created_at;
    public int $author_id;
    public string $author_username;
}