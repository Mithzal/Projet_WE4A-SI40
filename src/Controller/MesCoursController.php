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
    /**
     * Affiche la liste des cours auxquels l'utilisateur participe, avec actualités et notes.
     */
    #[Route('/mesCours', name: 'MesCours')]
    public function index(
        ContenuRepository $contenuRepository,
        UesRepository $uesRepository,
        UEsRepository $UEsRepository,
        NotesRepository $notesRepository,
        UtilisateursRepository $utilisateursRepository,
        EntityManagerInterface $entityManager
    ): Response
    {
        // Récupère l'utilisateur courant
        $currentUser = $this->getUser();

        // Récupère les informations liées à l'utilisateur
        $utilisateur = $utilisateursRepository->find($currentUser->getId());
        $uesDetails = $uesRepository->findCoursesByUser($utilisateur->getId());
        $notes = $notesRepository->findNotesByUser($utilisateur->getId());
        $actualites = $contenuRepository->findActualitesByUser($utilisateur->getId());
        $ues = $uesRepository->findUserMemberUes($utilisateur->getId());

        $data = [
            'variableTitre' => 'Mes Cours',
            'UEs_details' => $uesDetails,
            'UEs' => $ues,
            'notes' => $notes,
            'actualites' => $actualites,
            'current_user' => $currentUser,
        ];

        // Affiche la vue des cours de l'utilisateur
        return $this->render('mes_cours/index.html.twig', $data);
    }
}

