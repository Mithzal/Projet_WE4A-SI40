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
        //TODO : les variables du MainController sont obligatoirement nécessaire dans toutes les autres pages, il faut qu'elle ne soit que dans un seul controller je pense
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
        $cours =[

            ['ue'=> 'Mathématique', 'Image'=>'Images/math.jpg', 'Resume'=>'Introduction aux fonctions et aux dérivées.','path'=> 'unCours','progression'=>'75%', 'lastAccess'=>'5'],
            ['ue'=>'Informatique','Image'=>'None','Resume'=>'Développement web et algorithmique.','path'=> 'unCours','progression'=>'0%', 'lastAccess'=>'3'],
            ['ue'=>'Physique', 'Image'=>'None', 'Resume'=>'Mécanique et thermodinamique.','path'=>'unCours','progression'=>'30%','lastAccess'=>'1'],
            ['ue'=>'Chimie','Image'=>'None', 'Resume'=>'Equations chimiques et lois de conservation.', 'path'=>'unCours','progression'=>'0%','lastAccess'=>'7'],
            ['ue'=>'Design', 'Image'=>'None','Resume'=>'Exploration des principes de conception et du processus créatif.', 'path'=>'unCours','progression'=>'7%','lastAccess'=>'2'],
            ['ue'=>'Electronique analogique','Image'=>'None','Resume'=>'Introduction aux amplificateurs opérationnels.','path'=>'unCours','progression'=>'62%','lastAccess'=>'4'],
        ];
        //TODO: faire une vérification sur les images pour que les ue sans image prennent la no_image par default
//        $cour = [];
//        for($cour in $cours) {
//            if($cour.ue== 'None'){
//                $cours.ue = 'Images/no_image.webp';
//            }
//        };

        $actualite = [
            'Nouveau devoir en Mathématiques',
                'Webinaire en Informatique demain',
                'Résultats du test de Physique disponibles'
        ];

        $data = [
            'variableTitre'=> 'Home',
            'FirstName' => $FirstName,
            'Lastname' => $LastName,
            'email' => $email,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $UEs,
            'grades' => $grades,
            'mesCours'=> $cours,
            'actualites' => $actualite,

        ];
        return $this->render('mes_cours/index.html.twig', $data);
    }
}
