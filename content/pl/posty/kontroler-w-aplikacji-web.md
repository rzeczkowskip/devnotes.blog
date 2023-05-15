---
title: Kontroler w aplikacji web – czyli o akcjach i requestach
date: 2020-07-24
tags: [adr, best practices,di, mvp, srp, web]
categories: [architektura]
draft: false
summary: >-
    Co ma robić kontroler w aplikacji web? Takie podstawowe zadanie. Czym powinien się zajmować? Powinien zwrócić
    odpowiedź na zapytanie (request to response... Jakoś dziwnie mi to brzmi po polsku). Ma być prostą warstwą łączącą
    framework, z którego korzystasz, z Twoim kodem.
---

Co ma robić kontroler w aplikacji web? Takie podstawowe zadanie. Czym powinien się zajmować? Powinien zwrócić odpowiedź
na zapytanie (request to response… Jakoś dziwnie mi to brzmi po polsku). Ma być prostą warstwą łączącą framework, z
którego korzystasz, z Twoim kodem.

Niby proste zadane. Przyjmij request, zrób magię, zwróć response. Często zdarza mi się otworzyć klasę kontrolera i
zobaczyć operacje na modelach bazodanowych, masę logiki w metodach czy obsługę kilku akcji z jednego kontrolera. Knock,
knock. Nie tędy droga. Z początku wszystko wygląda ładnie. Jednak z czasem sami wiecie, co się dzieje.

# SRP, coś Ci to mówi?

Człowiek uczy się całe życie. Gdy pierwszy raz usłyszałem o SRP (**Single-Responsibility Principle**), wydawało mi się,
że no przecież stosuję. Moje kontrolery obsługują tylko profil użytkownika. I aktualizację profilu użytkownika.
Logowanie. Wylogowanie. I cokolwiek ten użytkownik może sobie sam zrobić. Niby jest wspólny mianownik:
użytkownik. Ale moje klasy zamiast być tępymi przekaźnikami, robiły wszystko. Tego nie dało się nawet czytać.

Można to rozwiązać inaczej – moim zdaniem lepiej. Jeden kontroler to jedna akcja. Jeden request. Osobno widok profilu,
osobno logowanie, itd. Pracując z klasyczną aplikacją, wyjątkiem jest zmiana danych. W takim przypadku jedna akcja
odpowiada za wyświetlenie formularza i obsługę POSTa. Po prostu jest łatwiej, a single responsibility to w tym przypadku
pełna obsługa zmiany danych, wliczając w to zwrócenie interfejsu, który te dane przyjmie. W przypadku akcji
obsługujących API, jeden request = jedna klasa.

Skończysz w ten sposób z pierdylionem malutkich kontrolerów, z czego każdy odpowiedzialny jest tylko za 1 request. Masa
plików, ale uwierz mi, z czasem dużo łatwiej się w tym wszystkim połapać. Jeżeli potrafisz dobrze nazywać klasy, to
będzie jeszcze łatwiej. Wiesz, że nazywanie rzeczy, to jedna z najtrudniejszych rzeczy w IT.

> There are only two hard things in Computer Science: cache invalidation and naming things.
> 
> &mdash; Phil Karlton

# Zależności i kontroler

Jeżeli masz jeden duży kontroler, odpowiedzialny za wiele akcji, często masz w nim też jakiś service locator. Ten
service locator to zazwyczaj Twój cały kontener DI (**Dependency Injection Container**). Dostęp do każdego serwisu w
aplikacji na wyciągnięcie ręki. Bardzo fajne i wygodne. Z czasem takie rozwiązanie odbije się czkawką. A weźmie mi to
Pan i przetestuje… Heh. Tak myślałem.

Dobra. Skoro każda akcja jest już wydzielona do osobnej klasy, to możesz zająć się wycinaniem kontenera/service locatora
z kodu. Zastosuj wstrzykiwanie zależności (**Dependency Inversion Principle**) i do kontrolera przekazuj tylko te
serwisy, z których rzeczywiście korzystasz. Oczywiście zachowaj zdrowy rozsądek. Jeżeli wstrzykujesz tyle serwisów, że
ich lista jest wyższa niż Twój ekran (witaj Magento :D), to znaczy, że coś poszło nie tak.

# Kontroler, a logika biznesowa

Na tym etapie masz pojedyncze akcje rozdzielone na klasy i wstrzyknięte podstawowe zależności. A co z tą całą logiką,
która leci przez kontroler? Wydziel ją do niezależnych serwisów!

Każdy ma inną definicję „zbyt dużej ilości zależności”. Stosuję tutaj 2 zasady, zależnie od przeznaczenia akcji. W
przypadku akcji API staram się nie przekraczać 3 wstrzykiwanych klas. W przypadku akcji w klasycznej aplikacji limit
wynosi 5. Dlaczego tak? Opcja klasyczna potrzebuje tego samego co API, czegoś do szablonów, czegoś do formularzy i
ewentualnie czegoś do generowania URL (do przekierowań, ale i to można obejść). Ale to górny limit. Zazwyczaj kończy się
na 2-3 zależnościach.

To teraz przykład, jak by to miało działać. Załóżmy, że masz do obsłużenia formularz. Biblioteka generująca formularze
potrafi z zapytania wyciągnąć sobie dane i zwrócić Ci obiekt, jakiego potrzebujesz. Wrzucasz taki request na formularz,
sprawdzasz, czy formularz rzeczywiście został wysłany, a obiekt z danymi przekazujesz do dopiero co wydzielonego
serwisu. Niech tam dzieje się magia. To tam masz przekazać dane do bazy. To tam masz zlecić wysłanie maila. Kontroler
jest tylko przekaźnikiem. W ten sposób możesz, nie pisząc dwa razy tego samego kodu, obsługiwać akcję z kilku miejsc –
czy to z API, czy z CLI, czy w kolejkach. A i testowanie wszystkiego jest o wiele prostsze.

# Podsumowanie

Podsumowanie, czyli cały post w pigułce.

**Po pierwsze:** z każdego kontrolera wydziel wszystkie akcje do pojedynczych klas. Wydaje Ci się to zbędną granulacją,
ale na koniec dnia wszystko stanie się prostsze i przyjemniejsze w utrzymaniu.

**Po drugie:** jeżeli masz service locator w kontrolerze, to się go pozbądź. To jest anti-pattern (antywzorzec
projektowy, jeżeli wolisz to usłyszeć po polsku). Dużo lepszym rozwiązaniem jest przekazaniem tylko potrzebnych
zależności do klasy i ograniczenie ich ilości.

**Po trzecie:** skoro ograniczasz ilość zależności, to wydziel całą logikę biznesową do osobnej klasy. W ten sposób
odpowiedzialność kontrolera kończy się na przekazaniu danych z requestu głębiej do aplikacji.

Pytania?
