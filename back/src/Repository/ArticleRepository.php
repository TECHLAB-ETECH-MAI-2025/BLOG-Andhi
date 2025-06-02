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

   public function findForDataTable($start, $length, $search, $orderColumn, $orderDir): array
   {
        $qb = $this->createQueryBuilder('a')
            ->leftJoin('a.categories', 'c')
            ->leftJoin('a.comments', 'com')
            ->leftJoin('a.likes', 'l')
            ->leftJoin('a.author', 'u')
            ->groupBy('a.id');

        // Appliquer la recherche si elle existe
        if ($search) {
            $qb->andWhere('a.title LIKE :search OR c.title LIKE :search OR u.username :search')
                ->setParameter('search', '%' . $search . '%');
        }

        // Compter le nombre total d'articles
        $totalCount = $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->distinct()
            ->getQuery()
            ->getSingleScalarResult();

        // Compter le nombre d'articles filtrés
        $filteredCountQb = clone $qb;
        $filteredCount = $filteredCountQb
            ->select('COUNT(DISTINCT a.id)')
            ->getQuery()
            ->getScalarResult();

        // Appliquer le tri
        if ($orderColumn === 'commentsCount') {
            $qb->addSelect('COUNT(com.id) as commentsCount')
                ->orderBy('commentsCount', $orderDir);
        } elseif ($orderColumn === 'likesCount') {
            $qb->addSelect('COUNT(l.id) as likesCount')
                ->orderBy('likesCount', $orderDir);
        } elseif ($orderColumn === 'categories') {
            $qb->orderBy('c.title', $orderDir);
        } else {
            $qb->orderBy($orderColumn, $orderDir);
        }

        // Appliquer la pagination
        $qb->setFirstResult($start)
            ->setMaxResults($length);

        return [
            'data' => $qb->getQuery()->getResult(),
            'totalCount' => $totalCount,
            'filteredCount' => $filteredCount
        ];
    }

    /**
     * Recherche des articles par titre
     */
    public function searchByTitle(string $query, int $limit = 10): array
    {
        return $this->createQueryBuilder('a')
            ->leftJoin('a.categories', 'c')
            ->where('a.title LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('a.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
