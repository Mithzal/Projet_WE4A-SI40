<?php

namespace App\Controller;

use App\Repository\UesRepository;
use App\Repository\NotesRepository;
use App\Repository\UtilisateursRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class RechercheCoursController extends AbstractController
{
    #[Route('/rechercheCours', name: 'RechercheCours')]
    public function index(
        UEsRepository $UEsRepository,
        EntityManagerInterface $entityManager
    ): Response {
        $currentUser = $this->getUser();
        $UEsDetail = $UEsRepository->findAll();

        $teachersByCourse = $UEsRepository->findTeachersByCourses();

        $notesParUE = [];
        $UEs = [];

        if ($currentUser) {
            $conn = $entityManager->getConnection();

            $sql = '
                SELECT notes.note, ues.titre AS nom_UE
                FROM notes
                INNER JOIN UEs ON notes.UE_id_id = UEs.id
                INNER JOIN Utilisateurs ON notes.user_id_id = Utilisateurs.id
                WHERE Utilisateurs.id = :id
            ';
            $stmt = $conn->prepare($sql);
            $result = $stmt->executeQuery(['id' => $currentUser->getId()]);
            $rows = $result->fetchAllAssociative();

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

            $sql = '
                SELECT UEs.titre
                FROM UEs
                INNER JOIN membres ON UEs.id = membres.ue_id
                INNER JOIN Utilisateurs ON membres.user_id = Utilisateurs.id
                WHERE Utilisateurs.id = :id
            ';
            $stmt = $conn->prepare($sql);
            $result = $stmt->executeQuery(['id' => $currentUser->getId()]);
            $rows = $result->fetchAllAssociative();

            foreach ($rows as $row) {
                $nomUE = $row['titre'];
                if (!isset($UEs[$nomUE])) {
                    $UEs[$nomUE] = [
                        'ue' => $nomUE
                    ];
                }
            }
        }

        $data = [
            'variableTitre' => 'Recherche Cours',
            'UEs_details' => $UEsDetail,
            'UEs' => $UEs,
            'notes' => array_values($notesParUE),
            'teachersByCourse' => $teachersByCourse,
            'current_user' => $currentUser,
        ];
        return $this->render('recherche_cours/index.html.twig', $data);
    }
}