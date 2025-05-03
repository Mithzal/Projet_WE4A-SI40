<?php

namespace App\Repository;

use App\Entity\Ues;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ues>
 */
class UesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ues::class);
    }

    /**
     * Fetches the UEs a specific user is a member of.
     *
     * @param int $userId The ID of the user.
     * @return array An array structured with UE titles as keys.
     */
    public function findUserMemberUes(int $userId): array
    {
        $conn = $this->getEntityManager()->getConnection();
        $sql = '
            SELECT u.titre
            FROM ues u
            INNER JOIN membres m ON u.id = m.ue_id
            WHERE m.user_id = :userId
        '; // Simplified join assuming user_id is directly on membres table

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['userId' => $userId]);
        $rows = $result->fetchAllAssociative();

        $UEs = [];
        foreach ($rows as $row) {
            $nomUE = $row['titre'];
            if (!isset($UEs[$nomUE])) {
                $UEs[$nomUE] = [
                    'ue' => $nomUE
                ];
            }
        }
        return $UEs;
    }
    public function findCoursesByUser(int $userId): array
    {
        $connection = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT u.id, u.code, u.titre, u.description, u.illustration
        FROM ues u
        INNER JOIN membres m ON m.ue_id = u.id
        WHERE m.user_id = :userId
    ';

        $stmt = $connection->prepare($sql);
        $resultSet = $stmt->executeQuery(['userId' => $userId]);

        return $resultSet->fetchAllAssociative();
    }

    public function findTeachersByCourses(): array
    {
        $connection = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT u.id AS course_id, u.titre AS course_title, GROUP_CONCAT(CONCAT(t.prenom, " ", t.nom) SEPARATOR ", ") AS teachers
        FROM ues u
        INNER JOIN membres m ON m.ue_id = u.id
        INNER JOIN utilisateurs t ON m.user_id = t.id
        WHERE m.role = "enseignant"
        GROUP BY u.id
    ';

        $stmt = $connection->prepare($sql);
        $resultSet = $stmt->executeQuery();

        return $resultSet->fetchAllAssociative();
    }

    //    /**
    //     * @return Ues[] Returns an array of Ues objects
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

    //    public function findOneBySomeField($value): ?Ues
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

}
