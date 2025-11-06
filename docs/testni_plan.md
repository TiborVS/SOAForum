# Testni plan rešitve Yet Another Forum

potencialni deli plana (iz ppt-jev v glavnem):
- kontekst testiranja
- komunikacija testiranja
- register tveganj
- strategija testiranja
- aktivnosti testiranja in ocene
- človeški viri
- časovni načrt
- ...
- cilj testne faze
- kriteriji zaključka testne faze
- časovni plan
- odgovornosti
- knjižnica testnih primerov
- orodja
- konfiguracija strojne opreme
- procedure sledenja
- ...
- obseg
- predvidevanja
- urnik
- vloge in odgovornosti
- izhodi in rezultati
- okolje
- orodja
- upravljanje napak
- tveganja in upravljanje tveganj
- kriterij zaključka testiranja

stuff which is important i think if i was doing an actual test plan for yet another forum which was going to be released:
- cilj testiranja -> poskrbeti za visoko kakovost končne rešitve, izogibanje napakam, ki bi škodile uporabnikom ali zmanjšale zadovoljstvo uporabnikov
- kriteriji zaključka (oz. kdaj je dovolj dobro) -> mogoče v registru napak (github issues) več iteracij testiranja ni napake, ki bi imela medium ali high severity?
- very vague časovni plan (in relation to implementation and release?) -> unit testing med razvojem, integration testing po implementaciji vsakega modula (npr. logični skupek funkcij na posamezni mikrostoritvi), sistemsko testiranje posamezne funkcionalnosti takoj po implementaciji te funkcionalnosti, ... (bolj detaljno seveda)
- vloge & odgovornosti (maybe? ne vem če je applicable za solo dev team) -> če se pretendam da je več ljudi, devs so responsible za unit testing, error reporting karkoli odkrijejo med developmentom, ... 
- testni primeri (kje so, kakšni so, idk man) -> na github/docs/test_cases lol
- upravljanje napak (kak se reportajo, kak se pohandleajo) -> github issues! severity, priority
- testno okolje & orodja -> oh god ne vem, pač pogooglaj najbolj pogoste lol
