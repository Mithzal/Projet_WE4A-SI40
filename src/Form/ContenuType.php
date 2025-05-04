<?php

namespace App\Form;

use App\Entity\Contenu;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Formulaire pour gérer les contenus.
 */
class ContenuType extends AbstractType
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
            // Champ pour le titre du contenu
            ->add('titre', TextType::class, [
                'label' => 'Titre du contenu', // Label affiché pour ce champ
            ])
            // Champ pour le texte du contenu
            ->add('text', TextareaType::class, [
                'label' => 'Texte', // Label affiché pour ce champ
                'required' => false, // Ce champ n'est pas obligatoire
            ])
            // Champ pour le type de contenu
            ->add('type', ChoiceType::class, [
                'label' => 'Type de contenu', // Label affiché pour ce champ
                'choices' => [ // Liste des choix possibles
                    'quiz' => 'quiz', // Option "quiz"
                    'Fichier' => 'files', // Option "Fichier"
                    'Warning' => 'important', // Option "Warning"
                    'Information' => 'information', // Option "Information"
                ],
            ])
            // Champ pour le fichier associé au contenu
            ->add('fichier', FileType::class, [
                'label' => 'Fichier ZIP', // Label affiché pour ce champ
                'required' => false, // Ce champ n'est pas obligatoire
                'mapped' => false, // Ce champ n'est pas mappé à l'entité
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
            'data_class' => Contenu::class, // Classe de données associée
        ]);
    }
}