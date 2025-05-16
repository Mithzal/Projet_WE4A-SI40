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

    /**
     * Récupère toutes les notes d'un utilisateur avec les informations de l'UE.
     */
    public function findNotesByUser(int $userId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT n.id, n.note, n.coefficient, n.commentaire, n.date, u.titre AS ue_titre
        FROM notes n
        INNER JOIN ues u ON n.ue_id = u.id
        WHERE n.user_id = :userId
    ';

        $stmt = $conn->prepare($sql);
        $resultSet = $stmt->executeQuery([
            'userId' => $userId,
        ]);

        return $resultSet->fetchAllAssociative();
    }

    /**
     * Récupère les notes d'un utilisateur et les regroupe par UE.
     * Retourne un tableau où chaque entrée contient le nom de l'UE et la liste des notes associées.
     *
     * @param int $userId L'identifiant de l'utilisateur
     * @return array      Notes regroupées par UE
     */
    public function findNotesGroupedByUeForUser(int $userId): array
    {
        $conn = $this->getEntityManager()->getConnection();
        $sql = '
            SELECT n.note, u.titre AS nom_UE
            FROM notes n
            INNER JOIN ues u ON n.ue_id = u.id
            WHERE n.user_id = :userId
        ';
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['userId' => $userId]);
        $rows = $result->fetchAllAssociative();

        $notesParUE = [];
        foreach ($rows as $row) {
            $nomUE = $row['nom_UE'];
            if (!isset($notesParUE[$nomUE])) {
                $notesParUE[$nomUE] = [
                    'ue' => $nomUE,
                    'notes' => []
                ];
            }
            $notesParUE[$nomUE]['notes'][] = (string)$row['note'];
        }

        // Return values only, indexed numerically, as expected by the controller
        return array_values($notesParUE);
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

