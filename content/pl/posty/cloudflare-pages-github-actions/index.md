---
title: Cloudflare Pages - deploy przez GitHub Actions
date: 2023-06-04
categories: [tools]
tags: [github actions, cloudflare, static site, site generators, ci-cd]
summary: >-
    Przejęcie kontroli nad procesem publikowania strony na Cloudflare Pages. O konfigurowaniu akcji oraz budowaniu i
    publikowaniu strony z poziomu GitHub Actions.
langs:
    en: /posts/cloudflare-pages-github-actions
---

Cloudflare Pages umożliwia utworzenie strony bezpośrednio z repozytorium (GitHub, GitLab). Sprawdzałem, działa dobrze, ale... No właśnie, ale. Postanowiłem trzymać kilka stron w jednym repozytorium. W takim przypadku, integracja po stronie Cloudflare nie daje rady.

> Monorepos or repositories with multiple codebases/applications currently cannot use the automatic GitHub/GitLab
> integration to build multiple sites from the same repository. However, Direct Uploads can be used to upload a monorepo
> as separate Pages projects from your own computer.

Pozostało mi przejęcie kontroli nad procesem budowania i wypychania strony do CF. Wykorzystałem do tego GitHub Actions, a konkretnie akcję [cloudflare/pages-action](https://github.com/cloudflare/pages-action).

Proces wygląda następująco:

1. Budujemy stronę
2. Wysyłamy do Cloudflare
3. Profit

Proste prawda? Proces budowania strony różni się project-by-project, więc nie będziemy się skupiać na tym kroku. Nie ważne, czy korzystasz z Next.js, Hugo, czy innego StaticSiteGeneratorUltimate, najważniejsze są wygenerowane pliki.

# Konfiguracja

## Strona w Cloudflare Pages

Potrzebujesz strony w Cloudflare Pages. Projekt powinien być skonfigurowany jako "direct upload". Opcja "Connect to Git" jest zbędna, skoro sami wypychamy stronę. W końcu przejmujesz kontrolę nad całym procesem.

## Klucz API i Account ID Cloudflare

Mamy stronę, teraz dostępy do API: Account ID oraz API Token.

**Account ID** dostępne jest w sidebarze po wejściu w dowolną stronę/domenę lub listę projektów. Jest także w adresie po zalogowaniu się do panelu.

**API Token** musisz wygenerować samodzielnie w swoim profilu:

1. Z panelu Cloudflare przejdź do "My Profile", następnie do "API tokens".
2. Wybierz niestandardowy token (custom token).
3. W "Account Resources" wybierz "Cloudflare Pages" z dostępem "Edit".
4. Reszta ustawień dowolna.

Oba klucze zapisz jako sekrety w repozytorium.

# Akcja

```yaml
name: Deploy

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # build page in ./out

      - uses: cloudflare/pages-action@1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: CF-PROJECT-NAME
          directory: out
```

To wszystko. Kiedyś trzeba było ręcznie konfigurować `@cloudflare/wrangler`, jednak teraz całość sprowadza się do powyższej konfiguracji.

Przekazane do akcji zmienne `apiToken` oraz `accountId` to są klucze utworzone w poprzednich krokach. `projectName` to nazwa projektu w panelu Cloudflare (nazwa, nie ID czy inny klucz). `directory` to katalog, w którym lądują zbudowane pliki strony do wypchnięcia (w tym przykładzie jest to `out`).

```yaml
apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
projectName: CF-PROJECT-NAME
directory: out
```

> [!info] Przykład z produkcji
> Ten blog, w dniu pisania wpisu, jest obsługiwany przez powyższą akcję. Jeżeli chcesz zobaczyć jak to działa, zerknij na [workflow deploy.yml](https://github.com/rzeczkowskip/devnotes.blog/blob/main/.github/workflows/deploy.yml) w repozytorium DevNotes.
