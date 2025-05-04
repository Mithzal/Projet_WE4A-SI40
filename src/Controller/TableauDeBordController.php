<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\UesRepository;
use App\Repository\NotesRepository;
use App\Repository\UtilisateursRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TableauDeBordController extends AbstractController
{
    /**
     * Affiche le tableau de bord de l'utilisateur connecté avec ses cours et notes.
     */
    #[Route('/tableauDeBord', name: 'TableauDeBord')]
    public function index(
        UesRepository $UesRepository,
        UtilisateursRepository $utilisateursRepository,
        NotesRepository $notesRepository
    ): Response
    {
        // Récupère l'utilisateur courant
        $currentUser = $this->getUser();
        $utilisateur = $utilisateursRepository->find($currentUser->getId());

        // Récupère les cours, notes et UEs de l'utilisateur
        $uesDetails = $UesRepository->findCoursesByUser($utilisateur->getId());
        $notesParUE = $notesRepository->findNotesGroupedByUeForUser($utilisateur->getId());
        $ues = $UesRepository->findUserMemberUes($utilisateur->getId());

        $data = [
            'variableTitre'=> 'Mes Cours',
            'UEs_details' => $uesDetails,
            'notes' => array_values($notesParUE),
            'current_user' => $currentUser,
            'UEs' => $ues,
        ];
        // Affiche la vue du tableau de bord
        return $this->render('tableau_de_bord/index.html.twig', $data);
    }
}

