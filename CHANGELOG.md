# Changelog

Minden említésre méltó változtatás ebben a fájlban lesz rögzítve a Fonomimika projekthez.
## [1.3.4] - 2026-05-28
### Hozzáadva
- **Írott kisbetűk bevezetése**: A frissen elkészített, saját tervezésű írott kisbetűk bekerültek a stílusrendszerbe. A CSS-ben létrehozott `#face-3` azonosítóval immár teljesen külön és szabadon paraméterezhető a kisbetűk méretezése (55cqw) és precíz alapvonalra illesztése.
- **Dinamikus mimicryképek**: A program mostantól a kiválasztott betűhöz tartozó egyedi fonomimikai fotókat (`assets/pics/betuk/`) is betölti. A betöltés a korábban bevezetett `getSafeFileName()` szűrőn keresztül történik, így garantálva az URL-biztos, ékezetmentes hivatkozást.
- **Vektoros képhelyőrző (fallback)**: Amennyiben egy betűhöz még nem tartozik feltöltött kép a szerveren (404-es hiba), a rendszer egy elegáns, beépített SVG-helyőrzővel (placeholderrel) helyettesíti azt, megelőzve az üres vagy hibásan betöltődő kártyák megjelenését.

### Módosítva
- **Coverflow-fókusz optimalizálása**: A szomszédos, éppen inaktív kártyák átlátszósága jelentősen csökkentve lett (opacity 0.3-ról 0.1-re). Ez a vizuális finomhangolás felerősíti az aktív, középső kártya kiemelését és eltünteti a zavaró perifériás képeket lapozás közben.
- **Mimicry-kártya hover-animációja**: A `style.css`-ben fellépő "cascading" felülírási hiba javítása (ahol a globális opacitás-animáció megakadályozta a transform-animációt). A kártya nagyítása sima, 0.3 másodperces átmenetet kapott, a nagyítás mértékét pedig 105%-ról 110%-ra növeltük a látványosabb interakció érdekében.


## [1.3.3] - 2026-05-27
### Hozzáadva
- **Fejlesztői környezet (Vite Proxy)**: Beépítésre került a `vite.config.js` fájlba egy proxybeállítás, amely a fejlesztői kéréseket (API és adatok) a helyi környezetből átirányítja az éles szerverre. Ezzel feleslegessé vált a folyamatos buildelés és feltöltés, lehetővé téve a zavartalan localhostos fejlesztést és mentést.
- **Ligatúrák biztosítása**: CSS-szintű kényszerítés (`font-variant-ligatures: common-ligatures;`) került bevezetésre az írott nagybetűknél a többjegyű magyar betűk (pl. Cs, Dzs) megbízható, egybekapcsolt megjelenítése érdekében.

### Módosítva
- **Nyomtatott betűk optikai kiegyenlítése**: A többjegyű nyomtatott betűknél (pl. Cs) a nagy- és kisbetű programozottan külön `span`-be lett választva, biztosítva a pedagógiai 2:1 méretarányt (nagybetű 2 sor, kisbetű 1 sor). A `Plus Jakarta Sans` betűkészlet kiegészült a 300-as és 600-as súlyokkal (Google Fonts), amellyel az eltérő méretek miatti vonalvastagság-különbséget (stroke) sikeresen kompenzáltuk.
- **Nyelvtanilag helyes kártyamegjelenítés**: A JavaScript `toUpperCase()` okozta hiba javítása, így a többjegyű nyomtatott betűk (pl. Cs, Dzs) immár a helyes magyar formátumban jelennek meg, miközben a FontForge (GSUB) számára megmaradt a tiszta adatfolyam a ligatúrákhoz.
- **Írott betűk méretezése és alapvonala**: Az újonnan bekerült írott nagybetűk (`#face-2`) CSS-ből történő pontos méretezése (56cqw) és alapvonalra illesztése. A kártyákon látható kék alapvonalhoz való tökéletes igazítást a `::before` pszeudo-elem magasságának 85%-ra növelésével értük el.
- **Saját betűkészlet (FonomimikaScript) frissítése**: A többjegyű magyar betűk ligatúráinak OpenType-logikája (GSUB) egyetlen közös táblázatba lett szervezve a FontForge-ban, elkerülve a lefedettségi ütközést (Coverage Overlap), és javításra kerültek az önmetsző (self-intersecting) vektorok.

## [1.3.2] - 2026-05-26
### Hozzáadva
- **Súgó (tooltip) rendszer**: Feloldásra került az oldalsáv alján található eredeti "Súgó" gomb. Rákattintva egy új, elegáns felugró ablak (tooltip) jelenik meg közvetlenül felette, amely az aktuális betű fonomimikai instrukcióit tartalmazza (bezárható x-szel vagy a háttérre kattintva). Az adatokat a külső `hints.json` fájlból tölti be a program.

### Módosítva
- **Helyesírási frissítés (MTA 12. kiadása)**: A JavaScript fájlban lévő galériaadatbázis (`galleryData`) szavai kisbetűsítve lettek (pl. "Alma" -> "alma"), mivel ezek köznevek, és a magyar nyelvtan szabályainak így felelnek meg.

## [1.3.1] - 2026-05-26
### Hozzáadva
- **Avatarmodál extrái**: Beépítésre került a modálba a bezáró ("X") gomb, valamint a háttérre kattintásos bezárás is aktiválódott. Helyet kapott egy "Nincs" gomb az avatarválasztó legelején, amellyel a felhasználó eltávolíthatja (visszavonhatja) az aktuális avatart, visszakapva a klasszikus profil ikont.

### Módosítva
- **Pasztell navigáció**: A kártya lapozógombjai (jobb/bal nyilak) az eddigi nyers fehér/szürke helyett egy harmonikus, pasztellsárga árnyalatot kaptak, interaktív (hover) élénkebb peremmel.
- **Inaktív menüpontok**: A "Gyakorlás" és a "Haladás" menüpontok vizuálisan és funkcionálisan is inaktívvá (halvánnyá és kattinthatatlanná) lettek téve a fejlécben, amíg a hozzájuk tartozó fejlesztések el nem készülnek.

## [1.3.0] - 2026-05-25
### Hozzáadva
- **Coverflow-interfész**: A régi, egyszerű betűváltás helyett egy elegáns, Coverflow-stílusú animációs elrendezés (előző és következő halvány betűk beúsztatása).
- **Betűházikó (SVG)**: A kisiskolás módszertanhoz (a betűmagasság magyarázatához) igazodva egy vektoros "házikó" (tető, lakótér, pincelépcső) rajzolódott a négyvonalas kártya hátterébe, amely pixelpontosan illeszkedik a CSS-alapvonalakra.
- **Kiejtés-hanglejátszó (audio)**: A betűkártyán található hangszóró ikonra kattintva a program betölti és lejátssza az adott betű hangját (`.mp3`). Lejátszás alatt a gomb interaktívan, pulzáló animációval jelez vissza. Újbóli kattintásra a hang azonnal újraindul a zavaró hangátfedések elkerülése végett.
- **Avatarválasztó rendszer (CSS Sprite)**: Bevezetésre került egy tanulói avatarválasztó, amely induláskor felugrik, ha a diák profiljához még nem tartozik figura. A rendszer egy intelligens JS-generátor által vezérelt CSS Sprite-tal jeleníti meg a 40 avatart (így egyetlen képletöltéssel és nulla villogással működik). A kiválasztott avatar bekerül a fejlécbe és az adatbázisba.
- **PHP Backend Adatmentés (Architektúra váltás)**: A korábbi, böngésző-specifikus `LocalStorage` mentést felváltotta egy robusztus "Felhő" megoldás! Létrejött a `public/api/save_data.php` script, így a kliensoldali JavaScript közvetlenül a szerveren lévő `students.json` fájlt írja felül. Ezáltal a diákok haladása és beállításai platformfüggetlenül (bármilyen eszközről elérve) ugyanazok maradnak.

### Módosítva
- A tanulási hősszekció (layout) átrendezése: az alsó videó teljes szélességet kapott, az interaktív betűkártya (stabil, 2:1 képaránnyal és 15rem széles házikóval) és a Mimicry-kártya egymás mellé kerültek a felső sorba.
- A kártya `container-type: size` CSS-bugjának javítása (amely a betűk eltűnését okozta ablakátméretezéskor) stabil `inline-size` és `cqw` használatával.
- Navigációs (jobb/bal) lapozónyílak áthelyezése a kártya bal alsó sarkába.
- Többkarakteres betűk (pl. Cs, Dzs) esetén intelligens betűméret-csökkentés a JS-ben, a vizuális összeérés megelőzése érdekében.
- A bal oldali ábécégombok hivatkozási hibájának (ReferenceError) javítása a `main.js`-ben.
- Teljesítményoptimalizálás (early exit) az ábécégomboknál: a videó villogásának és felesleges újratöltésének megakadályozása ismételt kattintás esetén.
- Sima, villámgyors tartalomváltás (cross-fade érzet) bevezetése: betűkattintáskor a UI-konténerek fixek maradnak, és kizárólag a képek/szövegek halványulnak el, majd azonnal az új tartalom jelenik meg.
- A galéria (`renderGallery`) logikájának refaktorálása: nem építi újra a kártyákat minden kattintásnál, csak a meglévő dobozokban lévő tartalmat (kép, szó) frissíti.
- A fő interaktív betűkártya és a Mimicry-kártya magasságának szinkronizálása a Grid elrendezésben (a korábbi kötelező `aspect-ratio` kiváltásával mindkét elem megkapta a rugalmas `height: 100%`-ot, így a két kártya alja tökéletesen egy síkba került).
- Vite-build / útvonaljavítás (bugfix): Az avatarsprite-kép hivatkozásának (relatív/abszolút útvonal ütközés a generált CSS-ben) és a szerveroldali PHP-API elérésének stabilizálása, lehetővé téve az almappából (`/fono/`) történő hibátlan futtatást.
- Ékezetmentes webes fájlnévkezelés (bugfix): A Linux-szerverek 404-es hibáinak (URL-kódolt fájlnevek nem találása) elkerülése végett egy új `getSafeFileName()` szűrő került beépítésre a JS-be. Mostantól a weblap URL-biztos, ékezetmentes fájlnevekkel (pl. `o_pontos.mp4`, `e_hosszu.mp3`) kéri le az adott betűkhöz tartozó videó- és hangfájlokat, megszüntetve a speciális karakterek okozta letöltési hibákat.

## [1.2.1] - 2026-05-25
### Módosítva
- A felhasználói felület feliratainak pontosítása: a "Tanulás" menüpont "Tanítás"-ra, a "Játék" menüpont pedig "Gyakorlás"-ra módosult.
- A "Súgó" (Help) gomb átmenetileg elrejtésre került.
- A pontszám- és csillaggyűjtést jelző felületek (Mai cél, Progress bar, Csillag gomb) rejtve lettek addig, amíg a "Gyakorlás" funkció implementálása meg nem történik.
- Az alkalmazás betöltésekor az alapértelmezett kezdőbetű "A"-ra lett visszaállítva (korábbi teszt "C" helyett), és a hozzá tartozó videó, valamint galéria is automatikusan az A betűhöz igazodik.

## [1.2.0] - 2026-05-25
### Hozzáadva
- **Bejelentkezési rendszer**: Teljes képernyős, tejüveghatású bejelentkezési ablak (modál) a fő alkalmazás indításakor. A belépés előtt az alkalmazás opálosan sejlik át a háttérben.
- **Tanulói adatbázis**: Node.js script segítségével legenerált `students.json` adatbázis (85 diákkal), amely tartalmazza a 2025-2026-os tanév alapadatait.
- **Okoskereső (autocomplete)**: Dinamikus diákkereső rendszer, amely ékezetfüggetlenül és a kis-/nagybetűkre való tekintet nélkül szűr gépelés közben.
- **Állapotmegőrzés**: Bevezetésre került a `LocalStorage` használata a későbbi tanulási haladás ("Játék"-eredmények) nyomon követésére, beépített tanév-ellenőrzéssel (fonomimika_db_v2).

### Módosítva
- A bal oldali menüsáv (Sidebar) mostantól interaktívan frissül a belépést követően: üdvözli a tanulót ("Szia, [Név]!"), és megjeleníti a nevét, osztályát, valamint a kezdőbetűjét a profilképen.

## [1.1.2] - 2026-05-25
### Módosítva
- Élesítési (build-) folyamat finomhangolása: a `vite.config.js`-ben bevezetésre került a `base: './'` beállítás, az assethivatkozások pedig relatívvá lettek alakítva az almappás élesítések (pl. Linux-szerveren) támogatására.
- Betűváltáskor (gyors kattintások esetén) jelentkező aszinkron hiba ("race condition") javítása a `main.js`-ben: a folyamatban lévő animációs átmenetek (setTimeout) azonnali törlése és a kártya opacitásának alapállapotba helyezése.

## [1.1.1] - 2026-05-24
### Hozzáadva
- Saját webfont (`Untitled2.woff`) támogatása a magyar zsinórírás megjelenítéséhez az írott betűk stílusánál.

### Módosítva
- Interaktív kártya hátterének átalakítása négyvonalas írólap stílusúra (`linear-gradient` precíz szín- és vastagságbeállítással az első osztályos szabványnak megfelelően).
- A betűk (tipográfiai baseline) pixelpontos illesztése a kártya vastag kék alapvonalához Flexbox Baseline Alignment (pszeudoelem-trükk) segítségével.
- A betűméretezés fix pixelértékről container queries (cqw) alapú reszponzív skálázásra cserélve, így a betűk magassága pontosan kitölti a vonalközöket (pl. 2 sorközt).
- Az interaktív kártya finomhangolása: a kártya alján lévő pöttyök (indikátorok) animációjának szinkronizálása a 4-fázisú betűváltással; sarki halvány betűk eltávolítása.
- A dinamikus galériában a Dz betűnél szereplő "Dzéta" szót lecseréltük az "Edző" szóra.

## [1.1.0] - 2026-05-24
### Hozzáadva
- Dinamikus galériakártya-renderelés minden magyar betűhöz (min. 3-3 kitalált szó).
- Üres képhelyőrzők (kép nélküli szavakhoz) bevezetése konzisztens elrendezéssel.

### Módosítva
- Szigorú BEM-metodológia (Block Element Modifier) bevezetése minden HTML/CSS komponensen.
- Az utolsó Tailwind-maradvány utility osztályok (pl. `.text-primary`, `.font-headline-md`) eltávolítva és BEM-struktúrába integrálva.
- Kártya `margin`- és `line-height`-problémáinak javítása a `.gallery__word-title` osztályon.
- `main.js`-eseménykezelők refaktorálása az új BEM-osztálynevek használatára.

## [1.0.0] - 2026-05-23
### Hozzáadva
- A teljes magyar ábécé listája (A-tól Zs-ig) felkerült a tanulási felület oldalsávjába.
- `main.js` fájl létrehozva a dinamikus interakciók (betűváltó logika, gombanimációk) szétválasztásához.
- `style.css` fájl létrehozva natív CSS-változókkal (`:root`) a projekt dizájnrendszerének kezelésére.
- Alap Vite-konfiguráció (`package.json`, `vite.config.js`) beállítva a 3000-es fejlesztői port használatával.

### Módosítva
- A meglévő Tailwind CSS-alapú dizájn sikeresen átalakítva hagyományos HTML/CSS/JS webalkalmazássá.
- Az `index.html` megtisztítása a Tailwind-osztályoktól, helyettük szemantikus és logikus osztálynevek bevezetése (BEM-szerű struktúra).
