# Changelog

Minden említésre méltó változtatás ebben a fájlban lesz rögzítve a Fonomimika projekthez.

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
