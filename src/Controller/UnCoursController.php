<?php

namespace App\Controller;

use App\Entity\Contenu;
use App\Entity\UEs;
use App\Repository\ContenuRepository;
use App\Repository\NotesRepository;
use App\Repository\UEsRepository;
use App\Repository\UtilisateursRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class UnCoursController extends AbstractController
{
    #[Route('/cours/{id}', name: 'Cours')]
    public function index(int $id, ContenuRepository $contenuRepository, UEsRepository $UEsRepository, EntityManagerInterface $entityManager): Response
    {
        $course = $UEsRepository->find($id);
        $content = $contenuRepository->findBy(['ue_id' => $id]);

        // Get the currently connected user
        $currentUser = $this->getUser();

        // Fetch data related to the connected user
        $notesParUE = [];
        $UEs = [];

        if($currentUser) {
            $conn = $entityManager->getConnection();


            $sql = '
        SELECT notes.note, ues.titre AS nom_UE
            FROM notes
            INNER JOIN UEs ON notes.UE_id_id = UEs.id
            INNER JOIN Utilisateurs ON notes.user_id_id = Utilisateurs.id
            WHERE Utilisateurs.id = :id
                           ';
            $stmt = $conn->prepare($sql);
            $result = $stmt->executeQuery(['id' => $currentUser->getId()]);


            $rows = $result->fetchAllAssociative();

            foreach ($rows as $row) {
                $nomUE = $row['nom_UE'];

                if (!isset($notesParUE[$nomUE])) {
                    $notesParUE[$nomUE] = [
                        'ue' => $nomUE,
                        'notes' => []
                    ];
                }

                // Format simplifié sans coefficient
                $notesParUE[$nomUE]['notes'][] = (string)$row['note'];
            }

            // Fetch all courses from the database
            $sql = 'SELECT UEs.titre
            FROM UEs
            INNER JOIN membres_ues_ues ON UEs.id = membres_ues_ues.ues_id
            INNER JOIN membres_ues ON membres_ues_ues.membres_ues_id = membres_ues.id
            INNER JOIN membres_ues_utilisateurs ON membres_ues.id = membres_ues_utilisateurs.membres_ues_id
            INNER JOIN Utilisateurs ON membres_ues_utilisateurs.utilisateurs_id = Utilisateurs.id
            WHERE Utilisateurs.id = :id
            ';

            $stmt = $conn->prepare($sql);
            $result = $stmt->executeQuery(['id' => $currentUser->getId()]);


            $rows = $result->fetchAllAssociative();

            foreach ($rows as $row) {
                $nomUE = $row['titre'];

                if (!isset($UEs[$nomUE])) {
                    $UEs[$nomUE] = [
                        'ue' => $nomUE
                    ];
                }
            }
        }

        $data = [
            'variableTitre'=> 'Recherche Cours',

            'UEs' => $UEs,
            'course' => $course,
            'notes' => $notesParUE,
            'current_user' => $currentUser,
            'content' => $content,
        ];
        return $this->render('un_cours/index.html.twig', $data);
    }
    #[Route('/cours/fichier/{id}', name: 'telecharger_fichier')]
    public function telechargerFichier(int $id, ContenuRepository $contenuRepository): Response
    {
        $contenu = $contenuRepository->find($id);

        if (!$contenu || !$contenu->getFichier()) {
            throw $this->createNotFoundException('Le fichier demandé n\'existe pas');
        }

        // Récupérer le contenu du BLOB
        $fileContent = stream_get_contents($contenu->getFichier());

        // Créer la réponse
        $response = new Response($fileContent);

        // Gérer le nom du fichier (avec le titre du contenu)
        $filename = $contenu->getTitre();
        // Vous pouvez ajouter une extension basée sur le type de contenu si nécessaire
        if (!str_contains($filename, '.')) {
            $filename .= '.pdf'; // Extension par défaut, à adapter selon vos besoins
        }

        // Définir les en-têtes pour forcer le téléchargement
        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }



    #[Route('/content/delete/{id}', name: 'delete_content', methods: ['POST'])]
    public function deleteContent(int $id, EntityManagerInterface $entityManager): Response
    {
        $content = $entityManager->getRepository(Contenu::class)->find($id);

        if (!$content) {
            return $this->json(['message' => 'UE non trouvée.'], 404);
        }

        $entityManager->remove($content);
        $entityManager->flush();

        return $this->json(['message' => 'UE supprimée avec succès.'], 200);
    }

}
