---
title: Repozytorium Doctrine pomijając EntityRepository
date: 2020-07-04
tags: [doctrine, orm, php, symfony]
categories: [symfony, architektura]
draft: false
summary: 'Moje wypracowane praktyki, których używam przy pracy z repozytorium Doctrine'
---

Poniżej zaprezentuję moje praktyki, które wykorzystuję, tworząc repozytorium Doctrine ORM. Chociaż ORM używam jedynie w
połączeniu z Symfony, a w pozostałych przypadkach wystarcza mi Doctrine DBAL, to nic nie stoi na przeszkodzie, aby
wdrożyć te praktyki poza Symfony.

# Domyślne repozytorium Doctrine

Domyślne repozytorium Doctrine generowane jest automatycznie, jeżeli nie określisz klasy repozytorium w konfiguracji
encji. Możesz je wyciągnąć, wywołując metodę getRepository na instancji ObjectManager. W praktyce jest to service
locator.

```php
public function getRepository(string $entityName)
{
    return $this->repositoryFactory->getRepository($this, $entityName);
}
```

Nie chcę, nie lubię, chociaż trzeba przyznać, że jest wygodny. Korzystam, jeżeli chcę coś sprawdzić w interactive mode
PHP. Metody `find*` ułatwiają wyszukiwanie, ale perełką jest jednak metoda magiczna `__call`. Pozwala na wyciąganie
wyników za pomocą metody nazwanej od atrybutu encji np.: `findOneByTitle('foo')`. Problemy? Oczywiście. Pierwszym, który
mi się nasuwa to brak podpowiadania składni. Do tego rozrzucenie takich metod po kodzie projektu. Zmiana nazwy atrybutu
wiążą się z ręcznym wyszukaniem i zmianą magicznych wywołań.

Oczywiście możesz rozszerzyć `EntityRepository` i próbować nie korzystać z magii. Wszystkie metody związane z
wyszukiwaniem na wyciągnięcie ręki. Nadal masz problem z pewnego rodzaju brakiem kontroli nad korzystaniem z nazw
atrybutów w wywołaniach metod (czy to w tablicy w `findBy()`, czy w nazwie metody np.: `findOneByFoo`). Mimo wszystko, z
takiego rozwiązania już możesz korzystać jak z serwisu i nie wyciągać go z instancji `ObjectManager`.

# Repozytorium jako serwis

Osobiście, dawno porzuciłem rozszerzanie klasy `EntityRepository`. Poszedłem nawet krok dalej i w swoich repozytoriach
nawet nie implementuję interfejsu `ObjectRepository`, a w konfiguracji encji nie podaję klasy repozytorium. W takim
przypadku `ObjectManager` zwróci domyślne repozytorium Doctrine, a ja swoje wstrzykuję manualnie tam, gdzie go
potrzebuję. Najprostsze repozytorium wygląda tak:

```php
final class PostRepository 
{ 
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getBySlug(UuidInterface $id): Post
    {
        $post = $this->em->find(Post::class, $id);

        if (!$post) {
            throw new PostNotFoundException();
        }

        return $post;
    }
} 
```

Nic nie stoi na przeszkodzie, abym zamiast `ObjectManager::find()` zbudował zapytanie (czy to w `QueryBuilder` czy za
pomocą DQL). Dzięki temu jasno określiłem, co może, a czego nie może moje repozytorium. W prosty sposób otrzymałem też
możliwość rozbicia repozytoriów i używania odrębnych klas np.: dla frontu i backoffice. Podpowiadanie składni jest na
swoim miejscu, prostsza refaktoryzacja i jasne granice. Następnym krokiem może (powinno) być dodanie interfejsów. Ale my
tu nie o tym…

Jeszcze szybka notatka dotycząca Symfony. Dzięki temu, że w encji nie podaję klasy repozytorium, Doctrine generuje
swoje, domyślne, z którego Symfony korzysta podczas konwersji atrybutów kontrolera (w tym przypadku z wykorzystaniem
[SensioFrameworkExtraBundle][sensio-framework-extra-bundle]).

# Query functions

[Ocramius][ocramius-twitter] w swojej prezentacji [Doctrine Best Practices][doctrine-best-practices] podrzucił pojęcie
query functions. Długo szukałem miejsca, gdzie mógłbym to wykorzystać i w końcu się udało. W skrócie, zamiast
repozytoriów, tworzysz klasy, których jedynym zadaniem jest wykonanie zapytania. Przykład bezpośrednio z wymienionej
prezentacji:

```php
final class UsersThatHaveAMonthlySubscription 
{ 
    public function __construct(EntityManagerInterface $em)
    { 
        // ...
    }
    
        public function __invoke(): \Traversable
        {
            // ... INSERT DQL/SQL HELL HERE ...
        }
}
``` 

Na czym to polega? Zamiast wstrzykiwać repozytorium jako zależność, wstrzykujesz query function. Jedna klasa, jedno
zapytanie do bazy. Oczywiście, możesz stworzyć filtry i na ich podstawie modyfikować zapytanie:

```php
public function __invoke(PublishedPostsFilter $filter): \Traversable
{
    $qb = $this->em->createQueryBuilder();

    // ...

    if ($filter->after) {
        $qb->andWhere('p.publishedAt > :after');
        $qb->setParameter('after', $filter->after);
    }

    // ...

    $qb->setMaxResults($filter->limit);

    return $qb->getQuery()->getResult();
}
```

# Połączenie serwisu repozytorium Doctrine i query functions

Ostatni sposób na zarządzanie repozytoriami, który chcę przedstawić, to pewnego rodzaju połączenie repozytorium i query
functions. Zamiast tworzyć pojedyncze repozytoria odpowiedzialne za jedną encję, z ewentualnym podziałem na front i
backoffice, zacząłem tworzyć repozytoria odpowiedzialne za pobieranie jednego typu wyników. Oto przykład podziału dla
postów: osobno wyszukiwanie listy opublikowanych postów i osobno wyciąganie szkiców.

```php
final class PublishedPostsList
{
    public function findLatestPosts(): \Traversable
    {
        // ...
    }

    public function findPosts(string $search): \Traversable
    {
        // ...
    }

    public function getPostCount(): int
    {
        // ...
    }
}
```

```php
final class DraftPostsList
{
    public function findAll(): \Traversable
    {
        // ...
    }

    public function findOverdueDrafts(): \Traversable
    {
        // ...
    }
}
```

Zdecydowanie najrzadziej wykorzystywana przeze mnie opcja. M.in. ze względu na to, że staram się nie budować tak dużych
repozytoriów, które wymagają takiego podziału. Ostatecznie, można to uprościć dodatkowym filtrem, jednak rozbite
repozytoria dużo łatwiej testować.

# Znaczenie get i find

Kolejny punkt z Doctrine Best Practices Ocramiusa. W skrócie: `find` może zwrócić `null`, `get` nie może. Prosta zasada,
której się trzymam. Ostatecznie wszystko zazwyczaj kończy się tak, że nigdy nie zwracam `null`. Metody `find` są
odpowiedzialne za zwracanie kolekcji rekordów. Metody `get` zwracają albo pojedynczy rekord, albo wartości skalarne.

# Podsumowanie

Dzięki zaprezentowanym rozwiązaniom (Ameryki nimi nie odkryłem :)), otrzymuję kod, który jest o wiele łatwiej
przetestować i nim zarządzać. Oczywiście nie twierdzę, że domyślne repozytoria Doctrine to zło. Można dla nich znaleźć
zastosowanie (jak m.in. wspomniane konwertowanie parametrów kontrolerów Symfony). Moim zdaniem, im mniej kodu, nad
którym sam panuję, tym trudniej w przyszłości będzie mi z nim pracować.

1. Nie rozszerzaj domyślnego repozytorium Doctrine 
1. Twórz metody, które zwracają potrzebne Ci wyniki, a nie metody do wszystkiego i do niczego jednocześnie
1. Jeżeli nie jest to konieczne, możesz rozdzielić repozytorium na kilka klas
1. Jeżeli to nadal za mało, korzystaj z query functions
1. Używaj metod `find` do zwracania kolekcji rekordów (kolekcja może być pusta)
1. Używaj metod `get` do zwracania pojedynczych rekordów lub wartości

[sensio-framework-extra-bundle]: https://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html#doctrine-converter
[ocramius-twitter]: https://twitter.com/Ocramius
[doctrine-best-practices]: https://ocramius.github.io/doctrine-best-practices/#/90
