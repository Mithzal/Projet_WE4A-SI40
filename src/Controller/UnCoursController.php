<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\NotesRepository;
use App\Repository\UEsRepository;
use App\Repository\UtilisateursRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class UnCoursController extends AbstractController
{
    #[Route('/cours/{id}', name: 'Cours')]
    public function index(ContenuRepository $contenuRepository, UEsRepository $UEsRepository, EntityManagerInterface $entityManager): Response
    {
        $id = 1; // Replace with the actual course ID you want to display
        $course = $UEsRepository->find($id);

        // Get the currently connected user
        $currentUser = $this->getUser();

        // Fetch data related to the connected user

        $notesParUE = [];
        $UEs = [];


        if($currentUser) {
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

                // Format simplifié sans coefficient
                $notesParUE[$nomUE]['notes'][] = (string)$row['note'];
            }

            // Fetch all courses from the database
            $sql = 'SELECT UEs.titre
            FROM UEs
            INNER JOIN membres_ues_ues ON UEs.id = membres_ues_ues.ues_id
            INNER JOIN membres_ues ON membres_ues_ues.membres_ues_id = membres_ues.id
            INNER JOIN membres_ues_utilisateurs ON membres_ues.id = membres_ues_utilisateurs.membres_ues_id
            INNER JOIN Utilisateurs ON membres_ues_utilisateurs.utilisateurs_id = Utilisateurs.id
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

        //ces variables sont nécessaire pour les "popups" d'information du profile et des notes
        $data = [
            'variableTitre'=> 'Recherche Cours',

            'UEs' => $UEs,
            'course' => $course,
            'notes' => $notesParUE,
            'current_user' => $currentUser,
        ];
        return $this->render('un_cours/index.html.twig', $data);
    }
}
