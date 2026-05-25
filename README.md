# Fonomimika Tanoda

A Fonomimika tanoda egy gyermekeknek (általános iskola alsó tagozata) szánt edukációs webalkalmazás, amely játékosan, fonomimikai (hangokhoz rendelt kézmozdulatok) módszerekkel segíti a betűtanulást. A felület barátságos, könnyen kezelhető és teljes mértékben reszponzív.

## Technológiai Stack

A projekt egy letisztult, keretrendszerektől mentes Vite környezetre (Vanilla HTML, CSS, JavaScript) épül. A stíluslapok kialakítása a klasszikus webfejlesztési elveket követi, natív CSS változókkal és szigorú BEM (Block Element Modifier) metodológia szerint elnevezett komponensekkel felépítve (Tailwind CSS használata nélkül).

## Főbb funkciók
- **Interaktív betűtanulás**: A betűk megjelenítése kis- és nagybetűs, illetve írott és nyomtatott formában is.
- **Vizuális segédletek**: Hangokhoz rendelt fonomimikai mozdulatokat ábrázoló képek, valamint egyénileg vezérelhető videós kiegészítések.
- **A teljes magyar ábécé**: Könnyen navigálható lista a magyar nyelv összes betűjével (A-tól Zs-ig).
- **Dinamikus Szógaléria**: Minden kiválasztott betűhöz azonnal betöltődnek az adott betűvel kezdődő/tartalmazó szavak és a hozzájuk tartozó illusztrációk.

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
