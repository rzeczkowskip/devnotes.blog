---
title: CocoaPods na Mac M1
date: 2022-07-19
tags: [macos, mac-m1, cocoapods, ruby, ios, xcode]
categories: [mobile]
draft: false
summary: >-
    Jeżeli spróbujesz zainstalować pods na "czystym" MacOS, dostaniesz piękny *load error*.
    Nie pozostaje nic innego, jak zainstalować ruby samodzielnie, zbudowane specjalnie pod arm64.
---

> [!info]
> Ten wpis to przeredagowana odpowiedź na [How to run CocoaPods on Apple Silicon (M1)][so-original-answer].
> Poprawna odpowiedź nie została oznaczona jako rozwiązanie, a mało kto szuka dalej, jeżeli pierwsza odpowiedź działa.

# Błąd podczas instalacji pods

Jeżeli spróbujesz zainstalować pods na "czystym" MacOS, dostaniesz piękny *load error*. Dzieje się tak, ponieważ `ruby`
dostarczone z systemem zostało skompilowane na maszynie x86_64 pod uniwersalną architekturę. Gdyby tego było mało, 
niedługo `ruby` zniknie z systemu:

```text
WARNING: This version of ruby is included in macOS for compatibility with legacy software.
In future versions of macOS the ruby runtime will not be available by
default, and may require you to install an additional package.
```

Nie pozostaje nic innego, jak zainstalować ruby samodzielnie, zbudowane specjalnie pod arm64.

> [!info]
> Opisany proces korzysta z domyślnych ścieżek homebrew. Jeżeli korzystasz z niestandardowej konfiguracji, ścieżka
> `/opt/homebrew` będzie odpowiadać wynikowi `brew --prefix`

# Instalacja ruby z homebrew

Zacznijmy od instalacji i konfiguracji ruby:

```shell
brew install ruby
```

Po instalacji, homebrew poinformuje Cię, że binarki zostały zainstalowane do `/opt/homebrew/lib/ruby/gems/3.1.0/bin`
(katalog wersji oczywiście może się różnić).

```text
By default, binaries installed by gem will be placed into:
/opt/homebrew/lib/ruby/gems/3.1.0/bin

You may want to add this to your PATH.

ruby is keg-only, which means it was not symlinked into /opt/homebrew,
because macOS already provides this software and installing another version in
parallel can cause all kinds of trouble.

If you need to have ruby first in your PATH, run:
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc

For compilers to find ruby you may need to set:
export LDFLAGS="-L/opt/homebrew/opt/ruby/lib"
export CPPFLAGS="-I/opt/homebrew/opt/ruby/include"
```

Dopisz ścieżki do ruby i gemów w `.zshrc`, `.zprofile` czy innym `.bashrc`

```shell
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/3.1.0/bin:$PATH"
```

Naturalnie po tej operacji należy albo załadować zmienione ustawienia, albo zrestartować shell.

Po wszystkim, sprawdź, czy `ruby` to rzeczywiście nowo zainstalowane `ruby`. Ścieżka powinna wskazywać na 
`/opt/homebrew/opt/ruby/bin/ruby`.

```shell
$ which ruby
/opt/homebrew/opt/ruby/bin/ruby
```

# Instalacja Cocoapods

Skoro ruby już jest w poprawnej wersji, zainstaluj `cocoapods`

```shell
gem install cocoapods
```

Ponownie musisz sprawdzić ścieżki, tym razem do `pods`. Ścieżka powinna wskazywać na 
`/opt/homebrew/lib/ruby/gems/3.1.0/bin/pod`

```shell
$ which pod
/opt/homebrew/lib/ruby/gems/3.1.0/bin/pod
```

# Instalacja podów

Po dokonaniu powyższych zmian, `pod install` przestaje rzucać błędami i pody instalują się poprawnie.

```shell
$ pod install
Analyzing dependencies
Downloading dependencies
Generating Pods project
Integrating client project
Pod installation complete! There is 1 dependency from the Podfile and 1 total pod installed.
```

[so-original-answer]: https://stackoverflow.com/questions/64901180/how-to-run-cocoapods-on-apple-silicon-m1
