---  
title: PHPCon 2022 - powrót po trzech latach
date: 2022-11-03
tags: [php, phpcon]
categories: [konferencje]
draft: false
summary: >-
    Po ponad dwóch latach czekania, odbył się PHPCon 2022.
    Tym razem spotkaliśmy się w Zawierciu na dwóch dniach wypełnionych wiedzą i rozmowami o PHP
---

Po ponad dwóch latach czekania, 28 października, w hotelu Villa Verde Congress & SPA w Zawierciu, rozpoczął się [PHPCon][phpcon] ~~2020~~ ~~2021~~ 2022.

Hotel, jako jeden z nielicznych w Polsce, może poszczycić się własnym browarem.
Jednak nie mamy mówić o hotelu, a o konferencji...

![team]

# Warsztaty

Pierwszego dnia wydarzenia odbyły się warsztaty. Niestety nie udało nam się załapać na zajęcia "Domain-Driven Design - modelowanie i implementacja agregatów" Mariusza Gila. Zamiast tego wybraliśmy się na "Jak dowiedzieć się dużo o swoim projekcie przy pomocy statycznej analizy kodu" oraz "Trunk Based Development i feature flags w istniejącym projekcie".

## Jak dowiedzieć się dużo o swoim projekcie przy pomocy statycznej analizy kodu

Prowadzący: Grzegorz Byrka i Paweł Cierzniakowski

Grzegorz i Paweł zaczęli od zaprezentowania [SonarQube][sonarqube] - narzędzia, które może przeskanować kod projektu w celu wykrycia problemów w kodzie. Po skanowaniu, wszystko może być zaprezentowane w przystępnej formie.

![sonarqube-example]

Poza PHP, "sonar" obsługuje 28 innych języków, więc sprawdzi się w projektach korzystających z wielu różnych technologii.

Skoro jesteśmy już przy różnych technologiach, Grzegorz stworzył narzędzie o nazwie [Git Static Analyzer][git-static-analyzer] pozwalające na wyciągnięcie z repozytorium Git informacji o projekcie:

- daty pierwszej oraz ostatniej zmiany w kodzie,
- listę najczęściej modyfikowanych plików (wraz z ilością modyfikacji),
- diagram aktywnych kontrybutorów.

W drugiej części warsztatu skupiliśmy się na narzędziach dedykowanych językowi PHP - [Psalm][psalm], [PHPStan][phpstan] oraz [Deptrac][deptrac]. Wykorzystując aktywne projekty open-source skonfigurowaliśmy oraz przetestowaliśmy każde z tych narzędzi, a prowadzący omówili wyniki, powiedzieli na co zwracać uwagę oraz jak je wdrożyć w istniejących projektach.

## Trunk Based Development i feature flags w istniejącym projekcie

Prowadzący: Adrian Słowik ([FeatureFlags.pl][feature-flags-pl])

Adrian pokazał w jaki sposób korzystać z feature flags - czyli przełączników włączających i wyłączających funkcjonalności w kodzie.

Przeszliśmy przez cały okres życia flagi - od wdrożenia, przez wykorzystanie, do usunięcia nieużywanych flag. Po drodze, do każdego dopisanego kawałka kodu, pisaliśmy testy jednostkowe - co rzadko się zdarza na warsztatach, ze względu na ograniczony czas.

Na koniec omówiliśmy bardziej skomplikowane zmiany czy to, w jaki sposób kilka flag może wpływać na siebie nawzajem.

Całość oparta była na [Framework X][framework-x], o którym żaden z uczestników warsztatu wcześniej nie słyszał.

# Dzień drugi - prelekcje

Całodzienne prelekcje zostały podzielone na trzy ścieżki - zieloną, czerwoną oraz niebieską. Oficjalne otwarcie konferencji nastąpiło o 9:00, a o 9:30 mogliśmy brać udział w pierwszych prelekcjach.

## Domain Driven Design - Jak zacząć?

Prowadzący: Michał Giergielewicz

Kolejna prelekcja z cyklu "podstawy i wprowadzenie do DDD". To już chyba czwarta, na którą trafiłem i czwarta, z której wyniosłem nową wiedzę. Tym razem omówiony został przypadek przekształcenia klasycznej architektury aplikacji, na architekturę warstwową z podejściem event driven oraz CQRS. Proces migracji opierał się o małe kroki, a nie wielki proces refaktoryzacji projektu. Takie podejście znacznie ułatwia zadanie oraz ogranicza ryzyko porzucenia procesu ze względu na zbyt dużą ilość jednoczesnych zmian.

## Divide & Conquer - Context Mapping

Prowadzący: Mariusz Gil ([Better Software Design][better-software-design])

Co prawda nie udało mi się załapać na warsztat Mariusza, ale prelekcji nie mogłem odpuścić. Z "Divide & Conquer - Context Mapping" można było wynieść wiedzę o tym, w jaki sposób zapanować nad efektami ubocznymi podczas zmian w kodzie dzięki zaprojektowaniu granic modeli oraz sposobu ich łączenia. Mówią, że "3 miesiące pisania kodu pomogą ci zaoszczędzić 3 godziny planowania". A tak zupełnie serio, mając poprawnie wydzielone granice modeli, łatwiej jest zorganizować zespoły oraz przyspieszyć rozwój oprogramowania.

## Środowisko deweloperskie made easy - podsumowanie

Prowadzący: Michał Giergielewicz

Początkowo miało to być wystąpienie pt. "Framework Agnostic - czy ma to w ogóle sens?", jednak w związku chorobą jednego z prelegentów, Michał zgodził się na poprowadzenie swojej prezentacji. Opowiedział nam, w jaki sposób wykorzystuje narzędzie [Traefik][traefik] w celu łatwego i szybkiego przygotowania środowiska deweloperskiego. W rzeczywistości było to streszczenie zajęć warsztatowych, które poprowadził dzień wcześniej.

## Integracja

![fire-photo]

Po intensywnym dniu zdobywania wiedzy, przyszedł czas na relaks. organizatorzy przygotowali jednocześnie trzy atrakcje:

- Koncert grupy [Turnioki][turnioki] - zespołu folkowo-rockowego,
- JeoPHPardy - zabawa oparta o zasady Jeopardy! (emitowany w latach 90' teleturniej *Va Banque* opierał się na tym samym formacie),
- kręgielnia - bo kto nie lubi rzucić kulą o wadze 3-7kg w pionki.

# Dzień trzeci - wolne

Podczas tej edycji, nie było drugiego dnia prelekcji. Organizatorzy tłumaczyli to tym, że niedzielne prezentacje zawsze cieszyły się małym zainteresowaniem, cześć osób opuszcza hotel z samego rana, a inni dochodzą do siebie po sobotniej nocy. Po chwili namysłu przypomniałem sobie, jak wyglądały moje niedziele na takich konferencjach i... W pełni popieram taką decyzję. Ani się człowiek nie skupi na słuchaniu prelegentów, ani prelegenci nie będą zadowoleni z niemrawej widowni, do której trudno dotrzeć.

# Podsumowanie

Miło było powrócić po trzech latach na PHPCon. Organizacja stała na wysokim poziomie, a cały hotel był świetnie oznakowany - co miało znaczenie przy poszukiwaniu sal warsztatowych, które były rozsiane po całym obiekcie. Jeżeli w trakcie imprezy wystąpiły jakiekolwiek problemy techniczne, to nie dało się ich odczuć.

W tym roku, niestety, nie odważyłem się wysłać swojej prezentacji... Może za rok...

![beer-wall]

# Podziękowanie

{{% block info %}}
Aktualizacja 13 listopada 2022
{{% /block %}}

Podczas konferencji była możliwość kupienia polskiego ElePHPanta "Janusza" - maskotki projektu PHP w wersji "Polska". Dwa tygodnie po konferencji przeprowadzaliśmy w biurze licytacje fantów na cele charytatywne. ElePHPant to doskonały fant... Tylko wtedy nikt o tym nie pomyślał. Po kontakcie z organizatorami, w dwie godziny, udało się ustalić wszystkie szczegóły i "załatwić" słonika na licytację.

Serdecznie dziękuję za sprawne załatwienie sprawy i możliwość zdobycia słonika drogą wysyłkową.

![janusz]

[better-software-design]: https://bettersoftwaredesign.pl/
[phpcon]: https://phpcon.pl
[feature-flags-pl]: https://featureflags.pl/
[sonarqube]: https://www.sonarqube.org/
[git-static-analyzer]: https://github.com/gbyrka/git-static-analyzer
[psalm]: https://psalm.dev
[phpstan]: https://phpstan.org/
[deptrac]: https://qossmic.github.io/deptrac/
[framework-x]: https://github.com/clue/framework-x
[traefik]: https://hub.docker.com/_/traefik
[turnioki]: http://www.turnioki.pl/

[beer-wall]: beer-wall.jpg "Ściana piw w recepcji hotelu"
[sonarqube-example]: sonarqube.jpg "Przykład wyników SonarQube"
[fire-photo]: fire.jpg "Ognisko i piwo"
[janusz]: janusz.jpg 'elePHPant "Janusz"'
[team]: team.jpg "Ekipa na konferencji"
