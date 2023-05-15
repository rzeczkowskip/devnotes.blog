---
title: Magento 2, DI i env vars
date: 2021-01-11
tags: [php, di, ecommerce, env, magento]
categories: [magento]
draft: false
summary: >- 
    Jakiś czas temu walczyłem z integracją zewnętrznej biblioteki w Magento 2. Konieczne było
    podanie danych API w konstruktorze, więc stwierdziłem, że zmienne środowiskowe (env vars) idealnie się nadadzą. DI
    Magento na to pozwala. Przynajmniej w teorii… No dobra, nie w teorii, bo już korzystałem z tej metody. Problem z
    integracją…
---

Jakiś czas temu walczyłem z integracją zewnętrznej biblioteki w Magento 2. Konieczne było podanie danych API w
konstruktorze, więc stwierdziłem, że zmienne środowiskowe (env vars) idealnie się nadadzą. DI Magento na to pozwala.
Przynajmniej w teorii… No dobra, nie w teorii, bo już korzystałem z tej metody.

# Problem z integracją zewnętrznej biblioteki i zmiennych środowiskowych

Dla uproszczenia uznajmy, że potrzebuję tylko 1 parametru w konstruktorze (`string $token`):

```php
<?php

namespace Vendor\Library;

class FooService
{
    public const ENV_VAR_TOKEN = 'FOO_API_TOKEN';

    public function __construct(string $token)
    {
        // ...
    }
}
```

I do tego konfiguracja *di.xml*

```xml
<type name="App\Module\FooService">
    <arguments>
        <argument name="token" xsi:type="init_parameter">App\Module\FooService::ENV_VAR_TOKEN</argument>
    </arguments>
</type>

<preference for="Vendor\Library\FooService" type="App\Module\FooService"/>
```

A na koniec *.env*

```env
FOO_API_TOKEN=secret
```

Ale jak to działa? No tak: jeżeli typ argumentu przekazanego do serwisu to `init_parameter`, wtedy jego wartość musi być
stałą. Następnie wartość tej stałej używana jest jako klucz, którego Magento szuka w zmiennej globalnej `$_SERVER`.
Proste prawda? Tyle że nie działa.

Dlaczego?

Odpowiedź okazała się tak prosta, że aż głupio się przyznać, że zleciało ponad pół dnia na jej znalezienie.

Magento nie umie w `init_parameter`, jeżeli klasa nie jest częścią modułu Magento, a zamiast tego, żyje w */vendor*.
Wyjątkiem jest tryb developerski `MAGE_MODE=developer`. W takim przypadku wszystko zadziała 😂

Jest jeszcze jeden wyjątek. W trybie produkcyjnym ponownie
uruchomiłem `bin/magento setup:upgrade && bin/magento setup:di:compile`. I działa.

![WTF i Magento. Nierozłączni przyjaciele][wtf-img]

# Integracja przez moduł Magento

Czas na znalezienie rozwiązania. Bo ustawieniu dziesiątek breakpointów w vendorach Magento okazało się, że chwili
pierwszej kompilacji DI Magento, system nic nie wie o tym, że ma pobrać dane ze zmiennej środowiskowej. Najprostsze
rozwiązanie, na jakie udało mi się wpaść (biorąc pod uwagę presję czasu, nie szukałem kolejnych :)) to rozszerzenie
klasy biblioteki w module, który ją integruje. W rezultacie mam taki kod:

```php
<?php

namespace App\Module;

class FooService extends \Vendor\Library\FooService
{
    public const ENV_VAR_TOKEN = 'FOO_API_TOKEN';
}
```

Oczywiście *di.xml* wymagało poprawy:

```xml
<type name="App\Module\FooService">
    <arguments>
        <argument name="token" xsi:type="init_parameter">App\Module\FooService::ENV_VAR_TOKEN</argument>
    </arguments>
</type>

<preference for="Vendor\Library\FooService" type="App\Module\FooService"/>
```

Nawet nie próbowałem dodać konstruktora w klasie modułu. Wystarczyło rozszerzyć klasę biblioteki i nagle Magento potrafi
wstrzyknąć odpowiednie dane w odpowiednie miejsca.

# Podsumowanie 

Naprawdę nie wiem jak to podsumować. Wydaje mi się, że skoro Magento oferuje w taki czy inny sposób korzystanie ze 
zmiennych środowiskowych, to powinny one działać. Z drugiej strony, to Magento. Nie spodziewajmy się cudów.

Lekcja na przyszłość: jeżeli chcesz coś zrobić pomijając dziwne konfiguracje Magento – nie rób tego. Jakkolwiek
niezrozumiały, dziwny i ułomny kod miałby z tego powstać, lepiej tak, niż później walczyć kilka godzin z wyżej opisanym
problemem.

[wtf-img]: wtfmoment.jpg "WTF i Magento. Nierozłączni przyjaciele"
