<?php

namespace App\Repository;

use App\Entity\Notes;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Notes>
 */
class NotesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notes::class);
    }

    public function findNotesByUser(int $userId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT n.id, n.note, n.coefficient, n.commentaire, n.date, u.titre AS ue_titre
        FROM notes n
        INNER JOIN ues u ON n.ue_id_id = u.id
        WHERE n.user_id_id = :userId
    ';

        $stmt = $conn->prepare($sql);
        $resultSet = $stmt->executeQuery([
            'userId' => $userId,
        ]);

        return $resultSet->fetchAllAssociative();
    }

//    /**
//     * @return Notes[] Returns an array of Notes objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('n')
//            ->andWhere('n.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('n.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Notes
//    {
//        return $this->createQueryBuilder('n')
//            ->andWhere('n.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
