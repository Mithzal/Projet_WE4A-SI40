<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MainController extends AbstractController
{

    #[Route('/', name:'home')]
    public function template(): Response
    {
        $data = [
            'variableTitre'=> 'Home'
        ];
        return $this->render("index.html.twig", $data);
    }
}
