---
title: ssh-rsa w MacOS Ventura
date: 2023-01-20
tags: [macos, ssh]
categories: [tools]
draft: false
summary: >-
    Zaktualizowałem MacOS do Ventury i... Nie mogłem się zalogować na serwer, ponieważ mój klucz SSH został odrzucony.
---

Po aktualizacji MacOS do wersji 13.0 *Ventura* i próbie zalogowania na serwer za pomocą ssh, okazało się, że nie mam dostępu. Pierwsza myśl? "Ktoś usunął mój klucz". Na szczęście problem okazał się o wiele mniej skomplikowany - Ventura dostarcza OpenSSH, które domyślnie ma wyłączoną obsługę kluczy *RSA*.

```text
debug1: SSH2_MSG_NEWKEYS received
...
debug1: Offering public key: /Users/piotr/.ssh/id_rsa RSA 
...
user@server: Permission denied (publickey).
```

# Przywrócenie obsługi kluczy RSA

Optymalnym rozwiązaniem byłoby przejście na inny algorytm (w dniu pisania tego wpisu byłby to **Ed25519**), jednak nie zawsze jest to możliwe. Dlatego można przywrócić obsługę kluczy RSA dodając w konfiguracji następujące wpisy:

```text
HostkeyAlgorithms +ssh-rsa
PubkeyAcceptedAlgorithms +ssh-rsa
```

Gdzie znajdziesz konfigurację? Do wyboru masz 2 pliki:

1. `/etc/ssh/ssh_config` - wymaga uprawnień administratora, ale działa globalnie,
2. `~/.ssh/config` - lokalna konfiguracja dla bieżącego użytkownika.

Po zmianie konfiguracji znów możesz zalogować się na serwer korzystając ze swojego klucza.

Osobiście trzymam konfigurację w katalogu domowym, czyli `~/.ssh/config`. Nie muszę się martwić, że kolejna aktualizacja systemu zmieni moje ustawienia. No i łatwiej jest się przenieść na nową maszynę...