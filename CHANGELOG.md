# Changelog

Minden említésre méltó változtatás ebben a fájlban lesz rögzítve a Fonomimika projekthez.

## [1.3.2] - 2026-05-26
### Hozzáadva
- **Súgó (Tooltip) Rendszer**: Feloldásra került az oldalsáv alján található eredeti "Súgó" gomb. Rákattintva egy új, elegáns felugró ablak (tooltip) jelenik meg közvetlenül felette, amely az aktuális betű fonomimikai instrukcióit tartalmazza (bezárható x-el vagy háttérkattintással). Az adatokat a külső `hints.json` fájlból tölti be a program.

### Módosítva
- **Helyesírási Frissítés (MTA 12.)**: A JavaScript fájlban lévő galéria adatbázis (`galleryData`) szavai kisbetűsítve lettek (pl. "Alma" -> "alma"), mivel ezek köznevek, és a magyar nyelvtan szabályainak így felelnek meg.

## [1.3.1] - 2026-05-26
### Hozzáadva
- **Avatar Modal Extrák**: Beépítésre került a modálba a bezáró ("X") gomb, valamint a háttérre kattintásos bezárás is aktiválódott. Helyet kapott egy "Nincs" gomb az avatar választó legelején, amellyel a felhasználó eltávolíthatja (visszavonhatja) az aktuális avatart, visszakapva a klasszikus profil ikont.

### Módosítva
- **Pasztell Navigáció**: A kártya lapozógombjai (jobb/bal nyilak) az eddigi nyers fehér/szürke helyett egy harmonikus, pasztell-sárga árnyalatot kaptak, interaktív (hover) élénkebb peremmel.
- **Inaktív Menüpontok**: A "Gyakorlás" és a "Haladás" menüpontok vizuálisan és funkcionálisan is inaktívvá (halvánnyá és kattinthatatlanná) lettek téve a fejlécben, amíg a hozzájuk tartozó fejlesztések el nem készülnek.

## [1.3.0] - 2026-05-25
### Hozzáadva
- **Coverflow Interfész**: A régi, egyszerű betűváltás helyett egy elegáns, Coverflow-stílusú animációs elrendezés (előző és következő halvány betűk beúsztatása).
- **Betűházikó (SVG)**: A kisiskolás módszertanhoz (betűmagasság magyarázatához) igazodva egy vektoros "házikó" (tető, lakótér, pince lépcső) rajzolódott a 4-vonalas kártya hátterébe, amely pixelpontosan illeszkedik a CSS alapvonalakra.
- **Kiejtés Hanglejátszó (Audio)**: A betűkártyán található hangszóró ikonra kattintva a program betölti és lejátssza az adott betű hangját (`.mp3`). Lejátszás alatt a gomb interaktívan, pulzáló animációval jelez vissza. Újbóli kattintásra a hang azonnal újraindul a zavaró hangátfedések elkerülése végett.
- **Avatar Kiválasztó Rendszer (CSS Sprite)**: Bevezetésre került egy tanulói avatar választó, amely induláskor felugrik, ha a diák profiljához még nem tartozik figura. A rendszer egy intelligens JS-generátor által vezérelt CSS Sprite-tal jeleníti meg a 40 avatart (így egyetlen képletöltéssel és nulla villogással működik). A kiválasztott avatar bekerül a fejlécbe és az adatbázisba.
- **PHP Backend Adatmentés (Architektúra váltás)**: A korábbi, böngésző-specifikus `LocalStorage` mentést felváltotta egy robusztus "Felhő" megoldás! Létrejött a `public/api/save_data.php` script, így a kliensoldali JavaScript közvetlenül a szerveren lévő `students.json` fájlt írja felül. Ezáltal a diákok haladása és beállításai platformfüggetlenül (bármilyen eszközről elérve) ugyanazok maradnak.

### Módosítva
- A Tanulási hős-szekció (Layout) átrendezése: az alsó videó teljes szélességet kapott, az interaktív betűkártya (stabil, 2:1 képaránnyal és 15rem széles házikóval) és a mimicry kártya egymás mellé kerültek a felső sorba.
- A kártya `container-type: size` CSS bugjának javítása (amely a betűk eltűnését okozta ablakátméretezéskor) stabil `inline-size` és `cqw` használatával.
- Navigációs (jobb/bal) lapozó nyilak áthelyezése a kártya bal alsó sarkába.
- Többkarakteres betűk (pl. Cs, Dzs) esetén intelligens betűméret-csökkentés a JS-ben, a vizuális összeérés megelőzése érdekében.
- A bal oldali ábécé gombok hivatkozási hibájának (ReferenceError) javítása a `main.js`-ben.
- Teljesítmény-optimalizáció (Early Exit) az ábécé gomboknál: a videó villogásának és felesleges újratöltésének megakadályozása ismételt kattintás esetén.
- Sima, villámgyors tartalomváltás (Cross-fade érzet) bevezetése: betűkattintáskor a UI konténerek fixek maradnak, és kizárólag a képek/szövegek halványulnak el, majd azonnal az új tartalom jelenik meg.
- A Galéria (`renderGallery`) logikájának refaktorálása: nem építi újra a kártyákat minden kattintásnál, csak a meglévő dobozokban lévő tartalmat (kép, szó) frissíti.
- A fő interaktív betűkártya és a Mimicry kártya magasságának szinkronizálása a Grid elrendezésben (a korábbi kötelező `aspect-ratio` kiváltásával mindkét elem megkapta a rugalmas `height: 100%`-ot, így a két kártya alja tökéletesen egy síkba került).
- Vite Build / Útvonal javítás (Bugfix): Az avatar sprite kép hivatkozásának (relatív/abszolút útvonal ütközés a generált CSS-ben) és a szerveroldali PHP API elérésének stabilizálása, lehetővé téve az almappából (`/fono/`) történő hibátlan futtatást.
- Ékezetmentes Webes Fájlnév-kezelés (Bugfix): A Linux szerverek 404-es hibáinak (URL-kódolt fájlnevek nem találása) elkerülése végett egy új `getSafeFileName()` szűrő került beépítésre a JS-be. Mostantól a weblap URL-biztos, ékezetmentes fájlneveken (pl. `o_pontos.mp4`, `e_hosszu.mp3`) kéri le az adott betűkhöz tartozó videó- és hangfájlokat, megszüntetve a speciális karakterek okozta letöltési hibákat.

## [1.2.1] - 2026-05-25
### Módosítva
- Felhasználói felület feliratainak pontosítása: a "Tanulás" menüpont "Tanítás"-ra, a "Játék" menüpont pedig "Gyakorlás"-ra módosult.
- A "Súgó" (Help) gomb átmenetileg elrejtésre került.
- A pontszám és csillaggyűjtést jelző felületek (Mai cél, Progress bar, Csillag gomb) rejtve lettek addig, amíg a "Gyakorlás" funkció implementálása meg nem történik.
- Az alkalmazás betöltésekor az alapértelmezett kezdőbetű "A"-ra lett visszaállítva (korábbi teszt "C" helyett), és a hozzá tartozó videó, valamint galéria is automatikusan az A betűhöz igazodik.

## [1.2.0] - 2026-05-25
### Hozzáadva
- **Bejelentkezési Rendszer**: Teljes képernyős, tejüveg-hatású bejelentkezési ablak (Modal) a fő alkalmazás indításakor. A belépés előtt az alkalmazás opálosan sejlik át a háttérben.
- **Tanulói Adatbázis**: Node.js script segítségével legenerált `students.json` adatbázis (85 diákkal), amely tartalmazza a 2025-2026-os tanév alapadatait.
- **Okoskereső (Autocomplete)**: Dinamikus diák-kereső rendszer, amely ékezetfüggetlenül és a kis/nagybetűkre való tekintet nélkül szűr gépelés közben.
- **Állapotmegőrzés**: Bevezetésre került a `LocalStorage` használata a későbbi tanulási haladás ("Játék" eredmények) nyomon követésére, beépített tanév-ellenőrzéssel (fonomimika_db_v2).

### Módosítva
- A bal oldali menüsáv (Sidebar) mostantól interaktívan frissül a belépést követően: üdvözli a tanulót ("Szia, [Név]!"), és megjeleníti a nevét, osztályát, valamint a kezdőbetűjét a profilképen.

## [1.1.2] - 2026-05-25
### Módosítva
- Élesítési (build) folyamat finomhangolása: a `vite.config.js`-ben bevezetésre került a `base: './'` beállítás, az asset hivatkozások pedig relatívvá lettek alakítva az almappás élesítések (pl. Linux szerveren) támogatására.
- Betűváltáskor (gyors kattintások esetén) jelentkező aszinkron hiba ("Race Condition") javítása a `main.js`-ben: a folyamatban lévő animációs átmenetek (setTimeout) azonnali törlése és a kártya opacitásának alapállapotba helyezése.

## [1.1.1] - 2026-05-24
### Hozzáadva
- Saját webfont (`Untitled2.woff`) támogatása a magyar zsinórírás megjelenítéséhez az írott betűk stílusánál.

### Módosítva
- Interaktív kártya hátterének átalakítása 4-vonalas írólap stílusúra (`linear-gradient` precíz szín- és vastagságbeállítással az első osztályos szabványnak megfelelően).
- A betűk (tipográfiai Baseline) pixelpontos illesztése a kártya vastag kék alapvonalához Flexbox Baseline Alignment (pseudo-element trükk) segítségével.
- A betűméretezés fix pixelértékről `container queries` (cqw) alapú reszponzív skálázásra cserélve, így a betűk magassága pontosan kitölti a vonalközöket (pl. 2 sorközt).
- Az interaktív kártya finomhangolása: a kártya alján lévő pöttyök (indikátorok) animációjának szinkronizálása a 4-fázisú betűváltással; sarki halvány betűk eltávolítása.
- A dinamikus galériában a Dz betűnél szereplő "Dzéta" szót lecseréltük az "Edző" szóra.

## [1.1.0] - 2026-05-24
### Hozzáadva
- Dinamikus galéria kártya renderelés minden magyar betűhöz (min. 3-3 kitalált szó).
- Üres képhelyőrzők (kép nélküli szavakhoz) bevezetése konzisztens elrendezéssel.

### Módosítva
- Szigorú BEM (Block Element Modifier) metodológia bevezetése minden HTML/CSS komponensen.
- Az utolsó Tailwind-maradvány utility osztályok (pl. `.text-primary`, `.font-headline-md`) eltávolítva és BEM struktúrába integrálva.
- Kártya `margin` és `line-height` vizuális problémák javítása a `.gallery__word-title` osztályon.
- `main.js` eseménykezelők refaktorálása az új BEM osztálynevek használatára.

## [1.0.0] - 2026-05-23
### Hozzáadva
- Teljes magyar ábécé listája (A-tól Zs-ig) felkerült a tanulási felület oldalsávjába.
- `main.js` fájl létrehozva a dinamikus interakciók (betűváltó logika, gomb animációk) szétválasztásához.
- `style.css` fájl létrehozva natív CSS változókkal (`:root`) a projekt dizájnrendszerének kezelésére.
- Alap Vite konfiguráció (`package.json`, `vite.config.js`) beállítva a 3000-es fejlesztői port használatával.

### Módosítva
- A meglévő Tailwind CSS alapú dizájn sikeresen átalakítva hagyományos HTML/CSS/JS webalkalmazássá.
- Az `index.html` megtisztítása a Tailwind osztályoktól, helyettük szemantikus és logikus osztálynevek bevezetése (BEM-szerű struktúra).
