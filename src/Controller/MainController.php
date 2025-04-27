<?php

namespace App\Controller;

use App\Repository\ContenuRepository;
use App\Repository\NotesRepository;
use App\Repository\UEsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

final class MainController extends AbstractController
{

    #[Route('/', name:'app_login')]
    public function template(AuthenticationUtils $authenticationUtils,ContenuRepository $contenuRepository, UEsRepository $UEsRepository, NotesRepository $notesRepository): Response
    {
        $FirstName = 'Arthur';
        $LastName = 'Spadot';
        $email = 'arthur.spadot@utbm.fr';
        $photoDeProfil = 'Images/no_image.webp';


        // Fetch all courses from the database
        $UEs = $UEsRepository->findAll();
        $notes = $notesRepository->findAll();
        $courses = $contenuRepository->findAll();

        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();


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
            'last_username' => $lastUsername,
            'error' => $error,
        ];
        return $this->render("index.html.twig", $data);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
