<?php

namespace App\Controller;

use App\Entity\Utilisateurs;
use App\Entity\UEs;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Form\UtilisateursType;
use App\Form\UEType;


final class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        // Récupérer les utilisateurs et les UE depuis la base de données
        $users = $entityManager->getRepository(Utilisateurs::class)->findAll();
        $ues = $entityManager->getRepository(UEs::class)->findAll();

        $FirstName = 'John';
        $LastName = 'Doe';
        $email = 'johndoe@example.com';
        $photoDeProfil = 'Images/no_image.webp'; // URL de la photo de profil
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
        $data = [
            'variableTitre' => 'Administration',
            'users' => $users,
            'ues' => $ues,
            'FirstName' => $FirstName,
            'Lastname' => $LastName,
            'email' => $email,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $ues,
            'notes' => $grades
        ];

        return $this->render('admin/admin.html.twig', $data);
    }

    #[Route('/admin/create-user', name: 'admin_create_user')]
    public function createUser(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        $user = new Utilisateurs();
        $form = $this->createForm(UtilisateursType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('password')->getData();
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

            $entityManager->persist($user);
            $entityManager->flush();

            if ($request->isXmlHttpRequest()) {
                return $this->json(['success' => true, 'message' => 'Utilisateur créé avec succès !'], 200);
            }

            $this->addFlash('success', 'Utilisateur créé avec succès !');
            return $this->redirectToRoute('admin');
        }

        if ($request->isXmlHttpRequest()) {
            return $this->json(['success' => false, 'message' => 'Erreur lors de la validation du formulaire.'], 400);
        }

        return $this->render('admin/create_user.html.twig', [
            'form' => $form->createView(),
            'variableTitre' => 'Créer un utilisateur',
        ]);
    }


    #[Route('/admin/create-ue', name: 'admin_create_ue')]
    public function createUE(Request $request, EntityManagerInterface $entityManager): Response
    {
        $ue = new UEs();
        $form = $this->createForm(UEType::class, $ue);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($ue);
            $entityManager->flush();

            if ($request->isXmlHttpRequest()) {
                return $this->json(['message' => 'UE créée avec succès !'], 200);
            }

            $this->addFlash('success', 'UE créée avec succès !');
            return $this->redirectToRoute('admin');
        }

        if ($request->isXmlHttpRequest()) {
            return $this->json(['message' => 'Erreur lors de la validation du formulaire.'], 400);
        }

        $data = [
            'form' => $form->createView(),
            'variableTitre' => 'Créer une UE',
        ];

        return $this->render('admin/create_ue.html.twig', $data);
    }
}