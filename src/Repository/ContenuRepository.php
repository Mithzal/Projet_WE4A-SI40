<?php

namespace App\Repository;

use App\Entity\Contenu;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Contenu>
 */
class ContenuRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Contenu::class);
    }

    public function findActualitesByUser(int $userId, int $limit = 10): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT c.id, c.titre, c.type, c.date_crea, u.id AS ue_id, u.titre AS ue_titre
        FROM contenu c
        INNER JOIN ues u ON c.ue_id_id = u.id
        INNER JOIN membres_ues_ues mue ON mue.ues_id = u.id
        INNER JOIN membres_ues mu ON mu.id = mue.membres_ues_id
        INNER JOIN membres_ues_utilisateurs muu ON muu.membres_ues_id = mu.id
        WHERE muu.utilisateurs_id = :userId
        ORDER BY c.date_crea DESC
        LIMIT ' . (int) $limit;

        $stmt = $conn->prepare($sql);
        $resultSet = $stmt->executeQuery([
            'userId' => $userId,
        ]);

        return $resultSet->fetchAllAssociative();
    }

    //    /**
    //     * @return Contenu[] Returns an array of Contenu objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Contenu
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
