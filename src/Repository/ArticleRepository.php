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

   /**
    * @return [] Returns an array of Article objects
    */
   public function getLastArticles($limit): array
   {
        $articles = $this->createQueryBuilder('a')
           ->orderBy('a.id', 'DESC')
           ->setMaxResults($limit)
           ->getQuery()
           ->getResult();

       return $articles;
   }

   public function findForDataTable(int $start, int $length, ?string $search, string $orderColumn, string $orderDir): array
{
    $qb = $this->createQueryBuilder('a')
        ->leftJoin('a.author', 'u')
        ->leftJoin('a.categories', 'c')
        ->addSelect('u', 'c');

    // Filtrage (recherche)
    if (!empty($search)) {
        $qb->andWhere('a.title LIKE :search OR u.username LIKE :search')
           ->setParameter('search', '%' . $search . '%');
    }

    // Clonage du QueryBuilder pour compter les résultats filtrés
    $filteredQb = clone $qb;

    // Pagination
    $qb->setFirstResult($start)
       ->setMaxResults($length);

    // Tri
    $qb->orderBy($orderColumn, $orderDir);

    // Récupération des résultats paginés
    $data = $qb->getQuery()->getResult();

    // Nombre total (non filtré)
    $total = $this->createQueryBuilder('a')
        ->select('COUNT(a.id)')
        ->getQuery()
        ->getSingleScalarResult();

    // Nombre filtré
    $filtered = $filteredQb->select('COUNT(a.id)')
        ->getQuery()
        ->getSingleScalarResult();

    return [
        'data' => $data,
        'totalCount' => (int) $total,
        'filteredCount' => (int) $filtered,
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
