# Testni primeri

- [PR01 - Prijava (pravilni podatki)](#pr01---prijava-pravilni-podatki)
- [PR02 - Prijava (neregistriran naslov)](#pr02---prijava-neregistriran-naslov)
- [PR03 - Prijava (nepravilno geslo)](#pr03---prijava-nepravilno-geslo)
- [RG01 - Registracija (veljavni podatki)](#rg01---registracija-veljavni-podatki)
- [RG02 - Registracija (neveljavni e-naslov)](#rg02---registracija-neveljavni-e-naslov)
- [Testna matrika](#testna-matrika)

## PR01 - Prijava (pravilni podatki)

**Opis**: Obstoječi uporabnik s pravilnimi podatki se lahko prijavi v sistem.

**Predpogoji**:
- Registriran testni uporabnik
- Dostop do prijavnih podatkov za tega uporabnika
- Odprta spletna stran foruma

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Navigacija na prijavno stran (/login).|Prikaže se prijavna stran z obrazcem za prijavo.|
|2|Vnos e-naslova v polje "e-mail".|V polju "e-mail" je prikazan e-naslov, ki ga je uporabnik vnesel.|
|3|Vnos gesla v polje "password".|V polju "password" je vnešeno geslo, prikaže se s krogci namesto črk.|
|4|Klik gumba "Log in".|Preusmeritev na domačo stran, uporabnik je prijavljen (v navigacijski vrstici je element z uporabniškim imenom uporabnika)|

[Nazaj](#testni-primeri)

## PR02 - Prijava (neregistriran naslov)

**Opis**: Uporabnik se z e-naslovom, ki ni registriran, ne more prijaviti v sistem.

**Predpogoji**:
- E-naslov, ki ni vezan na registriranega uporabnika
- Odprta spletna stran foruma

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Navigacija na prijavno stran (/login).|Prikaže se prijavna stran z obrazcem za prijavo.|
|2|Vnos neregistriranega e-naslova v polje "e-mail".|V polju "e-mail" je prikazan e-naslov, ki ga je uporabnik vnesel.|
|3|Vnos poljubnega gesla, dolgega vsaj 1 znak, v polje "password".|V polju "password" je vnešeno geslo, prikaže se s krogci namesto črk.|
|4|Klik gumba "Log in".|Izpis sporočila, da je e-naslov ali geslo napačno. Uporabnik ni prijavljen. Uporabnik se nahaja na strani za prijavo.|

[Nazaj](#testni-primeri)

## PR03 - Prijava (nepravilno geslo)

**Opis**: Obstoječi uporabnik se z nepravilnim geslom ne more prijaviti v sistem.

**Predpogoji**:
- Registriran testni uporabnik
- Dostop do prijavnih podatkov za tega uporabnika
- Odprta spletna stran foruma

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Navigacija na prijavno stran (/login).|Prikaže se prijavna stran z obrazcem za prijavo.|
|2|Vnos e-naslova v polje "e-mail".|V polju "e-mail" je prikazan e-naslov, ki ga je uporabnik vnesel.|
|3|Vnos poljubnega gesla, ki je dolgo vsaj 1 znak, a ni enako geslu testnega uporabnika, v polje "password".|V polju "password" je vnešeno geslo, prikaže se s krogci namesto črk.|
|4|Klik gumba "Log in".|Izpis sporočila, da je e-naslov ali geslo napačno. Uporabnik ni prijavljen. Uporabnik se nahaja na strani za prijavo.|

[Nazaj](#testni-primeri)

## RG01 - Registracija (veljavni podatki)

**Opis**: Uporabnik se lahko s še neregistriranim e-naslovom in veljavnim geslom registrira v sistemu.

**Predpogoji**:
- Izbran e-naslov, ki še ni registriran v sistemu
- Izbrano uporabniško ime, ki še ni uporabljeno
- Odprta spletna stran foruma

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Navigacija na stran za registracijo (/register).|Prikaže se stran z obrazcem za registracijo.|
|2|Vnos e-naslova v polje "e-mail".|V polju "e-mail" je prikazan e-naslov, ki ga je uporabnik vnesel.|
|3|Vnos uporabniškega imena v polje "username".|V polju "username" je prikazano uporabniško ime, ki ga je uporabnik vnesel.|
|4|Vnos gesla v polje "password".|V polju "password" je vnešeno geslo, prikaže se s krogci namesto črk.|
|5|Klik gumba "Register".|Preusmeritev na domačo stran.|

[Nazaj](#testni-primeri)

## RG02 - Registracija (neveljavni e-naslov)

**Opis**: Uporabnik se z neveljavnim e-naslovom ne more registrirati v sistemu.

**Predpogoji**:
- Izbrano uporabniško ime, ki še ni uporabljeno
- Odprta spletna stran foruma

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Navigacija na stran za registracijo (/register).|Prikaže se stran z obrazcem za registracijo.|
|2|Vnos neveljavnega e-naslova v polje "e-mail".|V polju "e-mail" je prikazan e-naslov, ki ga je uporabnik vnesel.|
|3|Vnos uporabniškega imena v polje "username".|V polju "username" je prikazano uporabniško ime, ki ga je uporabnik vnesel.|
|4|Vnos gesla v polje "password".|V polju "password" je vnešeno geslo, prikaže se s krogci namesto črk.|
|5|Klik gumba "Register".|Izpis sporočila, da e-naslov ni veljaven. Uporabnik se nahaja na strani za registracijo.|

[Nazaj](#testni-primeri)

## Testna matrika

F3 - Kot gost bi se rad registriral / prijavil, da lahko dostopam do vseh funkcionalnosti foruma.

||F3|
|---|---|
|PR01|X|
|PR02|X|
|PR03|X|
|RG01|X|
|RG02|X|

[Nazaj](#testni-primeri)