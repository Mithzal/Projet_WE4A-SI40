<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250427081041 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE contenu (id INT AUTO_INCREMENT NOT NULL, ue_id_id INT NOT NULL, titre VARCHAR(100) NOT NULL, type VARCHAR(255) NOT NULL, fichier LONGBLOB DEFAULT NULL, date_crea DATETIME NOT NULL, INDEX IDX_89C2003F1CA2F0B7 (ue_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE membres_ues (id INT AUTO_INCREMENT NOT NULL, role_uv VARCHAR(10) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE membres_ues_utilisateurs (membres_ues_id INT NOT NULL, utilisateurs_id INT NOT NULL, INDEX IDX_4BBEF49EBEB8449B (membres_ues_id), INDEX IDX_4BBEF49E1E969C5 (utilisateurs_id), PRIMARY KEY(membres_ues_id, utilisateurs_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE membres_ues_ues (membres_ues_id INT NOT NULL, ues_id INT NOT NULL, INDEX IDX_704A56D6BEB8449B (membres_ues_id), INDEX IDX_704A56D65B75D6BC (ues_id), PRIMARY KEY(membres_ues_id, ues_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE notes (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, ue_id_id INT NOT NULL, note DOUBLE PRECISION NOT NULL, coefficient INT NOT NULL, commentaire VARCHAR(255) NOT NULL, date DATE NOT NULL, INDEX IDX_11BA68C9D86650F (user_id_id), INDEX IDX_11BA68C1CA2F0B7 (ue_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE ues (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(4) NOT NULL, titre VARCHAR(30) NOT NULL, description VARCHAR(255) DEFAULT NULL, illustration LONGBLOB DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE utilisateurs (id INT AUTO_INCREMENT NOT NULL, prenom VARCHAR(50) NOT NULL, nom VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, mot_de_passe VARCHAR(255) NOT NULL, role VARCHAR(10) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contenu ADD CONSTRAINT FK_89C2003F1CA2F0B7 FOREIGN KEY (ue_id_id) REFERENCES ues (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_utilisateurs ADD CONSTRAINT FK_4BBEF49EBEB8449B FOREIGN KEY (membres_ues_id) REFERENCES membres_ues (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_utilisateurs ADD CONSTRAINT FK_4BBEF49E1E969C5 FOREIGN KEY (utilisateurs_id) REFERENCES utilisateurs (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_ues ADD CONSTRAINT FK_704A56D6BEB8449B FOREIGN KEY (membres_ues_id) REFERENCES membres_ues (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_ues ADD CONSTRAINT FK_704A56D65B75D6BC FOREIGN KEY (ues_id) REFERENCES ues (id) ON DELETE CASCADE
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
            ALTER TABLE contenu DROP FOREIGN KEY FK_89C2003F1CA2F0B7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_utilisateurs DROP FOREIGN KEY FK_4BBEF49EBEB8449B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_utilisateurs DROP FOREIGN KEY FK_4BBEF49E1E969C5
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_ues DROP FOREIGN KEY FK_704A56D6BEB8449B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE membres_ues_ues DROP FOREIGN KEY FK_704A56D65B75D6BC
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notes DROP FOREIGN KEY FK_11BA68C9D86650F
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notes DROP FOREIGN KEY FK_11BA68C1CA2F0B7
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE contenu
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE membres_ues
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE membres_ues_utilisateurs
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE membres_ues_ues
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE notes
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE ues
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE utilisateurs
        SQL);
    }
}
