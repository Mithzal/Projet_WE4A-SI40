<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\UEsRepository;
use App\Repository\NotesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MesCoursController extends AbstractController
{
    #[Route('/mesCours', name: 'MesCours')]
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
        $actualites = $contenuRepository->findBy([], ['date_crea' => 'DESC'], 10);

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
            'actualites' => $actualites,
        ];
        return $this->render('mes_cours/index.html.twig', $data);
    }
}
