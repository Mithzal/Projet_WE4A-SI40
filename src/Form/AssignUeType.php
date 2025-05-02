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

class AssignUeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user_id', EntityType::class, [
                'class' => Utilisateurs::class,
                'choice_label' => function (Utilisateurs $utilisateur) {
                    return $utilisateur->getNom() . ' ' . $utilisateur->getPrenom();
                },
                'multiple' => true,
                'expanded' => true,
                'label' => 'Utilisateurs',
                'required' => true,
            ])
            ->add('ue_id', EntityType::class, [
                'class' => UEs::class,
                'choice_label' => 'titre',
                'multiple' => true,
                'expanded' => true,
                'label' => 'UEs',
                'required' => true,
            ])
            ->add('role', ChoiceType::class, [
                'choices' => [
                    'Élève' => 'eleve',
                    'Enseignant' => 'enseignant',
                    'Intervenant' => 'intervenant',
                ],
                'label' => 'Rôle',
                'required' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Supprimez la ligne data_class
        ]);
    }
}