<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\UesRepository;
use App\Repository\NotesRepository;
use App\Repository\UtilisateursRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TableauDeBordController extends AbstractController
{
    #[Route('/tableauDeBord', name: 'TableauDeBord')]
    public function index(UesRepository $UesRepository, UtilisateursRepository $utilisateursRepository, EntityManagerInterface $entityManager): Response
    {
        // Get the currently connected user
        $currentUser = $this->getUser();
        $Utilisateur = $utilisateursRepository->find($currentUser->getId());

        // Fetch data related to the connected user
        $UEsDetails = $UesRepository->findCoursesByUser($Utilisateur->getId());

        $notesParUE = [];
        $UEs = [];


        if($currentUser) {
            $conn = $entityManager->getConnection();


            $sql = '
        SELECT notes.note, ues.titre AS nom_UE
            FROM notes
            INNER JOIN UEs ON notes.UE_id = UEs.id
            INNER JOIN Utilisateurs ON notes.user_id = Utilisateurs.id
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


        //ces variables sont nécessaire pour les "popups" d'information du profile et des notes
        $data = [
            'variableTitre'=> 'Mes Cours',
            'UEs_details' => $UEsDetails,
            'notes' => array_values($notesParUE),
            'current_user' => $currentUser,
            'UEs' => $UEs,

        ];
        return $this->render('tableau_de_bord/index.html.twig', $data);
    }
}
