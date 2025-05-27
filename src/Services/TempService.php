<?php

namespace App\Services;

use DateTime;
use DateTimeImmutable;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class TempService {
    public function __construct(
        private HttpClientInterface $client,
    ) {
    }

    public function getJsonPlaceholder(): array
    {
        $response = $this->client->request(
            'GET',
            'https://jsonplaceholder.typicode.com/posts'
        );
        $content = $response->getContent();
        $content = $response->toArray();

        return $content;
    }

    public function getCalcultator(int $amount, string $fromCurr = "EUR", string $toCurr = "MGA", int $fee = 0): array
    {
        // ?amount=100&fee=2&utcConvertedDate=05%2F27%2F2025&exchangedate=05%2F27%2F2025&fromCurr=AFN&toCurr=EUR
        $date = new DateTimeImmutable();
        $date = $date->format('m/d/Y');
        $response = $this->client->request(
            'GET',
            'https://www.visa.fr/cmsapi/fx/rates',
            [
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                    'Referer' => 'https://www.visa.fr/',
                    'Accept' => 'application/json',
                    'Accept-Language' => 'fr-FR,fr;q=0.9',
                    'Origin' => 'https://www.visa.fr',
                ],
                'query' => [
                     'amount' => $amount,
                     'fee' => $fee,
                     'utcConvertedDate' => $date,
                     'exchangedate' => $date,
                     'fromCurr'=> $toCurr,
                     'toCurr' => $fromCurr
                ]
            ]
        );

        $statusCode = $response->getStatusCode();
        $contentType = $response->getHeaders()['content-type'][0];
        $content = $response->getContent();
        $content = $response->toArray();

        return $content;
    }
}