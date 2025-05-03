<?php

namespace App\Repository;

use App\Entity\Utilisateurs;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Utilisateurs>
 */
class UtilisateursRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Utilisateurs::class);
    }

    /**
     * Fetches participants (users) for a specific UE along with their roles.
     *
     * @param int $ueId The ID of the UE.
     * @return array An array of participants, each containing user data and their role.
     */
    public function findParticipantsByUe(int $ueId): array
    {
        $conn = $this->getEntityManager()->getConnection();
        $sql = '
            SELECT u.*, m.role
            FROM Utilisateurs u
            JOIN membres m ON u.id = m.user_id
            WHERE m.ue_id = :ueId
        ';

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['ueId' => $ueId]);
        return $result->fetchAllAssociative();
    }
    //    /**
    //     * @return Utilisateurs[] Returns an array of Utilisateurs objects
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

    //    public function findOneBySomeField($value): ?Utilisateurs
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
