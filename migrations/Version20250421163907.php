<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250421163907 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE notes (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, ue_id_id INT NOT NULL, note DOUBLE PRECISION NOT NULL, coefficient INT NOT NULL, commentaire VARCHAR(255) NOT NULL, date DATE NOT NULL, INDEX IDX_11BA68C9D86650F (user_id_id), INDEX IDX_11BA68C1CA2F0B7 (ue_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notes ADD CONSTRAINT FK_11BA68C9D86650F FOREIGN KEY (user_id_id) REFERENCES utilisateurs (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notes ADD CONSTRAINT FK_11BA68C1CA2F0B7 FOREIGN KEY (ue_id_id) REFERENCES ues (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE notes DROP FOREIGN KEY FK_11BA68C9D86650F
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notes DROP FOREIGN KEY FK_11BA68C1CA2F0B7
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE notes
        SQL);
    }
}
