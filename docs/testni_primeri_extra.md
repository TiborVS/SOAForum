# Testni primeri (dodatni)

Opomba: zaradi potrebe po vključitvi številskih vnosnih podatkov so testni primeri izmišljeni. Vseeno testirajo funkcionalnosti, ki bi lahko obstajale v sklopu rešitve Yet Another Forum.


- [T91 - Ocena objave](#t91---ocena-objave)


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