<?php

namespace App\Repository;

use App\Entity\Article;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Article>
 *
 * @method Article|null find($id, $lockMode = null, $lockVersion = null)
 * @method Article|null findOneBy(array $criteria, array $orderBy = null)
 * @method Article[]    findAll()
 * @method Article[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArticleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Article::class);
    }

   /**
    * @return [] Returns an array of Article objects
    */
   public function getArticlesPerPage($page, $size): array
   {
        $articles = $this->createQueryBuilder('a')
           ->orderBy('a.id', 'DESC')
           ->setFirstResult(($page - 1) * $size)
           ->setMaxResults($size)
           ->getQuery()
           ->getResult();

        $countData = $this->createQueryBuilder('a')
        ->select('COUNT(a.id)');

        $totalResults = (int) $countData->getQuery()->getSingleScalarResult();
        $totalPages = (int) ceil($totalResults / $size);

       return [
            'articles' => $articles,
            'totalPages' => $totalPages
       ];
   }

//    public function findOneBySomeField($value): ?Article
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
