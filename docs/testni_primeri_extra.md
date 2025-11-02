# Testni primeri (dodatni)

Opomba: zaradi potrebe po vključitvi številskih vnosnih podatkov so testni primeri izmišljeni. Vseeno testirajo funkcionalnosti, ki bi lahko obstajale v sklopu rešitve Yet Another Forum.


- [T91 - Ocena objave](#t91---ocena-objave)
- [T92 - Nastavitev starosti](#t92---nastavitev-starosti)
- [T93 - Iskanje objav po mesecu in letu](#t93---iskanje-objav-po-mesecu-in-letu)

## T91 - Ocena objave

**Opis**: Prijavljen uporabnik lahko oceni objavo drugega uporabnika od 1 do 5 zvezdic.

**Predpogoji**:
- Prijavljen uporabnik
- Odprt poljuben niz, ki vsebuje vsaj eno objavo drugega uporabnika

**Vhodni podatki**:

||Ocena|
|---|---|
|A|"" (prazno)|
|B|-10| # ekvivalenčni razredi
|C|3|   # ekvivalenčni razredi
|D|10|  # ekvivalenčni razredi
|E|0|   # analiza mejnih vrednosti (1)
|F|1|   # analiza mejnih vrednosti (1)
|G|2|   # analiza mejnih vrednosti (1)
|H|4|   # analiza mejnih vrednosti (5)
|I|5|   # analiza mejnih vrednosti (5)
|J|6|   # analiza mejnih vrednosti (5)
|K|2.5|
|L|"a"| 

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1A|Klik na polje "ocena" brez vnosa.|Vnosno polje "ocena" je prazno.|
|1B-L|Vnos ocene v polje "ocena".|V polju "ocena" je viden vnešen podatek.|
|2A|Klik na gumb "Oceni".|Prikaže se opozorilo, da mora biti ocena vnešena. Polje in gumb "ocena" ostaneta pod objavo.
|2B/D/E/J|Klik na gumb "Oceni".|Prikaže se opozorilo, da mora biti ocena število med 1 in 5. Polje in gumb "ocena" ostaneta pod objavo.|
|2K/L|Klik na gumb "Oceni".|Prikaže se opozorilo, da mora biti ocena celo število. Polje in gumb "ocena" ostaneta pod objavo.|
|2C/F/G/H/I|Klik na gumb "Oceni".|Pod objavo se namesto vnosnega polja "ocena" in gumba "Oceni" prikaže toliko zvezdic, kot je bilo vhodno število.

[Nazaj](#testni-primeri)

## T92 - Nastavitev starosti

**Opis**: Prijavljen uporabnik lahko na profilu nastavi svojo starost. Uporabnik mora biti star vsaj 13 let in največ 130 let.

**Predpogoji**:
- Prijavljen uporabnik
- Odprta stran profila uporabnika

**Vhodni podatki**:

||Starost|
|---|---|
|A|"" (prazno)|
|B|-50| # ekvivalenčni razredi
|C|9|   # ekvivalenčni razredi
|D|45|  # ekvivalenčni razredi
|E|200| # ekvivalenčni razredi
|F|-1|  # analiza mejnih vrednosti (0)
|G|0|   # analiza mejnih vrednosti (0)
|H|1|   # analiza mejnih vrednosti (0)
|I|12|  # analiza mejnih vrednosti (13)
|J|13|  # analiza mejnih vrednosti (13)
|K|14|  # analiza mejnih vrednosti (13)
|L|129| # analiza mejnih vrednosti (130)
|M|130| # analiza mejnih vrednosti (130)
|N|131| # analiza mejnih vrednosti (130)
|O|17.5|
|P|"a"|

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1A|Klik na polje "starost" brez vnosa.|Polje "starost" je prazno.|
|1B-P|Vnos vhodnega podatka v polje "starost".|Vnešen podatek je prikazan v polju "starost".
|2A|Klik na gumb "Posodobi" ob polju "starost".|Prikaže se opozorilo, da mora biti vnešena starost. Starost na profilu se ne spremeni.|
|2B/E/F/N|Klik na gumb "Posodobi" ob polju "starost".|Prikaže se opozorilo, da mora biti vnešena veljavna starost. Starost na profilu se ne spremeni.|
|2C/G/H/I|Klik na gumb "Posodobi" ob polju "starost".|Prikaže se opozorilo, da mora biti uporabnik star najmanj 13 let ter poziv, da si uporabnik v primeru mlajše starosti izbriše račun. Starost na profilu se ne spremeni.|
|2D/J/K/L/M|Klik na gumb "Posodobi" ob polju "starost".|Starost na profilu se posodobi z novo vnešeno vrednostjo.|
|2O/P|Klik na gumb "Posodobi" ob polju "starost".|Prikaže se opozorilo, da mora biti vnešeno celo število. Starost na profilu se ne spremeni.|

[Nazaj](#testni-primeri)

## T93 - Iskanje objav po mesecu in letu

**Opis**: Uporabnik lahko brska med vsemi objavami na forumu, ki so bile objavljene v izbranem mesecu in letu.

**Predpogoji**:
- Odprta stran mesečnega arhiva

**Vhodni podatki**:

||Mesec|Leto|
|---|---|---|
|A|"" (prazno)|"" (prazno)
|B|-3|1989| # ekvivalenčni razredi
|C|6|2025|   # ekvivalenčni razredi
|D|15|2800|  # ekvivalenčni razredi
|E|0|2024| # analiza mejnih vrednosti (1 / 2025)
|F|1|2025| # analiza mejnih vrednosti (1 / 2025)
|G|2|2026| # analiza mejnih vrednosti (1 / 2025)
|H|11|prejšnje leto|   # analiza mejnih vrednosti (12 / trenutno leto)
|I|12|trenutno leto|   # analiza mejnih vrednosti (12 / trenutno leto)
|J|13|naslednje leto|  # analiza mejnih vrednosti (12 / trenutno leto)
|K|2.5|2025.1|
|L|"abc"|"abc"|

**Koraki in pričakovani rezultati**:

|Korak #| Postopek | Pričakovan rezultat |
|---|---|---|
|1A|Izbris vsebine polj "mesec" in "leto".|Polji "mesec" in "leto" sta prazni.|
|1B-L|Vnos vhodnih podatkov v polji "mesec" in "leto".|Polji "mesec" in "leto" prikazujeta vnešena podatka.|
|2A|Klik na gumb "Išči".|Prikaže se opozorilo, da mesec in leto ne smeta biti prazna.|
|2B/D/E/J|Klik na gumb "Išči".|Prikaže se opozorilo, da mesec ali leto nista veljavni vrednosti.|
|2C/F/H/I|Klik na gumb "Išči".|Prikaže se izpis objav, ustvarjenih na izbran mesec in leto, ali sporočilo "V tem obdobju ni objav".|
|2G|Klik na gumb "Išči".|Če je trenutno leto 2026 ali pozneje, se prikaže izpis objav, ustvarjenih na izbran mesec in leto, ali sporočilo "V tem obdobju ni objav". Drugače se prikaže opozorilo, da mesec ali leto nista veljavni vrednosti.|
|2K/L|Klik na gumb "Išči".|Prikaže se opozorilo, da morata mesec in leto biti celi števili.|

[Nazaj](#testni-primeri)
