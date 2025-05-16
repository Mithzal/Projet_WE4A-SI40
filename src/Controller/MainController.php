<?php

namespace App\Controller;

use App\Repository\NotesRepository;
use App\Repository\UesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

final class MainController extends AbstractController
{
    /**
     * Affiche la page d'accueil ou de connexion.
     */
    #[Route('/', name:'app_login')]
    public function template(UesRepository $uesRepository, AuthenticationUtils $authenticationUtils, NotesRepository $notesRepository): Response
    {
        // Récupère l'utilisateur actuellement connecté
        $currentUser = $this->getUser();

        $ues = [];
        $notesParUE = [];

        // Si l'utilisateur est connecté, récupère ses UEs et ses notes par UE
        if ($currentUser) {
            $ues = $uesRepository->findUserMemberUes($currentUser->getId());
            $notesParUE = $notesRepository->findNotesGroupedByUeForUser($currentUser->getId());
        }

        // Récupère les informations d'authentification pour l'affichage du formulaire de connexion
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        $data = [
            'variableTitre' => 'Home',
            'UEs' => $ues,
            'notes' => array_values($notesParUE),
            'last_username' => $lastUsername,
            'error' => $error,
            'current_user' => $currentUser,
        ];
        return $this->render("index.html.twig", $data);
    }

    /**
     * Déconnecte l'utilisateur.
     */
    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    /**
     * Permet à l'utilisateur de modifier son profil (nom, prénom, email).
     */
    #[Route('/profile/edit', name: 'edit_profile', methods: ['POST'])]
    public function editProfile(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Vérifie que l'utilisateur est authentifié
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupère les données envoyées en JSON
        $data = json_decode($request->getContent(), true);
        // Met à jour les champs du profil si présents dans la requête
        if (isset($data['prenom'])) {
            $user->setPrenom($data['prenom']);
        }
        if (isset($data['nom'])) {
            $user->setNom($data['nom']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        // Sauvegarde les modifications en base
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Profil mis à jour avec succès']);
    }

    /**
     * Permet à l'utilisateur de modifier son mot de passe, verifie l'ancien mot de passe et met à jour le nouveau.
     */
    #[Route('/profile/edit-password', name: 'edit_password', methods: ['POST'])]
    public function editPassword(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        // Vérifie que l'utilisateur est authentifié
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupère les données envoyées en JSON
        $data = json_decode($request->getContent(), true);
        if (isset($data['oldPassword'], $data['password'])) {
            // Vérifie que l'ancien mot de passe est correct
            if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
                return new JsonResponse(['error' => 'Ancien mot de passe incorrect'], Response::HTTP_BAD_REQUEST);
            }

            // Hash et met à jour le nouveau mot de passe
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            // Sauvegarde la modification en base
            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse(['message' => 'Mot de passe mis à jour avec succès']);
        }

        return new JsonResponse(['error' => 'Données invalides'], Response::HTTP_BAD_REQUEST);
    }
}

