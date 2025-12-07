# Poročilo funkcionalnega testiranja (7. 12. 2025)

Odgovorna oseba: Tibor Vito Šušnjara

Datum in ura izvedbe: 7. 12. 2025, 15:22

Izvedeni testni primeri: (dokumentacija [tukaj](testni_primeri.md))
- T02 (Prijava)
- T03 (Urejanje razdelkov)
- T04 (Urejanje objav)

## Povzetek rezultatov

Čas izvajanja: 10.58 sekund

|Testni primer|Naziv|Rezultat|Komentar|
|---|---|---|---|
|T02|Prijava|Pričakovano neuspel|Že znana napaka pri prijavi, ki še ni odpravljena|
|T03|Urejanje razdelkov|Uspešen|/|
|T04|Urejanje objav|Uspešen|/|

## Testno okolje

**Operacijski sistem**: Windows 11 Home 24H2

**Izvajalno okolje**: Python 3.14

**Knjižnice**:
- playwright: 1.56.0
- pytest: 9.0.1
- pytest-playwright: 0.7.2
- python-dotenv: 1.2.1

## Zaznane napake

### T02 - Prijava

Potrjene že znane napake:
- Korak 4C, ne prikaže se opozorilo o napačnemu e-naslovu/geslu
- korak 4D, ne prikaže se opozorilo o napačnemu e-naslovu/geslu