<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MesCoursController extends AbstractController
{
    #[Route('/mesCours', name: 'MesCours')]
    public function index(): Response
    {
        $data = [
            'variableTitre' => 'mes cours'
        ];
        return $this->render('mes_cours/index.html.twig', $data);
    }
}
