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
    public function index(ContenuRepository $contenuRepository, UesRepository $uesRepository, UEsRepository $UEsRepository, NotesRepository $notesRepository, UtilisateursRepository $utilisateursRepository, EntityManagerInterface $entityManager): Response
    {
        $currentUser = $this->getUser();

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

        return $this->render('mes_cours/index.html.twig', $data);
    }
}
