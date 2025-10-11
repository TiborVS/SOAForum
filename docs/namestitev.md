# Namestitev

[Namestitev za razvoj](#namestitev-za-razvoj)

[Namestitev z Dockerjem (hitreje)](#namestitev-z-dockerjem)

## Namestitev za razvoj

Aplikacija je razvita in testirana z Node.js verzijo 22.X ter Python verzijo 3.12.X.

Yet Another Forum uporablja mikrostoritveno arhitekturo, in sicer je sestavljen iz 4 mikrostoritev ter čelne (frontend) storitve. Vsako storitev je potrebno vzpostaviti samostojno.

Najprej kloniramo repozitorij na lokalno napravo.

### Podatkovna baza

Mikrostoritve za podatkovno bazo uporabljajo MongoDB. Lahko gostujemo lastni strežnik MongoDB ali uporabimo MongoDB Atlas, oblačnega ponudnika.
V vsakem primeru je potrebno za vsako storitev ustvariti lastno podatkovno bazo na strežniku in pridobiti niz (URL) za povezavo. Primer niza za povezavo je viden pri navodilih za namestitev storitev.

### Storitve users, files, posts 

Storitve za uporabnike, datoteke in objave so implementirane v Node.js okolju, s pomočjo ogrodja Express. 
Namestitveni postopek je (skoraj) enak za vse tri.

Najprej se postavimo v direktorij posamezne storitve in namestimo potrebne Node.js pakete.
```bash
cd users_service # ali posts_service ali files_service
npm install
```

Nato konfiguriramo okoljske spremenljivke za storitev. Primer konfiguracije se nahaja v datoteki `example.env`. Dejansko konfiguracijo zapišemo v datoteko `.env`,
kateri git ne sledi in naj ostane na lokalni napravi zaradi občutljivih podatkov.

Primer konfiguracije za storitev za uporabnike:
```env
MONGO_URI=mongodb+srv://username:password@host:port/databaseName?retryWrites=true&w=majority&appName=MyCluster
JWT_SECRET=verysafesecret
PORT=3000
```

Konfiguracije se razlikujejo zaradi različnih odvisnosti med storitvami. Vse storitve so npr. odvisne od storitve za uporabnike, saj izvaja avtentikacijo zahtev, torej potrebujejo URL storitve za uporabnike.

Primer konfiguracije za storitev za objave:
```env
MONGO_URI=mongodb+srv://username:password@host:port/databaseName?retryWrites=true&w=majority&appName=MyCluster
USER_SERVICE_LOCATION=http://localhost:3000
THREAD_SERVICE_LOCATION=http://localhost:3003
PORT=3001
```

_Opomba: Vrednosti vrat ne rabijo biti enake kot v primeru, morajo pa biti med seboj skladne (če posluša storitev za uporabnike na vratih 3000, morajo ostale storitve imeti nastavljen njen URL na localhost:3000)._

Po konfiguraciji vsako storitev zaženemo z ukazom `npm run start`.

### Storitev threads

Zaradi zahtev študentskega projekta po uporabi različnih ogrodij je storitev za nize ("threads") implementirana v Pythonu z ogrodjem FastAPI.

Najprej se postavimo v direktorij `threads_service` in ustvarimo Python virtualno okolje.
```bash
cd threads_service
python -m venv .venv --prompt threads-service
```

Nato v okolju namestimo potrebne pakete.
```bash
pip install -r requirements.txt
```

Storitev lahko nato poženemo.
```bash
python main.py
```

_Opomba: Storitev lahko zaženemo tudi z ukazom `fastapi dev`, ki omogoča takojšnje osveževanje programa po spremembah v kodi, a ne omogoča poljubne nastavitve vrednosti vrat (kolikor mi je znano),
zato je v tem primeru treba prilagoditi konfiguracijo nekaterih storitev._

### Čelna (frontend) storitev

Podobno kot pri ostalih Node.js storitvah se postavimo v direktorij in namestimo potrebne pakete.
```bash
cd frontend
npm install
```

Konfiguracija okoljskih spremenljivk je nekoliko drugačna zaradi ogrodja Vite. Za razvoj se konfiguracija zapiše v datoteko `.env.development.local`.
Primer konfiguracije se nahaja v datoteki `example.env.development.local`, ter spodaj.

```env
VITE_USER_SERVICE_LOCATION=http://localhost:3000
VITE_THREAD_SERVICE_LOCATION=http://localhost:3003
VITE_POST_SERVICE_LOCATION=http://localhost:3001
VITE_FILE_SERVICE_LOCATION=http://localhost:3002
```

Nato poženemo čelni del v načinu za razvoj.
```bash
npm run dev
```

Do aplikacije dostopamo z naslovom http://localhost:5173.

## Namestitev z Dockerjem

Predpogoj je nameščen Docker Engine in razširitev Docker Compose (oboje je vključeno v namestitev Docker Desktop).

### Podatkovna baza

Mikrostoritve za podatkovno bazo uporabljajo MongoDB. Lahko gostujemo lastni strežnik MongoDB ali uporabimo MongoDB Atlas, oblačnega ponudnika.
V vsakem primeru je potrebno za vsako storitev ustvariti lastno podatkovno bazo na strežniku in pridobiti niz (URL) za povezavo. Primer niza povezave je viden v navodilih za konfiguracijo okolja.

### Konfiguracija okolja

Docker Compose ob zagonu projekta posreduje okoljske spremenljivke iz petih datotek, ene skupne (`.env`) in štirih za posamezne storitve (`files.env`, `users.env`, ...).
Vsaka konfiguracijska datoteka ima primer izgleda v datoteki s predpono example, torej npr. `example.env` in `example.files.env`.

Primer izgleda konfiguracije `users.env`:
```env
MONGO_URI=mongodb+srv://username:password@host:port/databaseName?retryWrites=true&w=majority&appName=MyCluster
JWT_SECRET=verysafesecret
```

Primer izgleda konfiguracije `.env`:
```env
FILE_SERVICE_LOCATION=http://files:3000
USER_SERVICE_LOCATION=http://users:3000
THREAD_SERVICE_LOCATION=http://threads:3000
POST_SERVICE_LOCATION=http://posts:3000
```
_Opomba: Ker so Docker vsebniki združeni v skupno omrežje, jih lahko v tem omrežju naslavljamo z njihovim imenom, kot je definirano v `docker-compose.yml`.
Ker ima vsak vsebnik svoj naslov, znotraj omrežja ni potrebe po različnih vratih, vse storitve lahko tečejo na vratih 3000._

Projekt zaženemo z ukazom:
```bash
docker compose up
```

Do aplikacije dostopamo z naslovom http://localhost:4000.

## Pomoč

Ob morebitnih vprašanjih se obrnite na skrbnika projekta po Discordu. :)
