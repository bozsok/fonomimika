# Fonomimika tanoda

A Fonomimika tanoda egy gyermekeknek (általános iskola alsó tagozata) szánt edukációs webalkalmazás, amely játékosan, fonomimikai (hangokhoz rendelt kézmozdulatok) módszerekkel segíti a betűtanulást. A felület barátságos, könnyen kezelhető és teljes mértékben reszponzív.

## Technológiai Stack

A projekt egy letisztult, keretrendszerektől mentes Vite környezetre (Vanilla HTML, CSS, JavaScript) épül. A stíluslapok kialakítása a klasszikus webfejlesztési elveket követi, natív CSS változókkal és szigorú BEM (Block Element Modifier) metodológia szerint elnevezett komponensekkel felépítve (Tailwind CSS használata nélkül). A fejlesztői környezet konfigurációja (`vite.config.js`) lokális proxybeállításokkal is rendelkezik a zökkenőmentes adatintegráció érdekében.

## Főbb funkciók
- **Személyre szabott tanulói profilok**: Interaktív bejelentkezési modál és avatarkiválasztó rendszer, amely barátságos, személyes élményt nyújt a gyermekek számára a saját nevükkel és osztályukkal.
- **Oktatói adminisztráció és haladáskövetés**: Jelszóval védett pedagógusi belépő rendszer a felső fejlécben, tooltip stílusú felugró ablakkal. Belépés után elérhetővé válik a dedikált „Haladás” nézet, ahol a bal oldalsávban a tanulók névsora és keresője, a jobb oldalon pedig a kiválasztott diák 44 betűs magyar ábécéje jelenik meg. A pedagógusok egyszerű kattintással rögzíthetik a megtanult betűket, amelyek valós időben mentésre kerülnek a szerverre, a bejelentkezett gyermekek pedig azonnali, motiváló kék vizuális visszajelzést kapnak a haladásukról a főképernyő betűszalagján.
- **Interaktív betűtanulás saját betűkészlettel**: A betűk megjelenítése kis- és nagybetűs, illetve írott és nyomtatott formában. A program mögött egy egyedi, saját fejlesztésű **FonomimikaScript** betűkészlet (FontForge GSUB) dolgozik, amely pedagógiailag hiteles 2:1 méretarányban támogatja a többjegyű magyar betűk (pl. Cs, Dzs) és az írott ligatúrák hibátlan megjelenítését.
- **Vizuális segédletek és intelligens súgó**: Hangokhoz rendelt fonomimikai mozdulatokat ábrázoló dinamikus fotók és videók. A felhasználót egy adatalapú, interaktív Súgó (tooltip) és egy intelligens hívószó-kinyerő algoritmus (Regex) segíti a mozdulatok elsajátításában.
- **A teljes magyar ábécé**: Könnyen navigálható, animált lista a magyar nyelv összes betűjével (A-tól Zs-ig).
- **Különválasztott Tanítás és Gyakorlás modulok**: A felső navigációs menü segítségével a tanulási folyamat két világos fázisra oszlik: az interaktív betűmegismerésre (3D kártya, kézmozdulat, videó) és az önálló hangfelismerési gyakorlásra.
- **Dinamikus Szógaléria**: A Gyakorlás menüpont alatt minden kiválasztott betűhöz azonnal betöltődnek a tematikus szavak (a hanggal kezdődő, azt tartalmazó vagy arra végződő felépítésben) és a hozzájuk tartozó illusztrációk a különálló `gallery.json` adatbázisból.

## Telepítés és Futtatás

1. Nyisd meg a terminált a projekt mappájában:
   ```bash
   cd Fonomimika
   ```

2. Telepítsd a szükséges csomagokat:
   ```bash
   npm install
   ```

3. Indítsd el a fejlesztői szervert:
   ```bash
   npm run dev
   ```

4. Nyisd meg a webalkalmazást:
   A szerver alapértelmezetten a **3000-es porton** indul. A böngésződben nyisd meg a [http://localhost:3000](http://localhost:3000) címet.

## Projekt Buildelése (Gyártása)

Az alkalmazásból két különböző változatot lehet építeni az éles szerverre való feltöltéshez:

* **Valódi iskolai verzió buildelése:**
  ```bash
  npm run build
  ```
  Ez a `dist` mappába helyezi a fájlokat, beleértve a valódi diákok listáját és a szerveroldali mentést végző PHP kódot.

* **Nyilvános demó verzió buildelése:**
  ```bash
  npm run build:demo
  ```
  Ez a `dist/demo` mappába építi fel az adminisztráció nélküli, kizárólag a „Példa Tanuló” adatbázisát tartalmazó, kliensoldali mentéssel ellátott verziót.

* **Mindkét verzió együttes buildelése:**
  ```bash
  npm run build:all
  ```
  Ez egymás után legenerálja mind a valódi éles verziót a `dist` mappába, mind a demó verziót a `dist/demo` mappába.
