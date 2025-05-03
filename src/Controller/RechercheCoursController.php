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
    public function index(UesRepository $uesRepository, NotesRepository $notesRepository): Response {
        $currentUser = $this->getUser();
        $UEsDetail = $uesRepository->findAll();
        $teachersByCourse = $uesRepository->findTeachersByCourses();

        $notesParUE = [];
        $UEs = [];

        if ($currentUser) {
            // Use repository methods to fetch data
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
        return $this->render('recherche_cours/index.html.twig', $data);
    }
}