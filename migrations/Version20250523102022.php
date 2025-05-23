<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250523102022 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE article_like DROP INDEX UNIQ_1C21C7B2A76ED395, ADD INDEX IDX_1C21C7B2A76ED395 (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE article_like DROP FOREIGN KEY FK_1C21C7B2A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE article_like ADD CONSTRAINT FK_1C21C7B2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE article_like DROP INDEX IDX_1C21C7B2A76ED395, ADD UNIQUE INDEX UNIQ_1C21C7B2A76ED395 (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE article_like DROP FOREIGN KEY FK_1C21C7B2A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE article_like ADD CONSTRAINT FK_1C21C7B2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
    }
}
