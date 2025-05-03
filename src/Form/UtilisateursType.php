<?php

namespace App\Form;

use App\Entity\Utilisateurs;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UtilisateursType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('prenom', TextType::class, [
                'label' => 'Prénom',
            ])
            ->add('nom', TextType::class, [
                'label' => 'Nom',
            ])
            ->add('email', EmailType::class, [
                'label' => 'Email',
            ])
            ->add('password', PasswordType::class, [
                'label' => 'Mot de passe',
            ])
            ->add('roles', ChoiceType::class, [
                'label' => 'Rôle',
                'choices' => [
                    'Administrateur' => 'ROLE_ADMIN',
                    'Eleve' => 'ROLE_ELEVE',
                    'Professeur' => 'ROLE_PROF',
                    'Professeur/Administrateur' => 'ROLE_PROF_ADMIN',
                ],
                'multiple' => false, // Une seule option peut être sélectionnée
                'expanded' => false, // Affiche un menu déroulant
            ]);

        // Transformer les données pour le champ "roles"
        $builder->get('roles')->addModelTransformer(new CallbackTransformer(
        // Transforme un tableau en chaîne (pour le formulaire)
            fn ($rolesArray) => $rolesArray[0] ?? null,
            // Transforme une chaîne en tableau (pour l'entité)
            fn ($roleString) => [$roleString]
        ));
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Utilisateurs::class,
        ]);
    }
}