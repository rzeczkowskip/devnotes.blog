---
title: Windows, WSL2 i Docker
date: 2021-04-13
tags: [php, wsl2, docker, windows, xdebug]
categories: [php]
draft: true
summary: >-
    Docker w WSL2! I to "bez" Docker Desktop. Wszystko działające wewnątrz wirtualki z
    Ubuntu. Opis instalacji, konfiguracji i napotkanych problemów.
image: docker.jpg
---

Mniej więcej we wrześniu 2020 postanowiłem przetestować **Windows Subsystem for Linux**. Oczywiście zacząłem od
sprawdzenia, jak toto radzi sobie z Dockerem. Muszę przyznać, że spodobała mi się prostota instalacji, która polegała na:

1. Włączeniu obsługi WSL2.
1. Instalacji Ubuntu z Microsoft Store.
1. Instalacji Docker Desktop.
1. Włączeniu integracji Docker Desktop z WSL2.

Ot, cała filozofia. W Ubuntu nie musiałem nawet instalować klienta. Wszystko wlazło z Docker Desktop.

Ale nie może być tak kolorowo prawda? Po jakimś czasie zauważyłem, że zużycie ramu utrzymuje się w okolicy 99%. **99%**!
Szok, niedowierzanie, milion pytań bez odpowiedzi. Szybkie sprawdzenie co się dzieje i okazuje się, że Docker Desktop
ze wsparciem dla WSL2 to tak na prawdę kolejna wirtualka. Domyślna konfiguracja przydzielonej pamięci wygląda
następująco:  

> 50% of total memory on Windows or 8GB, whichever is less; on builds before 20175: 80% of your total memory on Windows	

Problem w tym, że 80% zjada każda z writualek, a nie wszystkie zusammen do kupy. Dorzucam do tego Chrome, PHPStorm i
Slacka. Nagle 16GB ramu to za mało. Myślę, że 32GB też by było mało. Doraźnie zmniejszyłem ilość przydzielonej pamięci
na wirtualkę do 6GB. Ale to był tylko plaster. Rozwiązanie na chwilę. A gdyby tak zainstalować Dockera w Ubuntu w WSL2?

# Instalacja WSL2

[Instrukcja instalacji WSL2 w Windows 10][wsl-install], którą dostarcza Microsoft to wszystko, co musisz wiedzieć.
Jeżeli lenistwo nie pozwala Ci kliknąć w link, to poniżej przedstawiam proces instalacji. Wszystkie komendy wykonuję w
*PowerShell* z uprawnieniami administratora.

1. Zaczynamy od włączenia funkcji WSL oraz obsługi maszyn wirtualnych:
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
1. Jak to bywa w Windows, konieczny jest restart systemu :)
1. Teraz czas na instalację "[Linux kernel update package][wsl-kernel-update]". Oczywiście pobieranie i uruchamianie
   plików osadzonych na jakimś blogu to nie jest dobry pomysł. Dlatego polecam
   [pobrać aktualizację ze strony Microsoft][wsl-kernel-update-install-instruction].
1. Skoro mamy już obsługę, to czas na ustawienie domyślnej wersji dla nowych dystrybucji WSL. Pomiń ten krok, jeżeli
   chcesz, aby nowo instalowane dystrybucje korzystały z WSL1, a nie WSL2:
   ```powershell
   wsl --set-default-version 2
   ```

Teraz czas na instalację systemu. W moim przypadku padło na Ubuntu 20.04. M.in. ze względu na to, że sam
korzystałem z Ubuntu i wszyscy dookoła też pracują na Ubuntu. W *Microsoft Store* wyszukaj i zainstaluj Ubuntu.

Podczas pierwszego uruchomienia Ubuntu poprosi o utworzenie użytkownika i nadanie hasła. Nazwa użytkownika nie musi
pokrywać się z nazwą użytkownika Windows.

Gotowe!

# Konfiguracja WSL2

Jeżeli, tak jak ja, chcesz trzymać pliki na partycjach Windows i korzystać z nich w WSL, to przyda się
konfiguracja automount w WSL. Sprowadza się to do edycji (w razie potrzeby, do utworzenia) pliku 
`/etc/wsl.conf` - tak, w WSL, a nie w Windows.

```ini
[automount]
enabled = true
options = "metadata,umask=22,fmask=11"
```

W związku z tym, że kluczy SSH używam i w Windows i w WSL, to trzymam je na partycji systemowej, a `.~/ssh`
jest symlinkiem. Bez powyższych ustawień nie ruszy.

# Instalacja Dockera

Instalacja Dockera

# Konfiguracja PHPStorm

# Windows Terminal

# Acrylic DNS

[wsl-install]: https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-1---enable-the-windows-subsystem-for-linux
[wsl-kernel-update-install-instruction]: https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package
[wsl-kernel-update]: https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
