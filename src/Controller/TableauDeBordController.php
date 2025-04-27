<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\UEsRepository;
use App\Repository\NotesRepository;
use App\Repository\UtilisateursRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TableauDeBordController extends AbstractController
{
    #[Route('/tableauDeBord', name: 'TableauDeBord')]
    public function index(ContenuRepository $contenuRepository, UEsRepository $UEsRepository, NotesRepository $notesRepository, UtilisateursRepository $utilisateursRepository): Response
    {
        // Get the currently connected user
        $currentUser = $this->getUser();
        $Utilisateur = $utilisateursRepository->find($currentUser->getId());

        // Fetch data related to the connected user
        $UEs = $UEsRepository->findCoursesByUser($Utilisateur->getId());
        $notes = $notesRepository->findNotesByUser($Utilisateur->getId());

        // Add user details
        $FirstName = $Utilisateur->getPrénom();
        $LastName = $Utilisateur->getNom();
        $email = $Utilisateur->getEmail();
        $photoDeProfil = 'Images/no_image.webp';

        //ces variables sont nécessaire pour les "popups" d'information du profile et des notes
        $data = [
            'variableTitre'=> 'Mes Cours',
            'FirstName' => $FirstName,
            'Lastname' => $LastName,
            'email' => $email,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $UEs,
            'notes' => $notes,
        ];
        return $this->render('tableau_de_bord/index.html.twig', $data);
    }
}
