<?php

namespace App\Controller;

use App\Entity\Contenu;
use App\Repository\ContenuRepository;
use App\Repository\NotesRepository;
use App\Repository\UesRepository;
use App\Repository\UtilisateursRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Form\ContenuType;
use Symfony\Component\HttpFoundation\Request;

final class UnCoursController extends AbstractController
{
    /**
     * Affiche la page d'un cours avec ses contenus, notes et informations utilisateur.
     */
    #[Route('/cours/{id}', name: 'Cours')]
    public function index(
        int $id,
        ContenuRepository $contenuRepository,
        UesRepository $uesRepository,
        NotesRepository $notesRepository,
        EntityManagerInterface $entityManager
    ): Response
    {
        // Récupère le cours et ses contenus associés
        $course = $uesRepository->find($id);
        $content = $contenuRepository->findBy(['ue' => $id]);
        $currentUser = $this->getUser();

        $notesParUE = [];
        $UEs = [];

        // Si l'utilisateur est connecté, récupère ses notes et ses UEs
        if ($currentUser) {
            $notesParUE = $notesRepository->findNotesGroupedByUeForUser($currentUser->getId());
            $UEs = $uesRepository->findUserMemberUes($currentUser->getId());
        }

        $data = [
            'variableTitre' => $course ? $course->getTitre() : 'Cours',
            'UEs' => $UEs,
            'course' => $course,
            'notes' => $notesParUE,
            'current_user' => $currentUser,
            'content' => $content,
        ];
        // Affiche la vue du cours
        return $this->render('un_cours/index.html.twig', $data);
    }

    /**
     * Permet de télécharger un fichier stocké en BLOB dans la base de données.
     */
    #[Route('/cours/fichier/{id}', name: 'telecharger_fichier')]
    public function telechargerFichier(int $id, ContenuRepository $contenuRepository): Response
    {
        // Récupère le contenu/fichier à partir de l'id
        $contenu = $contenuRepository->find($id);

        if (!$contenu || !$contenu->getFichier()) {
            throw $this->createNotFoundException('Le fichier demandé n\'existe pas');
        }

        // Convertit le BLOB en contenu téléchargeable
        $fileContent = stream_get_contents($contenu->getFichier());
        $response = new Response($fileContent);

        $filename = $contenu->getTitre();
        // Ajoute une extension par défaut si absente
        if (!str_contains($filename, '.')) {
            $filename .= '.zip';
        }

        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }

    /**
     * Supprime un contenu via une requête POST, retourne un message JSON.
     */
    #[Route('/content/delete/{id}', name: 'delete_content', methods: ['POST'])]
    public function deleteContent(int $id, EntityManagerInterface $entityManager): Response
    {
        // Recherche le contenu à supprimer
        $content = $entityManager->getRepository(Contenu::class)->find($id);

        if (!$content) {
            return $this->json(['message' => 'UE non trouvée.'], 404);
        }

        // Suppression du contenu
        $entityManager->remove($content);
        $entityManager->flush();

        return $this->json(['message' => 'UE supprimée avec succès.'], 200);
    }

    /**
     * Ajoute un contenu à un cours (upload de fichier, gestion du formulaire).
     */
    #[Route('/cours/{id}/ajouter-contenu', name: 'ajouter_contenu')]
    public function ajouterContenu(
        Request $request,
        int $id,
        UesRepository $UesRepository,
        EntityManagerInterface $entityManager
    ): Response
    {
        // Récupère l'UE cible
        $ue = $UesRepository->find($id);
        $currentUser = $this->getUser();

        if (!$ue) {
            throw $this->createNotFoundException('UE non trouvée');
        }

        // Prépare un nouvel objet Contenu
        $contenu = new Contenu();
        $contenu->setUe($ue);
        $contenu->setDateCrea(new \DateTime());

        // Création et gestion du formulaire
        $form = $this->createForm(ContenuType::class, $contenu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Gestion du fichier uploadé
            $fichierField = $form->get('fichier');
            if ($fichierField->getData()) {
                $file = $fichierField->getData();
                $fileContent = file_get_contents($file->getPathname());
                $contenu->setFichier($fileContent);
            }

            // Sauvegarde du contenu en base
            $entityManager->persist($contenu);
            $entityManager->flush();

            $this->addFlash('success', 'Contenu ajouté avec succès');

            return $this->redirectToRoute('Cours', ['id' => $id]);
        }

        // Affiche le formulaire d'ajout de contenu
        return $this->render('un_cours/ajouter_contenu.html.twig', [
            'form' => $form->createView(),
            'ue' => $ue,
            'current_user' => $currentUser,
            'UEs' => [],
            'notes' => [],
        ]);
    }

    /**
     * Modifie un contenu existant (édition via formulaire, gestion conditionnelle du fichier).
     */
    #[Route('/content/edit/{id}', name: 'edit_content')]
    public function editContent(
        Request $request,
        int $id,
        EntityManagerInterface $entityManager
    ): Response
    {
        // Recherche le contenu à modifier
        $contenu = $entityManager->getRepository(Contenu::class)->find($id);
        $currentUser = $this->getUser();

        if (!$contenu) {
            throw $this->createNotFoundException('Contenu non trouvé');
        }

        // Création et gestion du formulaire
        $form = $this->createForm(ContenuType::class, $contenu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Si un nouveau fichier est uploadé, on le remplace
            $fichierField = $form->get('fichier');
            if ($fichierField->getData()) {
                $file = $fichierField->getData();
                $fileContent = file_get_contents($file->getPathname());
                $contenu->setFichier($fileContent);
            }

            // Mise à jour en base
            $entityManager->flush();

            $this->addFlash('success', 'Contenu modifié avec succès');

            return $this->redirectToRoute('Cours', ['id' => $contenu->getUe()->getId()]);
        }

        // Affiche le formulaire d'édition de contenu
        return $this->render('un_cours/edit_content.html.twig', [
            'form' => $form->createView(),
            'contenu' => $contenu,
            'current_user' => $currentUser,
            'UEs' => [],
            'notes' => [],
        ]);
    }

    /**
     * Affiche la liste des participants d'un cours, séparés par rôle (enseignant/étudiant).
     */
    #[Route('/cours/{id}/participants', name: 'cours_participants')]
    public function participants(
        int $id,
        UesRepository $uesRepository,
        NotesRepository $notesRepository,
        UtilisateursRepository $utilisateursRepository,
        EntityManagerInterface $entityManager
    ): Response
    {
        // Récupère l'UE et l'utilisateur courant
        $ue = $uesRepository->find($id);
        $currentUser = $this->getUser();

        if (!$ue) {
            throw $this->createNotFoundException('UE non trouvée');
        }

        // Récupère tous les participants du cours
        $participants = $utilisateursRepository->findParticipantsByUe($id);

        // Sépare les participants selon leur rôle
        $professeurs = [];
        $etudiants = [];
        foreach ($participants as $participant) {
            if ('enseignant' === $participant['role']) {
                $professeurs[] = $participant;
            } else {
                $etudiants[] = $participant;
            }
        }

        // Affiche la vue des participants
        return $this->render('un_cours/participants.html.twig', [
            'UEs' => $ue,
            'professeurs' => $professeurs,
            'etudiants' => $etudiants,
            'current_user' => $currentUser,
        ]);
    }
}

