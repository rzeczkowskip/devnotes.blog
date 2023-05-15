---
title: 'SymfonyWorld 2020: podsumowanie'
date: 2020-12-15
tags: [php, symfony, symfony world 2020, symfonycon]
categories: [konferencje, symfony]
draft: false
summary: >-
    Kilka słów podsumowujących konferencję Symfony World 2020. Krótko o wybranych prelekcjach, odbiorze i organizacji.
image: sworld-2020.jpg
---

Minęło już trochę czasu od Symfony World 2020, a ja dopiero piszę podsumowanie. Nigdy tego nie potrafiłem. Wszelkie
przemyślenia na temat konferencji czy prelekcji zostawiałem dla siebie. Tym razem spróbuję inaczej, dzieląc się
spostrzeżeniami na temat wybranych wystąpień i samej konferencji.

# Organizacja Symfony World 2020

Event odbył się na platformie Hopin. Wszystko pod ręką – prelekcje, rozkład jazdy, ścieżki tematyczne, miejsce dla
sponsorów. Nawet opcja „networkingu”, gdzie dwie losowe osoby mogły się połączyć na żywo, porozmawiać i wymienić się
spostrzeżeniami. Drobne problemy technicznie nie przeszkodziły w pozytywnym odbiorze konferencji.

![][hopin-screenshot]

Wszystkie prelekcje zostały nagrane przed rozpoczęciem konferencji, aby zapewnić jej płynny przebieg. Po zakończeniu
wykładu (a często też przed), prelegenci byli dostępni i gotowi na pytania czy dorzucenie kilku informacji. Tutaj bez
zmian, w porównaniu z konferencjami „on site”.

# Symfony UX

Autorzy: [Fabien Potencier][fabien-tt] i [Titouan Galopin][titouan-tt]

**Kluczowe elementy:**

* Komponenty, które wpływają na DX podczas pracy z Symfony.
* Wiesz, że HttpKernelInterface nie zmienił się od 10 lat?
* Symfony UX – vanilla JS, SEO friendly i nadal kompatybilne z VueJS/React i innymi.
* Stimulus pozwala na proste odwołanie się do elementów HTML w JS.

Zaczęło się od zaprezentowania nowego dziecka: [Symfony UX][symfony-ux]. Nareszcie jakieś narzędzie, które nie jest
Reactem, Vue czy innym Angularem. Przyznaję, z początku byłem dość sceptycznie nastawiony. No bo po co mam używać
jakiegoś dodatkowego narzędzia, skoro wystarczy mi stare dobre `document.querySelector`? Ale Symfony UX to nie tylko JS.
To też połączenie między komponentami PHP i JS. Pod maską wszystkim steruje [Stimulus][stimulus js].

Na dzień dobry otrzymaliśmy 5 komponentów:

* [UX Chart.js][ux-chartjs]: integracja biblioteki do wykresów [Chart.js][chart.js]
* [UX Cropper.js][ux-cropperjs]: integracja biblioteki do przycinania obrazków [Cropper.js][cropper.js] 
* [UX Dropzone][ux-dropzone]: drag-and-drop plików w formularzach Symfony
* [UX LazyImage][ux-lazyimage]: lazy loading obrazków i generowanie placeholderów z wykorzystaniem [BlurHash][blurhash] jako funkcja Twig
* [UX Swup][ux-swup]: integracja biblioteki do płynnych przejść między podstronami [Swup][swup]. Takie SPA dla biednych 🙂

I tu muszę przyznać, że połączeniem LazyImage, Dropzone i Cropper mnie kupili. No ale nie byłbym sobą, gdybym nie
spróbował czegoś zrobić sam. Stwierdziłem, że skoro najprawdopodobniej będę już z tego z wymienionymi komponentami, to
dlaczego czegoś nie napisać? Na pierwszy ogień poszedł prosty dropdown. Wiem, że jest już kilka implementacji z
wykorzystaniem Stimulusa, ale chodziło o naukę… You know, for science!

```php
import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = ['dropdown'];

  isVisible = false;

  toggle() {
    this.dropdownTarget.style.display = this.isVisible ? 'none' : 'block';
    this.isVisible = !this.isVisible;
  }

  hide(e) {
    if (!this.element.contains(e.target) && this.isVisible) {
      this.toggle();
    }
  }
}
```

```html
<button data-action="dropdown#toggle click@window->dropdown#hide">
    {{ user.name }}
</button>

<div style="display: none" data-target="dropdown.dropdown">
    <a href="/logout">Logout</a>
</div>
```

10, no może 20 linijek i mamy dropdown, który można wpiąć w dowolnym miejscu. Nic, czego nie można osiągnąć za pomocą
czystego JS w podobnym czasie. Po prostu ładnie opakowane.

# Nowe Symfony Security

Autor: [Ryan Weaver][ryan-tt]

**Kluczowe elementy:**

* Koniec z anonymous user i IS_AUTHENTICATED_ANONYMOUSLY!
* Koniec kombinowania, czy coś jest w Auth Listener, Auth Manager czy Auth Provider.
* Prostsza integracja 2FA.
* Magic login links.

Od wersji Symfony 5.1 dostępny jest nowy system Security. Nowy i uproszczony. Od dawna chciałem przejść ze starego
systemu na nowy i opisać to na blogu, ale nie było czasu i chęci na czytanie dokumentacji zmian. 30 minut na prelekcji i
wieczorem wdrożyłem. Koniec z pisaniem 3 klas odpowiedzialnych za logowanie użytkownika. Teraz wszystko można zmieścić w
1 klasie. Co ważne, nie ma już `IS_AUTHENTICATED_ANONYMOUSLY` 🙌. Teraz w listach dostępu można stosować
`PUBLIC_ACCESS`.

# DDD dla początkujących

Autor: [Neal Brooks][neal-tt]

**Kluczowe elementy:**

* Przystępne wyjaśnienie aggregate, aggregate root czy bounded context.
* Przyjemne i łatwe w zrozumieniu przykłady.

Nie ma czegoś takiego, jak „szablon DDD dla mojej aplikacji”. Jednak dla kogoś, kto zna DDD tylko z teorii,
przedstawienie tego w taki sposób, jak zrobił to Neal może być gamechangerem. Maksymalnie uproszczony projekt,
wyjaśnienie bounded context, aggregate i aggregate root, podział na komendy i handlery, wyodrębnienie domeny, logiki.
Wszystko na tacy.

Kod, który powstał do dema w prezentacji dostępne jest na [GitHub][ddd-dla-poczatkujacych-gh].

# Podsumowanie

Mimo tego, że dużo informacji na konferencji powielało się już z moją wiedzą, nie żałuję wzięcia udziału. Nawet gdy
wydaje mi się, że świetnie znam temat, coś może mnie zaskoczyć. Podobała mi się każda prelekcja, w której wziąłem
udział (może po prostu dobrze trafiłem?).

Wszystkie prelekcje dostępne są dla uczestników na stronie [replays].

A na koniec, kilka dni po Symfony World 2020 został
ogłoszony [plan SymfonyTour na pierwsze półrocze 2021 roku][symfony-tour-plan]. Kolejna edycja World już w czerwcu, a po
drodze 4 edycje lokalne (czyli odpowiedniki SymfonyLive), w
tym [SymfonyLive Online Poland 2021][symfony-live-poland-2021]. Własny wykład nigdy nie był tak blisko…

[hopin-screenshot]: hopin.png

[fabien-tt]: https://twitter.com/fabpot
[titouan-tt]: https://twitter.com/titouangalopin
[ryan-tt]: https://twitter.com/weaverryan
[neal-tt]: https://twitter.com/nealio82

[symfony-ux]: https://symfony.com/ux
[stimulus js]: https://stimulusjs.org/

[ux-chartjs]: https://github.com/symfony/ux-chartjs
[ux-cropperjs]: https://github.com/symfony/ux-cropperjs
[ux-dropzone]: https://github.com/symfony/ux-dropzone
[ux-lazyimage]: https://github.com/symfony/ux-lazy-image
[ux-swup]: https://github.com/symfony/ux-swup

[chart.js]: https://www.chartjs.org/
[cropper.js]: https://fengyuanchen.github.io/cropperjs/
[blurhash]: https://blurha.sh/
[swup]: https://swup.js.org/

[ddd-dla-poczatkujacych-gh]: https://github.com/nealio82/absolute-beginners-guide-to-ddd-with-symfony

[replays]: https://live.symfony.com/account/replay/
[symfony-tour-plan]: https://symfony.com/blog/discover-our-online-symfonytour-first-semester-of-2021
[symfony-live-poland-2021]: https://live.symfony.com/2021-poland/
