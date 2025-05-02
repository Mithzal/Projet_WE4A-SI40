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

final class MesCoursController extends AbstractController
{
    #[Route('/mesCours', name: 'MesCours')]
    public function index(ContenuRepository $contenuRepository, UEsRepository $UEsRepository, NotesRepository $notesRepository, UtilisateursRepository $utilisateursRepository, EntityManagerInterface $entityManager): Response
    {
        // Get the currently connected user
        $currentUser = $this->getUser();
        $Utilisateur = $utilisateursRepository->find($currentUser->getId());


        // Fetch data related to the connected user
        $UEsDetails = $UEsRepository->findCoursesByUser($Utilisateur->getId());
        $notes = $notesRepository->findNotesByUser($Utilisateur->getId());
        $actualites = $contenuRepository->findActualitesByUser($Utilisateur->getId());

        $conn = $entityManager->getConnection();
        $UEs = [];
        $sql = 'SELECT ues.titre
            FROM ues
            INNER JOIN membres ON ues.id = membres.ue_id
            INNER JOIN utilisateurs ON membres.user_id = utilisateurs.id
            WHERE utilisateurs.id = :id
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



        // Pass the data to the template
        $data = [
            'variableTitre'=> 'Mes Cours',
            'UEs_details' => $UEsDetails,
            'UEs' => $UEs,
            'notes' => $notes,
            'actualites' => $actualites,
            'current_user' => $currentUser,

        ];
        //dump($data);
        return $this->render('mes_cours/index.html.twig', $data);
    }
}
