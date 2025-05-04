<?php

namespace App\Form;

use App\Entity\Membres;
use App\Entity\Ues;
use App\Entity\Utilisateurs;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Formulaire pour assigner une UE à un ou plusieurs utilisateurs.
 */
class AssignUeType extends AbstractType
{
    /**
     * Construit le formulaire.
     *
     * @param FormBuilderInterface $builder Le constructeur de formulaire.
     * @param array $options Les options supplémentaires pour le formulaire.
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // Champ pour sélectionner un ou plusieurs utilisateurs
            ->add('user_id', EntityType::class, [
                'class' => Utilisateurs::class, // Classe associée
                'choice_label' => function (Utilisateurs $utilisateur) {
                    // Affiche le nom et le prénom de l'utilisateur dans les choix
                    return $utilisateur->getNom() . ' ' . $utilisateur->getPrenom();
                },
                'multiple' => true, // Permet la sélection multiple
                'expanded' => true, // Affiche les choix sous forme de cases à cocher
                'label' => false, // Pas de label pour ce champ
                'required' => true, // Champ obligatoire
            ])
            // Champ pour sélectionner une ou plusieurs UEs
            ->add('ue_id', EntityType::class, [
                'class' => UEs::class, // Classe associée
                'choice_label' => 'titre', // Affiche le titre de l'UE dans les choix
                'multiple' => true, // Permet la sélection multiple
                'expanded' => true, // Affiche les choix sous forme de cases à cocher
                'label' => false, // Pas de label pour ce champ
                'required' => true, // Champ obligatoire
            ])
            // Champ pour sélectionner le rôle de l'utilisateur dans l'UE
            ->add('role', ChoiceType::class, [
                'choices' => [
                    'Élève' => 'eleve', // Option pour le rôle "Élève"
                    'Enseignant' => 'enseignant', // Option pour le rôle "Enseignant"
                    'Intervenant' => 'intervenant', // Option pour le rôle "Intervenant"
                ],
                'label' => 'Rôle', // Label du champ
                'required' => true, // Champ obligatoire
            ]);
    }

    /**
     * Configure les options par défaut du formulaire.
     *
     * @param OptionsResolver $resolver Le résolveur d'options.
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Pas de classe de données associée par défaut
        ]);
    }
}