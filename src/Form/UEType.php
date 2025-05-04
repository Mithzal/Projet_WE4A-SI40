<?php

namespace App\Form;

use App\Entity\Ues; // Importation de l'entité Ues, qui sera utilisée pour lier le formulaire à cette entité.
use Symfony\Component\Form\AbstractType; // Classe de base pour tous les types de formulaire.
use Symfony\Component\Form\Extension\Core\Type\FileType; // Type de champ pour les fichiers.
use Symfony\Component\Form\Extension\Core\Type\TextareaType; // Type de champ pour les zones de texte.
use Symfony\Component\Form\Extension\Core\Type\TextType; // Type de champ pour les champs de texte simple.
use Symfony\Component\Form\FormBuilderInterface; // Interface pour construire les formulaires.
use Symfony\Component\OptionsResolver\OptionsResolver; // Permet de configurer les options du formulaire.

class UEType extends AbstractType
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
            // Ajout d'un champ de type TextType pour le code de l'UE.
            ->add('code', TextType::class, [
                'label' => 'Code de l\'UE', // Libellé affiché pour ce champ.
            ])
            // Ajout d'un champ de type TextType pour le titre de l'UE.
            ->add('titre', TextType::class, [
                'label' => 'Titre de l\'UE', // Libellé affiché pour ce champ.
            ])
            // Ajout d'un champ de type TextareaType pour la description de l'UE.
            ->add('description', TextareaType::class, [
                'label' => 'Description', // Libellé affiché pour ce champ.
                'required' => false, // Ce champ n'est pas obligatoire.
            ])
            // Ajout d'un champ de type FileType pour l'illustration de l'UE.
            ->add('illustration', FileType::class, [
                'label' => 'Illustration', // Libellé affiché pour ce champ.
                'required' => false, // Ce champ n'est pas obligatoire.
            ]);
    }

    /**
     * Méthode pour configurer les options du formulaire.
     *
     * @param OptionsResolver $resolver Permet de définir les options par défaut.
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => UEs::class, // L'entité UEs est liée à ce formulaire.
        ]);
    }
}