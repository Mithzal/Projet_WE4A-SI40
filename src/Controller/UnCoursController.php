<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\NotesRepository;
use App\Repository\UEsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class UnCoursController extends AbstractController
{
    #[Route('/cours', name: 'unCours')]
    public function index(ContenuRepository $contenuRepository, UEsRepository $UEsRepository, NotesRepository $notesRepository): Response
    {
        $FirstName = 'Arthur';
        $LastName = 'Spadot';
        $email = 'arthur.spadot@utbm.fr';
        $photoDeProfil = 'Images/no_image.webp';


        // Fetch all courses from the database
        $UEs = $UEsRepository->findAll();
        $notes = $notesRepository->findAll();
        $courses = $contenuRepository->findAll();

        //ces variables sont nécessaire pour les "popups" d'information du profile et des notes
        $data = [
            'variableTitre'=> 'Home',
            'FirstName' => $FirstName,
            'Lastname' => $LastName,
            'email' => $email,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $UEs,
            'notes' => $notes,
            'courses' => $courses,
        ];
        return $this->render('un_cours/index.html.twig', $data);
    }
}
