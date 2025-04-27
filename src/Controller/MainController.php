<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\NotesRepository;
use App\Repository\UEsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

final class MainController extends AbstractController
{

    #[Route('/', name:'app_login')]
    public function template(AuthenticationUtils $authenticationUtils, EntityManagerInterface $entityManager): Response
    {

        $currentUser = $this->getUser();

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
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();


        //ces variables sont nécessaires pour les "popups" d'information du profile et des notes
        $data = [
            'variableTitre'=> 'Home',
            'UEs' => $UEs,
            'notes' => array_values($notesParUE),
            'last_username' => $lastUsername,
            'error' => $error,
            'current_user' => $currentUser,
        ];
        return $this->render("index.html.twig", $data);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
