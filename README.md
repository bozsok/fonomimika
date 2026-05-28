# Fonomimika tanoda

A Fonomimika tanoda egy gyermekeknek (általános iskola alsó tagozata) szánt edukációs webalkalmazás, amely játékosan, fonomimikai (hangokhoz rendelt kézmozdulatok) módszerekkel segíti a betűtanulást. A felület barátságos, könnyen kezelhető és teljes mértékben reszponzív.

## Technológiai Stack

A projekt egy letisztult, keretrendszerektől mentes Vite környezetre (Vanilla HTML, CSS, JavaScript) épül. A stíluslapok kialakítása a klasszikus webfejlesztési elveket követi, natív CSS változókkal és szigorú BEM (Block Element Modifier) metodológia szerint elnevezett komponensekkel felépítve (Tailwind CSS használata nélkül). A fejlesztői környezet konfigurációja (`vite.config.js`) lokális proxybeállításokkal is rendelkezik a zökkenőmentes adatintegráció érdekében.

## Főbb funkciók
- **Személyre szabott tanulói profilok**: Interaktív bejelentkezési modál és avatarkiválasztó rendszer, amely barátságos, személyes élményt nyújt a gyermekek számára a saját nevükkel és osztályukkal.
- **Interaktív betűtanulás saját betűkészlettel**: A betűk megjelenítése kis- és nagybetűs, illetve írott és nyomtatott formában. A program mögött egy egyedi, saját fejlesztésű **FonomimikaScript** betűkészlet (FontForge GSUB) dolgozik, amely pedagógiailag hiteles 2:1 méretarányban támogatja a többjegyű magyar betűk (pl. Cs, Dzs) és az írott ligatúrák hibátlan megjelenítését.
- **Vizuális segédletek és intelligens súgó**: Hangokhoz rendelt fonomimikai mozdulatokat ábrázoló dinamikus fotók és videók. A felhasználót egy adatalapú, interaktív Súgó (tooltip) és egy intelligens hívószó-kinyerő algoritmus (Regex) segíti a mozdulatok elsajátításában.
- **A teljes magyar ábécé**: Könnyen navigálható, animált lista a magyar nyelv összes betűjével (A-tól Zs-ig).
- **Dinamikus Szógaléria**: Minden kiválasztott betűhöz azonnal betöltődnek az adott betűvel kezdődő, vagy azt tartalmazó szavak és a hozzájuk tartozó színes illusztrációk.

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
