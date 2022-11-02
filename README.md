# Konsolowy generator planu lekcji

## Opis projektu
Aplikacja ma na celu umożliwić dla użytkownika wygenerowanie presonalizwanego oraz aktualnego planu lekcji z wykorzystaniem bazy danych Degry.

## Opis funkcjonalności
Użytkownik może:
- zaktualizować swoje dane (kierunek studiów, semestr, grupy ćwiczeniowe itp.)
- wygenerować plan (zawierający przedmioty wyłącznie podanych grup)

## Szczególnie interesujące zagadnienia projektowe
Każdorazowe uruchomienie aplikacji powoduje pobranie aktualnej bazy danych z https://degra.wi.pb.edu.pl/.<br/>
Dane te są filtrowane oraz segregowane na podstawie dokonanych wyborów oraz zapisywane w pliku config.json.<br/>
Plik ten umożliwia zapisanie profilu użytkownika, aby wybory wykonywane były wyłącznie przy pierwszym uruchomieniu, lub w wypadku chęci zmiany danych.
Jednym z wyzwań była prawidłowa integracja bibliotek. <br/>
Wprowadzenie zaawansowanych tabel oraz kolorów do aplikacji konsolowej sprawiło zaskakująco wiele trudu.<br/>
Po długim debugowaniu oraz kontaktowaniu sie z twórcą jednej z bibliotek, udało się znaleźć sprytne rozwiązanie występujących błędów.<br/>
Głównym trudem zadania niewątpliwie było zrozumienie oraz prawidłowe wykorzystanie danych z Degry.<br/>
Aplikacja napisana jest w języku Typescript będącego nadzbiorem języka Javascript.<br/> Dzięki temu projekt posiada statyczne typowanie co czyni go bardziej odpornym na nieoczekiwane błędy.


## Instrukcja instalacji
Aby uruchomic aplikację należy w pierwszej kolejności pobrac i rozpakować powyższe repozytorium. (https://github.com/viperva/kck-cli)<br/>
Aby umożliwić uruchomienie projektu, na komputerze powinno być zainstalowane środowisko uruchomieniowe Node.js (https://nodejs.org/en/download/)<br/>
Należy uruchomić konsolę i wejsc do katalogu projektu.
Następnie wykonać polecenia:<br/>
`npm install` oraz `node src/index.js`.<br/>
W przypadku systemu windows drugie polecenie wyglądać będzie następująco:<br/>
`node \src\index.js`<br/>

## Instrukcja konfiguracji
Zakładając poprawne wykonanie kroków poprzedniego punktu, nie przewiduje się dodatkowych kroków potrzebnych do prawidłowego działania aplikacji.

## Instrukcja użytkownika
Korzystanie z programu jest wybitnie proste. Jak zresztą informuje erkan powitalny,<br>
sterowanie odbywa się jedynie za pomocą strzałek oraz klawisza 'Enter' służącego do potwierdzania prezentowanych wyborów.

## Wnioski
Aplikacja jest mała i prosta w obsłudze. Oferuje aktualny, estetyczny plan lekcji.<br/>
Przewagę nad dostępnymi planami lekcji oferowanymi przez Degrę, stanowi możliwość personalizacji.<br/>

## Samoocena
W projekcie jest miejsce na rozwój (np. dodanie wsparcia dla przedmiotów obieralnych), jednak na ten moment stanowi funkcjonalną całość.
Interfejs jest prosty do nawigowania oraz zrozumienia. Małym kosztem energii uzyskujemy zadowalający rezultat.
Aplikacja jest też estetyczna dzięki wykorzstaniu tabel oraz kolorów.
Najprzyjemniejszym aspektem implementacji tego projektu jest fakt wykorzystywania przez niego realnych danych sprawiając, że ma on zastosowanie praktyczne.
Aby zrobić miejsce dla odrobiny samokrytyki, chciałbym zauważyć, że ponowne drukowanie planu odbywa się poprzez, cóż, kolejne drukowanie planu.
Mimo, że w praktyce użytkownik nie będzie miał w zwyczaju drukować kilku planów na raz, ciekawe byłoby umożliwenie nadpisania obecnie pokazanego planu.
Na tą chwilę wykracza to jednak ponad moje możliwości ze względu na brak czasu jak i umiejętności.

