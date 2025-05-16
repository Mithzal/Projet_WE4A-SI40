<?php

namespace App\Form;

use App\Entity\Utilisateurs; // Importation de l'entité Utilisateurs, utilisée pour lier le formulaire à cette entité.
use Symfony\Component\Form\AbstractType; // Classe de base pour tous les types de formulaire.
use Symfony\Component\Form\CallbackTransformer; // Permet de transformer les données entre le formulaire et l'entité.
use Symfony\Component\Form\Extension\Core\Type\ChoiceType; // Type de champ pour les choix (menu déroulant, cases à cocher, etc.).
use Symfony\Component\Form\Extension\Core\Type\EmailType; // Type de champ pour les adresses email.
use Symfony\Component\Form\Extension\Core\Type\PasswordType; // Type de champ pour les mots de passe.
use Symfony\Component\Form\Extension\Core\Type\TextType; // Type de champ pour les champs de texte simple.
use Symfony\Component\Form\FormBuilderInterface; // Interface pour construire les formulaires.
use Symfony\Component\OptionsResolver\OptionsResolver; // Permet de configurer les options du formulaire.

class UtilisateursType extends AbstractType
{
    /**
     * Méthode pour construire le formulaire.
     *
     * @param FormBuilderInterface $builder L'objet utilisé pour ajouter des champs au formulaire.
     * @param array $options Les options passées au formulaire.
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // Ajout d'un champ de type TextType pour le prénom de l'utilisateur.
            ->add('prenom', TextType::class, [
                'label' => 'Prénom', // Libellé affiché pour ce champ.
            ])
            // Ajout d'un champ de type TextType pour le nom de l'utilisateur.
            ->add('nom', TextType::class, [
                'label' => 'Nom', // Libellé affiché pour ce champ.
            ])
            // Ajout d'un champ de type EmailType pour l'adresse email de l'utilisateur.
            ->add('email', EmailType::class, [
                'label' => 'Email', // Libellé affiché pour ce champ.
            ])
            // Ajout d'un champ de type PasswordType pour le mot de passe de l'utilisateur.
            ->add('password', PasswordType::class, [
                'label' => 'Mot de passe', // Libellé affiché pour ce champ.
            ])
            // Ajout d'un champ de type ChoiceType pour le rôle de l'utilisateur.
            ->add('roles', ChoiceType::class, [
                'label' => 'Rôle', // Libellé affiché pour ce champ.
                'choices' => [ // Liste des choix possibles.
                    'Administrateur' => 'ROLE_ADMIN',
                    'Eleve' => 'ROLE_ELEVE',
                    'Professeur' => 'ROLE_PROF',
                    'Professeur/Administrateur' => 'ROLE_PROF_ADMIN',
                ],
                'multiple' => false, // Une seule option peut être sélectionnée.
                'expanded' => false, // Affiche un menu déroulant.
            ]);

        // Transformation des données pour le champ "roles".
        $builder->get('roles')->addModelTransformer(new CallbackTransformer(
        // Transforme un tableau en chaîne (pour le formulaire).
            fn ($rolesArray) => $rolesArray[0] ?? null,
            // Transforme une chaîne en tableau (pour l'entité).
            fn ($roleString) => [$roleString]
        ));
    }

    /**
     * Méthode pour configurer les options du formulaire.
     *
     * @param OptionsResolver $resolver Permet de définir les options par défaut.
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Utilisateurs::class, // L'entité Utilisateurs est liée à ce formulaire.
        ]);
    }
}