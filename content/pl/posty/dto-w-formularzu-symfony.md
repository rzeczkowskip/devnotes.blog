---
title: DTO w formularzu Symfony
date: 2020-07-14
tags: [php, symfony, dto, formularz, doctrine]
categories: [symfony]
draft: false
summary: >-
    Budujesz swój pierwszy formularz w Symfony. Co robisz? Zaglądasz do dokumentacji! Ale może jest lepszy sposób, 
    niż ten opisany w dokumentacji?
---

Budujesz swój pierwszy formularz w Symfony. Co robisz? Zaglądasz do dokumentacji! Dostajesz cały proces opisany krok po
kroku. Jak stworzyć formularz w kontrolerze, jak (i dlaczego) wydzielić stworzony formularz do osobnej klasy, cały
proces walidacji… Nic tylko czytać i budować formularze. A może lepszym sposobem będzie wykorzystanie DTO w formularzu?

> [!info]
> Hej! Powstał wpis rozszerzający zawarte tu informacje: [DTO w formularzu Symfony – część 2][dto-w-formularzu-symfony-2]

Chociaż przykłady w dokumentacji nie operują na encjach Doctrine, to można znaleźć takie sugestie. Podpinanie encji do
formularzy jest kuszące i łatwe. Nie trzeba pisać dodatkowego kodu, aby przekazać dane z formularza do bazy danych,
walidacja może zostać podpięta do encji Doctrine. Aplikacja tworzy się szybko.

*Mimo tego, że przykłady opierają się na Symfony Form i Doctrine, nic nie stoi na przeszkodzie, aby opisanych metod
używać z innymi bibliotekami.*

To rozwiązanie, mimo tego, że proste w użyciu, ma swoje minusy, m.in.: błędny stan encji Doctrine, gdy formularz zawiera
błędy, problem z wykorzystaniem biblioteki do walidacji (np.: `beberlei/assert`) czy konieczność ustawienia pól
formularza takich samych, jak atrybuty encji.

# Encja podpięta pod formularz

Czas na przykłady. Masz formularz. Masz encję Doctrine.

```php
/**
 * @ORM\Entity()
 */
class Post
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="uuid", unique=true)
     */
    private UuidInterface $id;

    /**
     * @Assert\Length(min=5)
     * @ORM\Column(type="string", nullable=false)
     */
    private string $title;

    public function __construct(UuidInterface $id, string $title)
    {
        $this->id = Uuid::uuid4();
        $this->setTitle($title);
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }
}
```  

Klikasz "wyślij" i... Tytuł jest za krótki, a encja zawiera niepoprawne dane. Wystarczy `$em->flush()` gdziekolwiek w
aplikacji i zapisujesz taki stan w bazie danych.

Aby uniknąć problemu, dodajesz warunek np.:

```php
public function setTitle(string $title): void
{
    Assertion::minLength($title, 5);
    $this->title = $title;
}
```

Klikasz „wyślij” i… 500! Symfony Form użyje settera, dostanie wyjątek i za bardzo nie wie, co z nim zrobić.

# DTO w formularzu to the rescue!

DTO – Data Transfer Object. Prosty obiekt, który nie musi nawet mieć setterów – wystarczą publiczne atrybuty. Jego
jedynym zadaniem jest przekazanie danych z miejsca A do miejsca B.

```php
class UpdatePost
{
    /**
     * @Assert\Length(min=5)
     * @Assert\NotBlank()
     */
    public ?string $title = null;
}
``` 

Z encji usuwasz annotacje walidatora, zostawiasz walidację w setterze:

```php
/**
 * @ORM\Column(type="string", nullable=false)
 */
private string $title;

public function setTitle(string $title): void
{
    Assertion::minLength($title, 5);

    $this->title = $title;
}
```

Do formularza podpinasz `UpdatePost`, a całość obsługujesz mniej więcej w ten sposób:

```php
$postUpdateData = new UpdatePost();
$form = $formFactory->create(UpdatePostType::class, $postUpdateData);

$form->handleRequest($request);

if ($form->isSubmitted() && $form->isValid()) {
    $post = $postRepository->get($id);
    $post->setTitle($data->title);

    $em->flush();
}
```

# Zmiana hasła użytkownika za pomocą DTO

Na koniec podrzucę Ci jeszcze jeden przykład, który pokaże, dlaczego warto „bawić się” w DTO w formularzu.

Załóżmy, że chcesz zmienić hasło użytkownika. Tworzysz formularz, a w nim

```php
$builder->add('newPassword', PasswordType::class);
``` 

Widzisz już problem? W encji musisz dodać atrybut, którego nie wrzucasz do bazy. Może być, może go nie być… Jest zbędny.
Obsługując to za pomocą DTO, możesz dowolnie mapować pola formularza, a na koniec – po poprawnej walidacji – przenieść
wszystko na encję. Przy okazji, encja nigdy nie pozna hasła w plaintext, bo najpierw zrobisz z niego hash.

# DTO w formularzu – po co?

Powodów jest kilka. Twój formularz i encja Doctrine są od siebie niezależne. Nie musisz martwić się, czy do bazy trafią
poprawne dane (bo trafią poprawne). Możesz wydzielić aktualizację encji do serwisu i obsługiwać ją z kilku miejsc (
formularz, api, konsola…).

[dto-w-formularzu-symfony-2]: /posty/dto-w-formularzu-symfony-2
