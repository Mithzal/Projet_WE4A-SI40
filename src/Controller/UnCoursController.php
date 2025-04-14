<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class UnCoursController extends AbstractController
{
    #[Route('/cours', name: 'unCours')]
    public function index(): Response
    {
        $data =[
            'variableTitre' => 'Cours'
        ];
        return $this->render('un_cours/index.html.twig', $data);
    }
}
