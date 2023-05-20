---
title: DTO w formularzu Symfony - część 2
date: 2020-11-29
tags: [php, symfony, dto, formularz, doctrine]
categories: [symfony]
draft: false
summary: >-
    Chcę ponownie poruszyć temat używania DTO do obsługi formularzy w Symfony. Okazuje się, że można kilka spraw
    doprecyzować. Format wpisu będzie odrobinę inny. Postaram skupić się na konkretnych przypadkach użycia i je opisać.
---

Chcę ponownie poruszyć temat używania DTO do obsługi formularzy w Symfony. Okazuje się, że można kilka spraw
doprecyzować. Format wpisu będzie odrobinę inny. Postaram skupić się na konkretnych przypadkach użycia i je opisać.

> [!info]
> Ten wpis rozszerza informacje zawarte w jednym z poprzednich wpisów:
> [DTO w formularzu Symfony][dto-w-formularzu-symfony].

# To null or not to null

DTO to nie jest Value Object. Podlega modyfikacjom. Jest workiem na dane. Dlatego zamiast
getterów i setterów, udostępniam w nim publiczne atrybuty. Tylko dlaczego wszystkie są inicjowane z wartością `null`? I
dlaczego tak jest, nawet jeżeli jakieś dane są wymagane? Po pierwsze: kiedy to możliwe, staram się nie używać
konstruktorów w DTO. To ma być pusty obiekt, który dopiero wypełnię danymi. Po drugie: DTO podlega zewnętrznej
walidacji. Fakt, że korzystam z komponentu `symfony/validator` chyba ma największy wpływ na „nulle”. Asercje definiują,
czy dana wartość ma być pusta, jakiego ma być typu, długości i co mi tam jeszcze przyjdzie do głowy. Gdy walidator
rozpoczyna swoją pracę, stara się dotrzeć do wartości przez publiczne atrybuty czy gettery. Gdybym nie inicjował
wartości atrybutów, kończyłbym z błędem:

```
PHP Warning:  Uncaught Error: Typed property Foo::$foo must not be accessed before initialization
```

No dobra, ale co się stanie, jeżeli zapomnę przepuścić dane przez validator i
przekaże do encji `null` zamiast jakiejś wartości? Podstawową ochroną jest definicja typu atrybutu metody w klasie czy
konstruktorze. Przekaż złe dane i dostaniesz `TypeError`. Drugą linią ochrony może być dodatkowa walidacja danych z
wykorzystaniem np.: `beberlei/assert`.

```php
public function setTitle(string $title): void
{
    Assertion::notBlank($title);
    $this->title = $title;
}
```

Dzięki temu, gdy przekażę do encji niepoprawne dane, dostanę wyjątkiem w twarz.

# Rozdzielenie danych między tworzeniem a edycją

Zazwyczaj mam możliwość wykorzystania jednej klasy do tworzenia i edycji
danych w encji. Jest łatwiej, dane wejściowe zawsze obsługuję za pomocą tej samej klasy. Jakiś czas korzystałem z opcji
„1 DTO 1 akcja”, jednak w większości przypadków obie klasy wyglądały tak samo z wyjątkiem konstruktora, który jako
argument brał encję i z niej były inicjowane dane. Dużo łatwiej jest wykorzystać mechanizm częściowej walidacji na
podstawie grup ([dokumentacja validation groups](https://symfony.com/doc/current/form/validation_groups.html)).

Zostaje jeszcze uproszenie tworzenia obiektu wypełnionego istniejącymi danymi. **Named constuctors** na ratunek! Zamiast
przyjmować atrybuty w konstruktorze, tworzę statyczną metodę `fromEntity`:

```php
class Foo
{
    /**
     * @Assert\NotBlank()
     */
    public ?string $foo = null;

    public static function fromEntity(Entity $bar): self
    {
        $data = new self();
        $data->foo = $bar->getFoo();

        return $data;
    }
}
```

Prawda, że łatwiej?

# Relacje między encjami

I znów problem, który rozwiązywałem na dwa sposoby.

Zacznijmy od prostszego w obsłudze. Można pomyśleć, że skoro do obsługi formularza wykorzystuje się DTO, to nie powinno
się używać pola `EntityType`. Tylko dlaczego nie? Przecież chodzi tylko o rozdzielenie danych przed walidacją od encji.
`EntityType` nie wprowadza zmian, a służy tylko do ich odczytu. Takie rozwiązanie ma jeszcze jeden plus: nie trzeba pisać
odrębnego walidatora sprawdzającego, czy encja istnieje. Robi to za nas wbudowany mechanizm pola w formularzu. W takim
przypadku obiekt danych powinien przyjąć encję, a nie inne DTO czy samo ID.

Teraz rozwiązanie odrobinę bardziej skomplikowane, w którym do DTO przekazuje się tylko ID encji. W takim przypadku,
zamiast z `EntityType` korzysta się z `ChoiceType`. Teoretycznie, `ChoiceType` załatwia za mnie sprawdzenie, czy wybrana opcja
istnieje. Mimo wszystko wolę dopisać walidator, który upewni się, że encja o danym ID istnieje w bazie. Minusy tego
rozwiązania to konieczność samodzielnego budowania listy opcji i walidatora.

Drugie rozwiązanie częściej sprawdza się w przypadku API – dlatego zaproponowałem przekazanie ID, a nie obiektu encji.
Pracując z API i podstawowym serializerem Symfony, zazwyczaj otrzymujemy ID, a nie obiekt encji. Jeżeli dane pochodzą
tylko z formularza, łatwiej jest zbudować listę opcji złożoną z encji, zamiast z ID. Mimo wszystko i tak dopisałbym
walidator 🙂

# Podsumowanie

Post powstał na skutek opublikowania postu w jednej z grup, do których należę na Facebooku. Zaczęło się od
wyjątku spowodowanego błędnym typem danych przekazanych do settera.

Mam nadzieję, że ten artykuł rozwiał wątpliwości i pytania powstałe po przeczytaniu pierwszej części. Jeżeli masz
jeszcze jakieś pytania lub sugestie, zapraszam do dodania komentarza.

[dto-w-formularzu-symfony]: /posts/2020/07/dto-w-formularzu-symfony
