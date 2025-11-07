# Testni plan rešitve Yet Another Forum

1. [Cilj testiranja](#cilj-testiranja)
2. [Strategija testiranja](#strategija-testiranja)
3. [Časovni načrt testiranja](#časovni-načrt-testiranja)
4. [Kriteriji zaključka testiranja](#kriteriji-zaključka-testiranja)
5. [Vloge & odgovornosti](#vloge--odgovornosti)
6. [Testni primeri](#testni-primeri)
7. [Upravljanje napak](#upravljanje-napak)
8. [Testno okolje & orodja](#testno-okolje--orodja)

## Cilj testiranja

Cilj testiranja rešitve Yet Another Forum je poskrbeti za visoko kakovost končne rešitve, se izogniti napakam med delovanjem rešitve ter izboljšati uporabniško izkušnjo. V idealnem primeru je vsaka izdana različica rešitve popolnoma skladna s specifikacijo, če je ta vnaprej ustvarjena, v nasprotnem primeru pa brez napak izponjuje vse funkcionalnosti, ki so predvidevane za to različico rešitve.

# Strategija testiranja

Rešitev se bo testirala na treh nivojih: testiranje enot, integracijsko testiranje in sistemsko testiranje.

Na sistemskem nivoju bo potekalo funkcionalno testiranje na podlagi funkcionalnosti, definiranih za rešitev.

Integracijsko testiranje se osredotoča na testiranje delovanja mikrostoritev v interakciji z drugimi mikrostoritvami, saj uporablja rešitev mikrostoritveno arhitekturo.

# Časovni načrt testiranja

V skladu z agilnim načinom dela testiranje rešitve poteka od začetka razvoja do konca obdobja podpore rešitvi.

Bolj natančno se testiranje enot opravlja že od začetka razvoja in sočasno z razvojem, kot je pričakovano od razvijalcev.

Integracijsko testiranje se začne takoj, ko vodja QA presodi, da je razvitih več komponent, ki v arhitekturi rešitve sodelujejo in je tako treba preveriti uspešnost njihove integracije.

Funkcionalno testiranje sistema se začne takoj, ko je v celoti implementirana vsaj ena izmed funkcionalnosti rešitve.

Vsi nivoji testiranja se po začetku nadaljujejo do konca podpore rešitvi, razen če so za posamezen nivo izpolnjeni kriteriji zaključka testiranja.

V vsaki iteraciji razvojnega cikla je predivdeno, da je zadnji teden namenjen funkcionalnemu testiranju in odpravljanju napak, brez dodajanja novih funkcionalnosti.

# Kriteriji zaključka testiranja

Faza testiranja v posamezni iteraciji razvojnega cikla se lahko zaključi, ko so vse funkcionalnosti testirane brez odkritja novih napak srednje ali višje resnosti ter so vse prej odkrite napake teh resnosti odpravljene.

# Vloge & odgovornosti

Sledeče vloge se razdelijo v primeru povečanja razvojne skupine - trenutno je skrbnik projekta tudi edini razvijalec in nosi vse navedene odgovornosti.

Razvijalci so zadolženi za razvoj, hkratno pisanje in izvajanje testov enot ter dosledno poročanje o vseh napakah, ki jih odkrijejo med postopkom razvoja, v skladu z postopkom, opisanim v [Upravljanje napak](#upravljanje-napak). 

Vodja QA je odgovoren za načrtovanje testiranja, vzdrževanje testnega plana, koordinacijo testiranja in v vsaki iteraciji razvojnega cikla končno potrditev kvalitete ustvarjenega izdelka. Vodja QA vzdružje register testnih primerov ter GitHub projekt z zaznanimi napakami v rešitvi.

Testerji so odgovorni za izvajanje integracijskih in sistemskih testov, pisanje testnih primerov in poročanje o odkritih napakah. Vodja QA jim lahko delegira dodatne odgovornosti.

# Testni primeri

Testni primeri imajo oznako T##, kjer je ## številka testnega primera. Testni primeri so zbrani na repozitoriju rešitve v datoteki docs/testni_primeri.md in naj sledijo formatu že obstoječih testnih primerov. Skrb za datoteko testnih primerov je odgovornost vodje QA oddelka.

Testni primeri morajo testirati vsaj eno izmed funkcionalnosti rešitve. V primerih, kjer je omogočen uporabniški vnos podatkov, se naj vhodni podatki za testne primere ustvarijo s pomočjo particioniranja na ekvivalnečne razrede in metode analize mejnih vrednosti.

Vsako funkcionalnost mora testirati vsaj en testni primer.

# Upravljanje napak

Napake, odkrite med testiranjem, se upravljajo s pomočjo funkcionalnosti Issues na GitHub repozitoriju. Tako razvijalec kot tester, ki odkrije napako, naj obvezno ustvari nov "Issue" na GitHubu, ki služi kot poročilo o napaki. Obvezno naj navede sledeče podatke:
- kdo je napako odkril
- verzija rešitve
- podatki o okolju (operacijski sistem, brskalnik, naprava, ...)
- koraki za reprodukcijo napake
- pričakovano obnašanje rešitve

"Issue" mora imeti dodano oznako "bug". Vsaka napaka ima tudi oceno resnosti (severity) in prioritete (priority). Te ocene lahko doda odkritelj napake ob ustvarjenju poročila, končno odločitev o resnosti ima vodja QA oddelka, prioriteto reševanja pa določi skrbnik rešitve.

Resnost naj bo besedni opis izmed možnosti: kritično (critical), visoko (high), srednje (medium), nizko (low).

Prioriteta naj bo število od 1 - 5, kjer je 1 najvišja prioriteta in 5 najnižja.

Stanje vseh napak naj bo vidno v posebnem GitHub projektu "Bugs", ki naj vsebuje pogled oblike Kanban table, s stolpci za zaznane napake, uspešno reproducirane napake, napake, pripravljene za ponovno testiranje ter odpravljene napake.  Skrbnik GitHub projekta je vodja QA oddelka oz. tester, ki ga določi vodja QA oddelka.

# Testno okolje & orodja

Za testiranje enot se uporabljajo različne knjižnce, odvisne od jezika implementacije. V času pisanja testnega plana so mikrostoritve implementirane v Python in Node.js okoljih, zato se za testiranje enot uporabita knjižnici Pytest in Jest.

Za integracijsko testiranje naj se uporabi orodje, ki je najbolj poznano vodji QA in večjem delu testerske ekipe.

Funkcionalno testiranje se izvaja ročno v brskalniku. ((Nimamo še denarja za inženirja avtomatizacije testiranja :) ))

Pri funkcionalnem testiranju je potrebno testne primere izvesti v najnovejših verzijah brskalnikov Chrome, Firefox in Safari. S pomočjo orodij za razvijalce se naj testira stran v različnih velikostih in orientacijah zaslona. Minimalno zahtevane podprte velikosti so 1920x1080 in 1366x768.
