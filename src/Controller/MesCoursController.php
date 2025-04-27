<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\UEsRepository;
use App\Repository\NotesRepository;
use App\Repository\UtilisateursRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MesCoursController extends AbstractController
{
    #[Route('/mesCours', name: 'MesCours')]
    public function index(ContenuRepository $contenuRepository, UEsRepository $UEsRepository, NotesRepository $notesRepository, UtilisateursRepository $utilisateursRepository): Response
    {
        // Get the currently connected user
        $currentUser = $this->getUser();
        $Utilisateur = $utilisateursRepository->find($currentUser->getId());


        // Fetch data related to the connected user
        $UEs = $UEsRepository->findCoursesByUser($Utilisateur->getId());
        $notes = $notesRepository->findNotesByUser($Utilisateur->getId());
        $actualites = $contenuRepository->findActualitesByUser($Utilisateur->getId());

        // Add user details
        $FirstName = $Utilisateur->getPrénom();
        $LastName = $Utilisateur->getNom();
        $email = $Utilisateur->getEmail();
        $photoDeProfil = 'Images/no_image.webp';


        // Pass the data to the template
        $data = [
            'variableTitre'=> 'Mes Cours',
            'FirstName' => $FirstName,
            'Lastname' => $LastName,
            'email' => $email,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $UEs,
            'notes' => $notes,
            'actualites' => $actualites,
        ];
        //dump($data);
        return $this->render('mes_cours/index.html.twig', $data);
    }
}
