<?php

namespace App\Form;

use App\Entity\Category;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Titre de l\'article',
                'attr' => [
                    'class' => '',
                    'placeholder' => 'Entrez un titre pour votre article',
                    'required' => true
                ]
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Votre commentaire',
                'attr' => [
                    'class' => '',
                    'rows' => 4,
                    'placeholder' => 'Écrivez votre commentaire ici...',
                    'required' => true
                ]
            ]);
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Category::class,
        ]);
    }
}
