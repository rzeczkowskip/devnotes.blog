---
title: Cloudflare Pages - deploy przez GitHub Actions
date: 2023-05-25
draft: true
---

Cloudflare Pages umożliwia utworzenie strony bezpośrednio z repozytorium (GitHub, GitLab). Sprawdzałem, działa dobrze, ale... No właśnie, ale. Postanowiłem trzymać kilka stron w jednym repozytorium. W takim przypadku, integracja po stronie Cloudflare nie daje rady.

> Monorepos or repositories with multiple codebases/applications currently cannot use the automatic GitHub/GitLab integration to build multiple sites from the same repository. However, Direct Uploads can be used to upload a monorepo as separate Pages projects from your own computer.

Pozostało mi przejęcie kontroli nad procesem budowania i wypychania strony do CF. Wykorzystałem do tego GitHub Actions, a konkretnie akcję [cloudflare/pages-action](https://github.com/cloudflare/pages-action).

Proces wygląda następująco:

1. Budujemy stronę
2. Wysyłamy do Cloudflare
3. Profit

Proste prawda? Pominiemy krok budowania. Nie ważne, czy korzystasz z Next.js, Hugo czy innego StaticSiteGeneratorUltimate, najważniejszy jest output. W dodatku, trzymając kilka stron w jednym repozytorium, "build process" może się różnić od domyślnego.

# Konfiguracja

## Strona w Cloudflare Pages

Utwórz nową stronę (Pages) w panelu Cloudflare. Zamiast wybierać opcję "Connect to Git", musisz skorzystać z "direct upload". W końcu przejmujesz kontrolę nad całym procesem.

## Klucz API i Account ID Cloudflare

Aby zacząć, potrzebujesz dwóch kluczy z Cloudflare: API Token oraz Account ID.

**Account ID** dostępne jest w sidebarze po wejściu w dowolną stronę/domenę lub listę projektów.

**API Token** wygeneruj na swoim koncie:

1. W panelu Cloudflare przejdź do "My Profile", następnie do "API tokens"
2. Wybierz niestandardowy token (custom token)
3. W "Account Resources" wybierz "Cloudflare Pages" z dostępem "Edit"
4. Reszta ustawień dowolna

Oba klucze zapisz jako sekrety w repozytorium.

## Akcja

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

Prościej się nie da. Kiedyś trzeba było ręcznie konfigurować `@cloudflare/wrangler`, jednak teraz całość sprowadza się do powyższej konfiguracji.

Przekazane do akcji zmienne `apiToken` oraz `accountId` to są klucze utworzone w poprzednich krokach. `projectName` to nazwa projektu w panelu Cloudflare (nazwa, nie żadne ID). `directory` to katalog, w którym lądują zbudowane pliki strony do wypchnięcia (w tym przykładzie jest to `out`).

```yaml
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: CF-PROJECT-NAME
          directory: out
```

> [!info] Przykład z produkcji
> Ten blog, w dniu pisania wpisu, jest obsługiwany przez tą akcję. Jeżeli chcesz zobaczyć jak to działa, zerknij na [workflow deploy.yml](https://github.com/rzeczkowskip/devnotes.blog/blob/main/.github/workflows/deploy.yml) w repozytorium DevNotes.
