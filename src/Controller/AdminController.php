<?php

namespace App\Controller;

use App\Entity\Membres;
use App\Entity\Utilisateurs;
use App\Entity\Ues;
use App\Form\AssignUeType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;
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
        $notesParUE = [];
        $UEs = [];
        $photoDeProfil = 'Images/no_image.webp'; // URL de la photo de profil

        $data = [
            'variableTitre' => 'Administration',
            'users' => $users,
            'ues' => $ues,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $UEs,
            'notes' => $notesParUE,
            'current_user' => $this->getUser(),
        ];

        return $this->render('admin/admin.html.twig', $data);
    }


    //GESTION DES UTILISATEURS

    #[Route('/admin/create-user', name: 'admin_create_user')]
    public function createUser(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        $notesParUE = [];
        $UEs = [];
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
            'current_user' => $this->getUser(),
            'notes' => $notesParUE,
            'UEs' => $UEs,
        ]);
    }

    #[Route('/admin/delete-user/{id}', name: 'admin_delete_user', methods: ['POST'])]
    public function deleteUser(int $id, EntityManagerInterface $entityManager, ): Response
    {
        $user = $entityManager->getRepository(Utilisateurs::class)->find($id);

        if (!$user) {
            return $this->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['message' => 'Utilisateur supprimé avec succès.'], 200);
    }

    #[Route('/admin/edit-user/{id}', name: 'admin_edit_user')]
    public function editUser(int $id, Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        $user = $entityManager->getRepository(Utilisateurs::class)->find($id);
        $notesParUE = [];
        $UEs = [];

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé.');
        }

        $form = $this->createForm(UtilisateursType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('password')->getData();
            if ($plainPassword) {
                $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));
            }

            $entityManager->flush();

            if ($request->isXmlHttpRequest()) {
                return $this->json(['message' => 'Utilisateur modifié avec succès !'], 200);
            }

            $this->addFlash('success', 'Utilisateur modifié avec succès !');
            return $this->redirectToRoute('admin');
        }

        if ($request->isXmlHttpRequest()) {
            return $this->render('admin/edit_user.html.twig', [
                'form' => $form->createView(),
                'user' => $user,
            ]);
        }

        return $this->render('admin/edit_user.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
            'variableTitre' => 'Modifier un utilisateur',
            'current_user' => $this->getUser(),
            'notes' => $notesParUE,
            'UEs' => $UEs,
        ]);
    }


    //GESTION DES UES

    #[Route('/admin/create-ue', name: 'admin_create_ue')]
    public function createUE(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $notesParUE = [];
        $UEs = [];
        $ue = new UEs();
        $form = $this->createForm(UEType::class, $ue);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('illustration')->getData();

            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename.'-'.uniqid().'.'.$imageFile->guessExtension();

                try {
                    $imageFile->move(
                        $this->getParameter('images_directory'),
                        $newFilename
                    );
                    $ue->setIllustration($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Erreur lors de l\'upload de l\'image.');
                    return $this->redirectToRoute('admin');
                }
            }
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
            'current_user' => $this->getUser(),
            'notes' => $notesParUE,
            'UEs' => $UEs,
        ];

        return $this->render('admin/create_ue.html.twig', $data);
    }

    #[Route('/admin/delete-ue/{id}', name: 'admin_delete_ue', methods: ['POST'])]
    public function deleteUE(int $id, EntityManagerInterface $entityManager): Response
    {
        $ue = $entityManager->getRepository(UEs::class)->find($id);

        if (!$ue) {
            return $this->json(['message' => 'UE non trouvée.'], 404);
        }

        $entityManager->remove($ue);
        $entityManager->flush();

        return $this->json(['message' => 'UE supprimée avec succès.'], 200);
    }

    #[Route('/admin/edit-ue/{id}', name: 'admin_edit_ue')]
    public function editUE(int $id, Request $request, EntityManagerInterface $entityManager): Response
    {
        $ue = $entityManager->getRepository(UEs::class)->find($id);
        $notesParUE = [];
        $UEs = [];

        if (!$ue) {
            throw $this->createNotFoundException('UE non trouvée.');
        }

        $form = $this->createForm(UEType::class, $ue);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            if ($request->isXmlHttpRequest()) {
                return $this->json(['message' => 'UE modifiée avec succès !'], 200);
            }

            $this->addFlash('success', 'UE modifiée avec succès !');
            return $this->redirectToRoute('admin');
        }

        if ($request->isXmlHttpRequest()) {
            return $this->render('admin/edit_ue.html.twig', [
                'form' => $form->createView(),
                'ue' => $ue,
            ]);
        }

        return $this->render('admin/edit_ue.html.twig', [
            'form' => $form->createView(),
            'ue' => $ue,
            'variableTitre' => 'Modifier une UE',
            'current_user' => $this->getUser(),
            'notes' => $notesParUE,
            'UEs' => $UEs,
        ]);
    }

    #[Route('/admin/assign-ue-user', name: 'admin_assign_ue_user')]
    public function assignUeUser(Request $request, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(AssignUeType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $users = $data['user_id'] ?? [];
            $ues = $data['ue_id'] ?? [];
            $role = $data['role'] ?? 'eleve';

            // Créer une entrée pour chaque combinaison utilisateur-UE
            foreach ($users as $user) {
                foreach ($ues as $ue) {
                    $membreUE = new Membres();
                    $membreUE->setUser($user);
                    $membreUE->setUe($ue);
                    $membreUE->setRole($role);
                    $entityManager->persist($membreUE);
                }
            }

            $entityManager->flush();
            $this->addFlash('success', 'Utilisateurs assignés avec succès aux UEs !');
            return $this->redirectToRoute('admin');
        }

        return $this->render('admin/assign_ue_user.html.twig', [
            'form' => $form->createView(),
            'variableTitre' => 'Assigner des utilisateurs à des UEs',
            'current_user' => $this->getUser(),
            'UEs' => [],
            'notes' => [],
        ]);
    }
}
