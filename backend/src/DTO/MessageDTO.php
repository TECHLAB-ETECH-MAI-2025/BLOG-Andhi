<?php

namespace App\DTO;

class MessageDTO {
    public int $id;
    public string $content;
    public \DateTimeImmutable $created_at;
    public int $sender_id;
    public string $sender_username;
    public int $receiver_id;
    public string $receiver_username;
}