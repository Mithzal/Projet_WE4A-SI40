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
        $data = [
            'variableTitre' => 'rechercheCours'
        ];
        return $this->render('recherche_cours/index.html.twig', $data);
    }
}
