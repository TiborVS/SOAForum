# Testni primeri

- [T01 - Registracija](#t01---registracija)
- [T02 - Prijava](#t02---prijava)
- [T03 - Upravljanje razdelkov](#t03---upravljanje-razdelkov)
- [T04 - Upravljanje objav](#t04---upravljanje-objav)
- [T05 - Glasovanje o objavah](#t05---glasovanje-o-objavah)
- [Testna matrika](#testna-matrika)

## T01 - Registracija

**Opis**: Nov uporabnik se lahko s primernimi podatki registrira v sistem.

**Predpogoji**:
- Izbran e-naslov, ki še ni registriran v sistemu
- Izbran e-naslov, ki je že registriran v sistemu
- Odprta domača stran foruma
- Uporabnik ni prijavljen

**Vhodni podatki**:

||E-naslov|Uporabniško ime|Geslo|
|---|---|---|---|
|A|"" (prazno)|"" (prazno)|"" (prazno)|
|B|"abc.def@site.com"|""|""|
|C|"abc.def@site.com"|"abcd"|""|
|D|že registriran naslov|"abcd"|"abcd"|
|E|neregistriran naslov|"abcd"|"abcd"|

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Klik gumba "Register" na domači strani.|Prikaže se stran z obrazcem za registracijo.|
|2A|Klik gumba "Register".|Prikaže se sporočilo, da mora biti vnešen e-naslov. Registracijska stran ostane odprta.|
|2B|Vnos e-naslova "abc.def@site.com" v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3B|Klik gumba "Register".|Prikaže se sporočilo, da mora biti vnešeno uporabniško ime. Registracijska stran ostane odprta.|
|2C|Vnos e-naslova "abc.def@site.com" v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3C|Vnos uporabniškega imena "abcd" v polje "username".|Vnešeno uporabniško ime je vidno v polju "username".|
|4C|Klik gumba "Register".|Prikaže se sporočilo, da mora biti vnešeno geslo. Registracijska stran ostane odprta.|
|2D|Vnos že registriranega naslova v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3D|Vnos uporabniškega imena "abcd" v polje "username".|Vnešeno uporabniško ime je vidno v polju "username".|
|4D|Vnos gesla "abcd" v polje "password".|V polju "password" so vidne 4 pike oz. znaki za zakritje gesla.|
|5D|Klik gumba "Register".|Prikaže se sporočilo, da je e-naslov že v uporabi. Registracijska stran ostane odprta.|
|2E|Vnos še neregistriranega e-naslova v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3E|Vnos uporabniškega imena "abcd" v polje "username".|Vnešeno uporabniško ime je vidno v polju "username".|
|4E|Vnos gesla "abcd" v polje "password".|V polju "password" so vidne 4 pike oz. znaki za zakritje gesla.|
|5E|Klik gumba "Register".|Preusmeritev na domačo stran.|

[Nazaj](#testni-primeri)


## T02 - Prijava

**Opis**: Obstoječi uporabnik se lahko s pravilnimi podatki prijavi v sistem.

**Predpogoji**:
- Registriran testni uporabnik
- Dostop do prijavnih podatkov za tega uporabnika
- Izbran e-naslov, ki še ni registriran v sistemu
- Odprta domača stran foruma
- Uporabnik ni prijavljen

**Vhodni podatki**:

||E-naslov|Geslo|
|---|---|---|
|A|"" (prazno)|"" (prazno)|
|B|e-naslov uporabnika|""|
|C|e-naslov uporabnika|poljubno napačno geslo|
|D|neregistriran naslov|"abcd"|
|E|e-naslov uporabnika|geslo uporabnika|

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Klik gumba "Log in" na domači strani.|Prikaže se prijavna stran z obrazcem za prijavo.|
|2A|Klik gumba "Log in".|Prikaže se sporočilo, da mora biti vnešen e-naslov. Prijavna stran ostane odprta.|
|2B|Vnos e-naslova uporabnika v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3B|Klik gumba "Log in".|Prikaže se sporočilo, da mora biti vnešeno geslo. Prijavna stran ostane odprta.|
|2C|Vnos e-naslova uporabnika v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3C|Vnos poljubnega napačnega gesla v polje "password".|V polju "password" je vidno toliko pik oz. znakov za zakritje gesla kot je dolžina vnesenega gesla.|
|4C|Klik gumba "Log in".|Prikaže se sporočilo, da sta e-naslov ali geslo nepravilna. Prijavna stran ostane odprta.|
|2D|Vnos neregistriranega naslova v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3D|Vnos gesla "abcd" v polje "password".|V polju "password" so vidne 4 pike oz. znaki za zakritje gesla.|
|4D|Klik gumba "Log in".|Prikaže se sporočilo, da sta e-naslov ali geslo nepravilna. Prijavna stran ostane odprta.|
|2E|Vnos e-naslova uporabnika v polje "e-mail".|Vnešen naslov je viden v polju "e-mail".|
|3E|Vnos gesla uporabnika v polje "password".|V polju "password" je vidno toliko pik oz. znakov za zakritje gesla kot je dolžina vnesenega gesla.|
|4E|Klik gumba "Log in".|Preusmeritev na domačo stran, uporabnik je prijavljen (v navigacijski vrstici je element z uporabniškim imenom uporabnika)|

[Nazaj](#testni-primeri)

## T03 - Upravljanje razdelkov

**Opis**: Prijavljen uporabnik lahko ustvarja nove razdelke. Razdelke, ki jih je ustvaril, lahko tudi uredi ali izbriše.

**Predpogoji**:
- Odprta domača stran foruma
- Prijavljen uporabnik
- Vsaj en razdelek na domači strani, ki ga je ustvaril drug uporabnik

**Vhodni podatki**:

||Naslov razdelka|
|---|---|
|A|"" (prazno)|
|B|"Potovanja"|
|C|"Travel"|

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1A|Klik na gumb "Create section".|Prikaže se sporočilo, da naslov ne more biti prazen.|
|1B|Vnos naslova "Potovanja" v polje "title".|V polju "title" je viden vnešen naslov.|
|2B|Klik na gumb "Create section".|Na dnu seznama razdelkov se pojavi nov razdelek z naslovom "Potovanja", uporabniškim imenom prijavljenega uporabnika, pravilnim datumom in uro ustvarjenja ter gumboma "Edit" in "Delete". Polje "title" v obrazcu za nov razdelek je prazno.|
|3|Klik na gumb "Edit" zraven novo ustvarjenega razdelka.|V obrazcu za nov razdelek je v polju "title" viden naslov razdelka ("Potovanja"). Pod poljem je gumb, v katerem piše "Edit section".|
|4A|Izbris vsebine polja "title".|Polje "title" je prazno.|
|5A|Klik na gumb "Edit section".|Prikaže se sporočilo, da naslov ne more biti prazen. Naslov urejanega razdelka se ne spremeni.|
|4B|Vnos naslova "Potovanja" v polje "title".|V polju "title" je viden vnešen naslov.|
|5B|Klik na gumb "Edit section".|Polje "title" je prazno. Urejani razdelek ima še vedno naslov "Potovanja".|
|4C|Klik na gumb "Edit" zraven razdelka "Potovanja".|V obrazcu za nov razdelek je v polju "title" viden naslov razdelka ("Potovanja"). Pod poljem je gumb, v katerem piše "Edit section".|
|5C|Vnos naslova "Travel" v polje "title".|V polju "title" je viden vnešen naslov.|
|6C|Klik na gumb "Edit section".|Polje "title" je prazno. Urejani razdelek ima naslov "Travel".|
|7|Klik na gumb "Delete" zraven urejenega razdelka.|Seznam razdelkov ne vsebuje izbrisanega razdelka.|
|8|Pregled seznama razdelkov.|Razdelki, ki jih ni ustvaril trenutno prijavljen uporabnik, nimajo gumbov "Edit" in "Delete".|

[Nazaj](#testni-primeri)


## T04 - Upravljanje objav

**Opis**: Prijavljen uporabnik lahko ustvarja objave ter svoje objave ureja ali briše.

**Predpogoji**:
- Odprta stran poljubnega niza v forumu, ki vsebuje vsaj eno objavo drugega uporabnika
- Prijavljen uporabnik

**Vhodni podatki**:

||Vsebina objave|
|---|---|
|A|"" (prazno)|
|B|"Zdravo!"|
|C|"Kako ste kaj danes :)"|

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1A|Klik na gumb "Post" na dnu strani.|Prikaže se sporočilo, da vsebina objave ne more biti prazna.|
|1B|Vnos besedila "Zdravo!" v besedilno polje na dnu strani.|Besedilo "Zdravo!" je vidno v besedilnem polju.|
|2B|Klik na gumb "Post" na dnu strani.|Na dnu seznama objav je nova objava z vsebino "Zdravo!", levo od nje je uporabniško ime trenutno prijavljenega uporabnika in pravilen datum ter ura objave. Pod objavo je besedilo oblike "Likes: 0  Dislikes: 0", še pod tem pa gumba "Edit" in "Delete".
|3|Klik na gumb "Edit" pod novoustvarjeno objavo.|V besedilnem polju na dnu strani je vidna vsebina objave ("Zdravo!"). Pod poljem sta dva gumba, "Edit" in "Cancel".|
|4A|Izbris vsebine besedilnega polja na dnu strani.|Besedilno polje na dnu strani je prazno.|
|5A|Klik na gumb "Edit" pod besedilnim poljem.|Prikaže se sporočilo, da vsebina objave ne more biti prazna. Vsebina urejane objave se ne spremeni.|
|4B|Vnos besedila "Zdravo!" v besedilno polje na dnu strani.|Besedilo "Zdravo!" je vidno v besedilnem polju.|
|5B|Klik na gumb "Edit" pod besedilnim poljem.|Besedilno polje je prazno. Pod besedilnim poljem je element za vnos datoteke, še pod njim pa gumb "Post". Urejana objava ima še vedno vsebino "Zdravo!".|
|4C|Klik na gumb "Edit" pod novoustvarjeno objavo.|V besedilnem polju na dnu strani je vidna vsebina objave ("Zdravo!"). Pod poljem sta dva gumba, "Edit" in "Cancel".|
|5C|Vnos besedila "Kako ste kaj danes :)" v besedilno polje na dnu strani.|Besedilo "Kako ste kaj danes :)" je vidno v besedilnem polju.|
|6C|Klik na gumb "Edit" pod besedilnim poljem.|Besedilno polje je prazno. Pod besedilnim poljem je element za vnos datoteke, še pod njim pa gumb "Post". Urejana objava ima vsebino "Kako ste kaj danes :)".|
|7|Klik na gumb "Delete" pod urejeno objavo.|Seznam objav ne vsebuje izbrisane objave.|
|8|Pregled seznama objav.|Objave, ki jih ni ustvaril trenutno prijavljeni uporabnik, nimajo pod sabo gumbov "Edit" in "Delete".

[Nazaj](#testni-primeri)

## T05 - Glasovanje o objavah

**Opis**: Prijavljen uporabnik lahko glasuje o objavah drugih uporabnikov, svoje glasove spremeni ali odstrani.

**Predpogoji**:
- Odprta stran poljubnega niza v forumu, ki vsebuje vsaj eno objavo drugega uporabnika
- Prijavljen uporabnik
- Prijavljen uporabnik o izbrani objavi še ni glasoval

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1|Pregled izbrane objave.|Pod vsebino objave se nahaja besedilo v obliki "Likes: X  Dislikes: Y", kjer sta X in Y naravni števili ali 0. Pod tem besedilom sta gumba "Like" in "Dislike".|
|2|Klik na gumb "Like" pod izbrano objavo.|Pod objavo sta gumba "Dislike" in "Unreact". Število za besedilom "Likes:" se je povečalo za 1 glede na stanje pred izvedbo koraka.|
|3|Klik na gumb "Unreact" pod izbrano objavo.|Pod objavo sta gumba "Like" in "Dislike". Število za besedilom "Likes:" se je zmanjšalo za 1 glede na stanje pred izvedbo koraka.|
|4|Klik na gumb "Dislike" pod izbrano objavo.|Pod objavo sta gumba "Like" in "Unreact". Število za besedilom "Dislikes:" se je povečalo za 1 glede na stanje pred izvedbo koraka.|
|5|Klik na gumb "Unreact" pod izbrano objavo.|Pod objavo sta gumba "Like" in "Dislike". Število za besedilom "Dislikes:" se je zmanjšalo za 1 glede na stanje pred izvedbo koraka.|
|6|Klik na gumb "Like" pod izbrano objavo.|Pod objavo sta gumba "Dislike" in "Unreact". Število za besedilom "Likes:" se je povečalo za 1 glede na stanje pred izvedbo koraka.|
|7|Klik na gumb "Dislike" pod izbrano objavo.|Pod objavo sta gumba "Like" in "Unreact". Število za besedilom "Likes:" se je zmanjšalo za 1 glede na stanje pred izvedbo koraka, število za besedilom "Dislikes:" pa se je povečalo za 1 glede na stanje pred izvedbo koraka.|
|8|Klik na gumb "Like" pod izbrano objavo.|Pod objavo sta gumba "Dislike" in "Unreact". Število za besedilom "Likes:" se je povečalo za 1 glede na stanje pred izvedbo koraka, število za besedilom "Dislikes:" pa se je zmanjšalo za 1 glede na stanje pred izvedbo koraka.|

[Nazaj](#testni-primeri)

## Testna matrika

F3 - Kot gost bi se rad registriral / prijavil, da lahko dostopam do vseh funkcionalnosti foruma.

F4 - Kot uporabnik bi rad ustvarjal / urejal / brisal objave na temi oz. nizu, da lahko delim svoje mnenje.

F6 - Kot uporabnik bi rad glasoval o objavi, da lahko izrazim svoje strinjanje ali nestrinjanje brez ustvarjanja nove objave.

F8 - Kot uporabnik bi rad ustvarjal / urejal / brisal tematske razdelke, da lahko dopolnim strukturo foruma z novimi področji, ki me zanimajo.

||F3|F4|F6|F8|
|---|---|---|---|---|
|T01|X||||
|T02|X||||
|T03||||X|
|T04||X||
|T05|||X|

[Nazaj](#testni-primeri)