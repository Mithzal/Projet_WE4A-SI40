<?php

namespace App\Repository;

use App\Entity\UEs;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UEs>
 */
class UEsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UEs::class);
    }
    public function findCoursesByUser(int $userId): array
    {
        $connection = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT u.id, u.code, u.titre, u.description
        FROM ues u
        INNER JOIN membres_ues_ues mue ON mue.ues_id = u.id
        INNER JOIN membres_ues mu ON mu.id = mue.membres_ues_id
        INNER JOIN membres_ues_utilisateurs muu ON muu.membres_ues_id = mu.id
        WHERE muu.utilisateurs_id = :userId
    ';

        $stmt = $connection->prepare($sql);
        $resultSet = $stmt->executeQuery(['userId' => $userId]);

        return $resultSet->fetchAllAssociative();
    }

    //    /**
    //     * @return UEs[] Returns an array of UEs objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?UEs
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
