---
title: Automatyzacja obsługi zamówienia w e-commerce
date: 2020-11-21
tags: [case study, ecommerce, integracja]
categories: [case study, architektura]
draft: false
summary: >-
   Automatyzacja obsługi zamówienia. W skrócie: oddelegowanie wszystkich czynności, które mogą sprawić problem lub
   „spalić” czyjś czas. W końcu lepiej zająć się bezpośrednio sprzedażą niż przygotowaniem paczek.
image: ecommerce-automatyzacja.jpg
---

Kilka tygodni temu miałem okazję współpracować przy procesie (niemal) pełnej automatyzacji obsługi zamówienia w
e-commerce. Naszymi celami były:

1. Integracja z bramkami płatności
1. Integracja z systemem do fakturowania
1. Integracja z magazynem/centrum logistycznym
1. Pełna automatyzacja „happy path” – jeżeli nie wystąpiły nieoczekiwane błędy, zamówienie jest bezobsługowe
1. Ręczna obsługa błędów – administrator otrzymuje powiadomienie, a wszystkie wstrzymane zamówienia są sprawdzane
   ręcznie

W skrócie: oddelegowanie wszystkich czynności, które mogą sprawić problem lub „spalić” czyjś czas. W końcu lepiej zająć
się bezpośrednio sprzedażą niż przygotowaniem paczek.

![__Diagram automatyzacji][automatyzacja-diagram]

Korzystaliśmy z platformy Magento, dlatego może pojawić się kilka naleciałości tego systemu. Wdrożenie podobnego (może
nawet identycznego) procesu jest możliwe również w innych systemach.

Chcę jeszcze zwrócić uwagę na to, że kilka razy w tekście pojawia się sformułowanie „skorzystaliśmy z wtyczki X” czy
„skorzystaliśmy z integracji Y”. Naszym zadaniem nie było wymyślanie e-commerce czy innych bramek płatności od nowa.
Staraliśmy się wykorzystać dostępne narzędzia. Zdarzyło się, że jakiś czas po integracji zderzaliśmy się ze ścianą i
trzeba było szukać zastępstwa. Nadal sądzę, że jest to lepsza opcja od wymyślania wszystkiego na nowo.

# Przyjęcie nowego zamówienia

Jak już wspomniałem, do stworzenia sklepu wykorzystaliśmy Magento. Nowe zamówienie
zapisywane jest ze statusem *oczekujące* i przekazane do systemu płatności. Na tym etapie za dużo się nie dzieje. Skoro
*„oczekujące”*, to czekamy...

# Płatności

Chyba najprostsza (pod względem wdrożenia) integracja w całym systemie. Skorzystaliśmy z usług i wtyczki
jednego z dostawców szybkich płatności. I jest to jedyny sposób płatności w sklepie. Żadnych przelewów tradycyjnych itd.
Cała odpowiedzialność za ściągnięcie pieniędzy z klienta spada na dostawcę systemu. Interesuje nas przekazanie danych
zamówienia i pobranie (czy otrzymanie) zwrotki ze statusem. Resztą niech zajmie się ktoś inny.

Zamiast korzystać z gotowców, można skorzystać z „pół gotowców” ([Omnipay][omnipay] czy [Payum][payum]) lub napisać całość od początku.
Jednak, skoro rozwiązanie już istnieje i jest odpowiednie, to po co kombinować?

Wróćmy do sposobu działania systemu płatności.

Po otrzymaniu potwierdzenia płatności możemy ruszyć z procesem realizacji zamówienia. Wywołujemy 2 akcje:

1. Zmiana statusu zamówienia na w trakcie realizacji
1. Wystawienie dokumentu sprzedaży Magento
   
# Dokument sprzedaży

Zdecydowaliśmy się na integrację z zewnętrznym systemem. Nie chcąc ingerować za bardzo w core Magento, wykorzystaliśmy
jego system fakturowania jako trigger dla naszych akcji. Po otrzymaniu płatności, w Magento automatycznie wystawiana
jest faktura – i na tym kończy się jej odpowiedzialność. Nigdzie jej nie przekazujemy. Po prostu jest. Wystawienie
faktury wywołuje event, który pozwala na przekazanie zamówienia do naszego systemu. Dostajemy zwrotkę, zapisujemy numer
i datę. Wszyscy są zadowoleni. W panelu zamówień udostępniliśmy opcję „wystaw dokument sprzedaży”. Tak na wszelki
wypadek.

Wszystkie 3 akcje, tj.: wystawienie, zapis i wysyłka dokumentu, działają niezależnie na kolejkach. Po wystawieniu
dokumentu publikujemy wiadomość „zapisz dokument X i przypisz do zamówienia Y”. Po zapisie publikujemy kolejną
wiadomość, informującą o konieczności wysyłki e-mail do klienta.

I tu trzeba odrobinę zwolnić.

# Generowanie dokumentu

Skoro generowanie dokumentów sprzedaży działa asynchronicznie, to co się stanie, gdy dokument
jeszcze nie zostanie wystawiony, a ktoś już ponowi akcję? Kończymy z dwoma dokumentami do jednego zamówienia. Księgowość
od rana wydzwania, że jak to tak, trzeba robić zwroty, korekty i inne takie. Dlatego na początku akcji sprawdzamy, czy
mamy już przy zamówieniu numer dokumentu i datę wystawienia, aby móc przerwać akcję na samym początku.

Z czasem pojawił się jeszcze jeden problem: dokument został poprawnie wystawiony, ale zwrotka do nas nie dotarła.
Rozwiązanie jest dziecinnie proste. Wysyłamy zapytanie o dokument sprzedaży do zamówienia numer X. Jeżeli okazuje się,
że dokument istnieje, zapisujemy zwrotkę i przerywamy proces wystawiania.

Teraz trzeba poinformować klienta, że mamy dla niego nowy dokument. Dzieje się to w momencie zapisania zwrotki z numerem
i datą dokumentu. O tym akurat nie ma się co rozpisywać. Zapisano zwrotkę? Wyślij maila z PDF. Koniec.

# Obsługa błędów

Obsługa błędów związanych z wystawianiem dokumentów jest raczej sprawą indywidualną w każdym projekcie.
My na szczęście mogliśmy pozwolić sobie na nieprzerywanie procesu realizacji w przypadku wystąpienia błędu. Skoro
otrzymaliśmy płatność, to musimy wystawić dokument. Jeżeli z jakiegoś powodu dokument nie został wystawiony, w systemie
powiadomień ląduje taka informacja.

# Wysyłka

Podobnie jak w przypadku dokumentów sprzedaży, w momencie wystawienia faktury Magento, uruchamiany jest proces
wysyłki zamówienia (niezależnie od dokumentu sprzedaży). Tutaj jednak zasady odrobinę się zmieniają – każdy błąd
sprawia, że zamówienie zostaje wstrzymane i przekazane do ręcznej analizy. Centrum logistyczne nie przyjęło zamówienia?
Hold! Brak produktu? Hold! Błędny adres?... Chyba nie muszę dalej wymieniać.

Ważną częścią integracji z centrum logistycznym jest zasada „log everything”. Każdą informację, którą otrzymamy z
magazynu, zapisujemy w systemie. Obsłudze sklepu nie prezentujemy wszystkich danych, a jedynie te, które są dla nich
wartościowe. Nie ma potrzeby informowania o poprawnej synchronizacji danych między e-commerce a centrum. Za to
informacja o wstrzymaniu zamówienia i jego powodzie jest przydatna. Ktoś użył w tym celu określenia „minimalizacja szumu
informacyjnego”. W pełni się z tym zgadzam.

Skoro obsługę błędów już opisałem, został „happy path”. Sprowadza się to do mapowania statusów centrum na statusy
e-commerce. W momencie przekazania paczki kurierowi zmieniamy status na in shipment. Po dostarczeniu do klienta zamykamy
zamówienie. Koniec!

# Podsumowanie

Zdaję sobie sprawę, że proces automatyzacji będzie się różnił w każdym projekcie. Mimo wszystko wydaje mi
się, że wybraliśmy dość zdrowe podejście i udało nam się uzyskać balans między paranoicznym logowaniem i potwierdzaniem
wszystkiego a kompletnym olaniem błędów. Tam, gdzie to możliwe ponawiamy akcje, które spowodowały błędy. Oczywiście z
limitem ponowień. Nie ma sensu w nieskończoność próbować wystawiania faktury, jeżeli NIP jest błędny, lub brakuje
danych.

[automatyzacja-diagram]: ecommerce-auto-diag.png "Automatyzacja obsługi zamówienia w e-commerce – happy path"
[omnipay]: https://omnipay.thephpleague.com/
[payum]: https://payum.forma-pro.com/
