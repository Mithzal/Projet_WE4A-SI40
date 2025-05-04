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
    /**
     * Affiche la page de recherche de cours avec la liste des cours, enseignants et notes de l'utilisateur.
     */
    #[Route('/rechercheCours', name: 'RechercheCours')]
    public function index(UesRepository $uesRepository, NotesRepository $notesRepository): Response {
        // Récupère l'utilisateur courant
        $currentUser = $this->getUser();

        // Récupère tous les cours et les enseignants associés
        $UEsDetail = $uesRepository->findAll();
        $teachersByCourse = $uesRepository->findTeachersByCourses();

        $notesParUE = [];
        $UEs = [];

        // Si l'utilisateur est connecté, récupère ses notes et ses UEs
        if ($currentUser) {
            $notesParUE = $notesRepository->findNotesGroupedByUeForUser($currentUser->getId());
            $UEs = $uesRepository->findUserMemberUes($currentUser->getId());
        }

        $data = [
            'variableTitre' => 'Recherche Cours',
            'UEs_details' => $UEsDetail,
            'UEs' => $UEs,
            'notes' => $notesParUE,
            'teachersByCourse' => $teachersByCourse,
            'current_user' => $currentUser,
        ];
        // Affiche la vue de recherche de cours
        return $this->render('recherche_cours/index.html.twig', $data);
    }
}

