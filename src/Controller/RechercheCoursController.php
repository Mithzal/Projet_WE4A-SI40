<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class RechercheCoursController extends AbstractController
{
    #[Route('/rechercheCours', name: 'RechercheCours')]
    public function index(): Response
    {
        $FirstName = 'John';
        $LastName = 'Doe';
        $email = 'johndoe@example.com';
        $photoDeProfil = 'Images/no_image.webp'; // URL de la photo de profil
        $UEs = [
            'PHP',
            'Symfony',
            'HTML',
            'CSS',
            'JavaScript',
        ];
        $grades = [
            [ 'ue' => "Mathématique", 'notes' => ["15/20", "16/20", "17/20", "5/20", "80/100"] ],
            [ 'ue' => "Physique", 'notes' => ["12/20"] ],
            [ 'ue' => "Anglais", 'notes' => ["18/20", "17/20", "19/20"] ],
            [ 'ue' => "Informatique", 'notes' => ["20/20", "19/20", "18/20"] ],
            [ 'ue' => "Chimie", 'notes' => ["14/20", "15/20"] ],
            [ 'ue' => "Biologie", 'notes' => ["16/20", "17/20"] ],
            [ 'ue' => "Histoire", 'notes' => ["13/20"] ],
            [ 'ue' => "Géographie", 'notes' => ["12/20", "11/20"] ],
            [ 'ue' => "Philosophie", 'notes' => ["10/20"] ],
            [ 'ue' => "Arts Plastiques", 'notes' => ["19/20"] ],
        ];

        //ces variables sont nécessaire pour les "popups" d'information du profile et des notes
        $data = [
            'variableTitre'=> 'Home',
            'FirstName' => $FirstName,
            'Lastname' => $LastName,
            'email' => $email,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $UEs,
            'grades' => $grades

        ];
        return $this->render('recherche_cours/index.html.twig', $data);
    }
}
