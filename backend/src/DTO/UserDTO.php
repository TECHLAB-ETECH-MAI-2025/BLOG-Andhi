<?php

namespace App\DTO;

class UserDTO {
    public int $id;
    public string $username;
    public string $email;
    public array $roles;
    public \DateTimeImmutable $created_at;
}