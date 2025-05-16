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
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Form\UtilisateursType;
use App\Form\UEType;

final class AdminController extends AbstractController
{
    /**
     * Page principale de l'administration.
     * Affiche les utilisateurs et les UEs disponibles.
     */
    #[Route('/admin', name: 'admin')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        // Récupération de tous les utilisateurs et UEs depuis la base de données
        $users = $entityManager->getRepository(Utilisateurs::class)->findAll();
        $ues = $entityManager->getRepository(UEs::class)->findAll();

        // Initialisation des données supplémentaires
        $notesParUE = [];
        $UEs = [];
        $photoDeProfil = 'Images/no_image.webp'; // Image par défaut pour le profil

        // Préparation des données à transmettre à la vue
        $data = [
            'variableTitre' => 'Administration',
            'users' => $users,
            'ues' => $ues,
            'photoDeProfil' => $photoDeProfil,
            'UEs' => $UEs,
            'notes' => $notesParUE,
            'current_user' => $this->getUser(),
        ];

        // Rendu de la vue d'administration
        return $this->render('admin/admin.html.twig', $data);
    }

    /**
     * Création d'un nouvel utilisateur.
     */
    #[Route('/admin/create-user', name: 'admin_create_user')]
    public function createUser(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        // Initialisation des données supplémentaires
        $notesParUE = [];
        $UEs = [];

        // Création d'une nouvelle instance d'utilisateur
        $user = new Utilisateurs();

        // Création du formulaire pour l'utilisateur
        $form = $this->createForm(UtilisateursType::class, $user);

        // Gestion de la soumission du formulaire
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            // Hachage du mot de passe avant de le sauvegarder
            $plainPassword = $form->get('password')->getData();
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

            // Sauvegarde de l'utilisateur dans la base de données
            $entityManager->persist($user);
            $entityManager->flush();

            // Gestion des réponses AJAX
            if ($request->isXmlHttpRequest()) {
                return $this->json(['success' => true, 'message' => 'Utilisateur créé avec succès !'], 200);
            }

            // Ajout d'un message flash et redirection
            $this->addFlash('success', 'Utilisateur créé avec succès !');
            return $this->redirectToRoute('admin');
        }

        // Gestion des erreurs en cas de requête AJAX
        if ($request->isXmlHttpRequest()) {
            return $this->json(['success' => false, 'message' => 'Erreur lors de la validation du formulaire.'], 400);
        }

        // Rendu de la vue pour la création d'utilisateur
        return $this->render('admin/create_user.html.twig', [
            'form' => $form->createView(),
            'variableTitre' => 'Créer un utilisateur',
            'current_user' => $this->getUser(),
            'notes' => $notesParUE,
            'UEs' => $UEs,
        ]);
    }

    /**
     * Suppression d'un utilisateur.
     */
    #[Route('/admin/delete-user/{id}', name: 'admin_delete_user', methods: ['POST'])]
    public function deleteUser(int $id, EntityManagerInterface $entityManager): Response
    {
        // Recherche de l'utilisateur à supprimer
        $user = $entityManager->getRepository(Utilisateurs::class)->find($id);

        // Vérification si l'utilisateur existe
        if (!$user) {
            return $this->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        // Suppression de l'utilisateur
        $entityManager->remove($user);
        $entityManager->flush();

        // Retour d'une réponse JSON
        return $this->json(['message' => 'Utilisateur supprimé avec succès.'], 200);
    }

    /**
     * Modification d'un utilisateur existant.
     */
    #[Route('/admin/edit-user/{id}', name: 'admin_edit_user')]
    public function editUser(int $id, Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        // Recherche de l'utilisateur à modifier
        $user = $entityManager->getRepository(Utilisateurs::class)->find($id);
        $notesParUE = [];
        $UEs = [];

        // Vérification si l'utilisateur existe
        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé.');
        }

        // Création du formulaire pour l'utilisateur
        $form = $this->createForm(UtilisateursType::class, $user);
        $form->handleRequest($request);

        // Gestion de la soumission du formulaire
        if ($form->isSubmitted() && $form->isValid()) {
            // Mise à jour du mot de passe si nécessaire
            $plainPassword = $form->get('password')->getData();
            if ($plainPassword) {
                $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));
            }

            // Sauvegarde des modifications
            $entityManager->flush();

            // Gestion des réponses AJAX
            if ($request->isXmlHttpRequest()) {
                return $this->json(['message' => 'Utilisateur modifié avec succès !'], 200);
            }

            // Ajout d'un message flash et redirection
            $this->addFlash('success', 'Utilisateur modifié avec succès !');
            return $this->redirectToRoute('admin');
        }

        // Rendu de la vue pour la modification d'utilisateur
        return $this->render('admin/edit_user.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
            'variableTitre' => 'Modifier un utilisateur',
            'current_user' => $this->getUser(),
            'notes' => $notesParUE,
            'UEs' => $UEs,
        ]);
    }

    /**
     * Création d'une nouvelle UE.
     */
    #[Route('/admin/create-ue', name: 'admin_create_ue')]
    public function createUE(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $notesParUE = [];
        $UEs = [];

        // Création d'une nouvelle instance d'UE
        $ue = new UEs();

        // Création du formulaire pour l'UE
        $form = $this->createForm(UEType::class, $ue);

        // Gestion de la soumission du formulaire
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            // Gestion de l'upload de l'image
            $imageFile = $form->get('illustration')->getData();

            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

                try {
                    // Déplacement du fichier dans le répertoire configuré
                    $imageFile->move(
                        $this->getParameter('images_directory'),
                        $newFilename
                    );
                    $ue->setIllustration($newFilename);
                } catch (FileException $e) {
                    // Gestion des erreurs d'upload
                    $this->addFlash('error', 'Erreur lors de l\'upload de l\'image.');
                    return $this->redirectToRoute('admin');
                }
            }

            // Sauvegarde de l'UE dans la base de données
            $entityManager->persist($ue);
            $entityManager->flush();

            // Gestion des réponses AJAX
            if ($request->isXmlHttpRequest()) {
                return $this->json(['message' => 'UE créée avec succès !'], 200);
            }

            // Ajout d'un message flash et redirection
            $this->addFlash('success', 'UE créée avec succès !');
            return $this->redirectToRoute('admin');
        }

        // Rendu de la vue pour la création d'UE
        return $this->render('admin/create_ue.html.twig', [
            'form' => $form->createView(),
            'variableTitre' => 'Créer une UE',
            'current_user' => $this->getUser(),
            'notes' => $notesParUE,
            'UEs' => $UEs,
        ]);
    }
}