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

    #[Route('/', name:'app_login')]
    public function template(UesRepository $uesRepository, AuthenticationUtils $authenticationUtils, NotesRepository $notesRepository): Response
    {
        $currentUser = $this->getUser();

        $ues = [];
        $notesParUE = [];

        if ($currentUser) {
            $ues = $uesRepository->findUserMemberUes($currentUser->getId());
            $notesParUE = $notesRepository->findNotesGroupedByUeForUser($currentUser->getId());
        }

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

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route('/profile/edit', name: 'edit_profile', methods: ['POST'])]
    public function editProfile(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['prenom'])) {
            $user->setPrenom($data['prenom']);
        }
        if (isset($data['nom'])) {
            $user->setNom($data['nom']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Profil mis à jour avec succès']);
    }

    #[Route('/profile/edit-password', name: 'edit_password', methods: ['POST'])]
    public function editPassword(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['oldPassword'], $data['password'])) {
            // Vérification de l'ancien mot de passe
            if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
                return new JsonResponse(['error' => 'Ancien mot de passe incorrect'], Response::HTTP_BAD_REQUEST);
            }

            // Mise à jour avec le nouveau mot de passe
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse(['message' => 'Mot de passe mis à jour avec succès']);
        }

        return new JsonResponse(['error' => 'Données invalides'], Response::HTTP_BAD_REQUEST);
    }
}
