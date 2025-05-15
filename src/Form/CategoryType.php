<?php

namespace App\Form;

use App\Entity\Category;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Titre de la catégorie',
                'label_attr' => [
                    'class' => 'font-bold'
                ],
                'attr' => [
                    'class' => 'block w-full border border-neutral-100 rounded-sm p-2 mb-2',
                    'placeholder' => 'Entrez un nom de catégorie',
                    'required' => true
                ]
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'label_attr' => [
                    'class' => 'font-bold'
                ],
                'attr' => [
                    'class' => 'block w-full border border-neutral-100 rounded-sm p-2',
                    'rows' => 3,
                    'placeholder' => 'Écrivez la description de cette catégorie ici...',
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
