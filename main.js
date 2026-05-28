// Interactive Letter Switcher
let studentDB = null;
let currentStudent = null;
let hintsDB = {};

async function initHints() {
    try {
        const response = await fetch('data/hints.json');
        hintsDB = await response.json();
    } catch (e) {
        console.error('Hiba a súgó fájl betöltésekor:', e);
    }
}

async function initDatabase() {
    try {
        // Fetch a friss students.json a szerverről
        const response = await fetch('data/students.json');
        studentDB = await response.json();

        console.log('Adatbázis inicializálva a szerverről.');
        initLoginUI();
    } catch (e) {
        console.error('Hiba az adatbázis betöltésekor:', e);
    }
}

// PHP API Mentés Függvény (Async)
async function saveToDatabase() {
    if (!studentDB) return;

    try {
        const response = await fetch('api/save_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentDB)
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Sikeres mentés a szerverre!', result);
        } else {
            console.error('Szerver hiba mentéskor:', result.error);
        }
    } catch (e) {
        console.error('Hálózati hiba a mentés során:', e);
    }
}

function normalizeStr(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getSafeFileName(letter) {
    const map = {
        'á': 'a_hosszu',
        'é': 'e_hosszu',
        'í': 'i_hosszu',
        'ó': 'o_hosszu',
        'ö': 'o_pontos',
        'ő': 'o_dupla',
        'ú': 'u_hosszu',
        'ü': 'u_pontos',
        'ű': 'u_dupla'
    };
    const l = letter.toLowerCase();
    return map[l] || l;
}

function getMimicryText(letter) {
    if (!hintsDB) return 'a fonomimikai mozdulat';
    const lowerL = letter.toLowerCase();

    // Egyedi felülírások (speciális betűk)
    const overrides = {
        'q': 'fordított p betű',
        'w': 'w betű alakja',
        'x': 'x betű alakja',
        'y': 'y betű alakja',
        'gy': 'lovaskocsin gyeplőhúzás',
        'j': 'kurjantás',
        'ty': 'álló traktor motorhangja'
    };
    if (overrides[lowerL]) {
        return overrides[lowerL];
    }

    const hintText = hintsDB[lowerL];
    if (!hintText) return 'a fonomimikai mozdulat';

    const firstSentence = hintText.split('\n')[0];

    // Kinyerjük a hívószót a névelők eltávolításával.
    // Nem vágunk vesszőnél, hogy a halmozott jelzők (pl. "éhes, korgó pocakú medve") megmaradjanak,
    // csak az "aki", "mely" tagmondatoknál, vagy a mondat végén (pont).
    const match = firstSentence.match(/hívó(?:szavunk|képünk)\s+(?:az\s+|a\s+|egy\s+)?(.*?)(?:\s*,?\s*aki|\s*,?\s*mely|\.|$)/i);

    if (match && match[1]) {
        let text = match[1].trim();
        return text.toLowerCase(); // Minden kisbetűs, idézőjel nélkül
    }

    return 'a fonomimikai mozdulat';
}

function initLoginUI() {
    const loginModal = document.getElementById('login-modal');
    const appContent = document.getElementById('app-content');
    const searchInput = document.getElementById('student-search');
    const autocompleteList = document.getElementById('autocomplete-list');
    const loginBtn = document.getElementById('login-btn');
    const sidebarUserInfo = document.getElementById('sidebar-user-info');

    let selectedStudent = null;

    searchInput.addEventListener('input', (e) => {
        const val = normalizeStr(e.target.value);
        autocompleteList.innerHTML = '';
        selectedStudent = null;
        loginBtn.disabled = true;

        if (!val) {
            autocompleteList.style.display = 'none';
            return;
        }

        // Bolondbiztos szűrés: ha a DB még null, vagy nincs students, ne csináljon semmit
        const studentList = studentDB?.students || [];
        const matches = studentList.filter(s => typeof s.name === 'string' && normalizeStr(s.name).includes(val));

        if (matches.length > 0) {
            autocompleteList.style.display = 'block';
            matches.forEach(student => {
                const item = document.createElement('div');
                item.className = 'autocomplete-list__item';
                item.innerHTML = `<div class="autocomplete-list__item-name">${student.name}</div><div class="autocomplete-list__item-class">${student.class}</div>`;

                item.addEventListener('click', () => {
                    searchInput.value = student.name;
                    selectedStudent = student;
                    autocompleteList.style.display = 'none';
                    loginBtn.disabled = false;
                });
                autocompleteList.appendChild(item);
            });
        } else {
            autocompleteList.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target !== searchInput) {
            autocompleteList.style.display = 'none';
        }
    });

    loginBtn.addEventListener('click', () => {
        if (selectedStudent) {
            currentStudent = selectedStudent;

            // Re-read avatarId from JSON fallback if needed
            const dbIndex = studentDB?.students?.findIndex(s => s.name === currentStudent.name);
            if (dbIndex !== -1 && studentDB.students[dbIndex].avatarId !== undefined) {
                currentStudent.avatarId = studentDB.students[dbIndex].avatarId;
            }

            loginModal.style.display = 'none';

            // Frissítjük a neveket
            const sidebarUserInfo = document.getElementById('sidebar-user-info');
            const avatarLetter = currentStudent.name.charAt(0).toUpperCase();
            sidebarUserInfo.innerHTML = `
                <div class="app-sidebar__avatar">${avatarLetter}</div>
                <div>
                    <p class="app-sidebar__user-name">Szia, ${currentStudent.name}!</p>
                    <p style="font-size: 0.85rem; color: var(--color-on-surface-variant); margin: 0;">${currentStudent.class}</p>
                </div>
            `;

            if (typeof currentStudent.avatarId === 'undefined' || currentStudent.avatarId === null) {
                // Nincs avatar, nyissuk meg a választót!
                document.getElementById('avatar-modal').style.display = 'flex';
            } else {
                // Van avatar, mehetünk a főképernyőre
                updateUserAvatarUI();
                appContent.style.display = 'block';
            }
        }
    });
}
// --- Avatar Generátor és Logika ---
function generateAvatarSpriteStyles() {
    const config = {
        totalAvatars: 40, cols: 8, rows: 5,
        imageW: 982, imageH: 614,
        offsetX: 20, offsetY: 20, // Kicsit megnövelve a margót
        boxSize: 80, smallBoxSize: 40
    };

    const cellW = (config.imageW - (2 * config.offsetX)) / config.cols;
    const cellH = (config.imageH - (2 * config.offsetY)) / config.rows;
    const scale = config.boxSize / cellW;
    const smallScale = config.smallBoxSize / cellW;

    let styleCSS = `
    .avatar-sprite { background-image: url('assets/pics/avatars.png'); background-size: ${config.imageW * scale}px ${config.imageH * scale}px; }
    .avatar-sprite-sm { background-image: url('assets/pics/avatars.png'); background-size: ${config.imageW * smallScale}px ${config.imageH * smallScale}px; background-repeat: no-repeat; width: ${config.smallBoxSize}px; height: ${config.smallBoxSize}px; border-radius: 50%; display: inline-block; background-color: #fff; }
    `;

    for (let i = 0; i < config.totalAvatars; i++) {
        const col = i % config.cols;
        const row = Math.floor(i / config.cols);

        const posX = -((config.offsetX + col * cellW) * scale);
        const posY = -((config.offsetY + row * cellH) * scale);
        styleCSS += `.avatar-${i} { background-position: ${posX}px ${posY}px; }\n`;

        const posSmallX = -((config.offsetX + col * cellW) * smallScale);
        const posSmallY = -((config.offsetY + row * cellH) * smallScale);
        styleCSS += `.avatar-sm-${i} { background-position: ${posSmallX}px ${posSmallY}px; }\n`;
    }

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styleCSS;
    document.head.appendChild(styleEl);
}

function initAvatarModal() {
    generateAvatarSpriteStyles();
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // A "Nincs" gomb (törlés)
    const noneBtn = document.createElement('div');
    noneBtn.className = 'avatar-option';
    noneBtn.style.display = 'flex';
    noneBtn.style.alignItems = 'center';
    noneBtn.style.justifyContent = 'center';
    noneBtn.style.backgroundColor = 'var(--color-surface-variant)';
    noneBtn.style.color = 'var(--color-on-surface-variant)';
    noneBtn.style.fontWeight = 'bold';
    noneBtn.style.fontSize = '1.2rem';
    noneBtn.innerText = 'Nincs';
    noneBtn.addEventListener('click', () => {
        saveAvatar(null);
    });
    grid.appendChild(noneBtn);

    for (let i = 0; i < 40; i++) {
        const btn = document.createElement('div');
        btn.className = `avatar-option avatar-sprite avatar-${i}`;
        btn.dataset.avatarId = i;
        btn.addEventListener('click', () => {
            saveAvatar(i);
        });
        grid.appendChild(btn);
    }

    const headerAvatarBtn = document.querySelectorAll('.app-header__btn')[0];
    if (headerAvatarBtn) {
        headerAvatarBtn.addEventListener('click', () => {
            if (currentStudent) {
                document.getElementById('avatar-modal').style.display = 'flex';
            }
        });
    }

    const avatarModal = document.getElementById('avatar-modal');
    const closeBtn = document.getElementById('close-avatar-modal');

    // Bezáró X gomb
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            avatarModal.style.display = 'none';
            document.getElementById('app-content').style.display = 'block';
        });
    }

    // Bezárás kattintásra a modal hátterén (kívül a kártyán)
    if (avatarModal) {
        avatarModal.addEventListener('click', (e) => {
            if (e.target === avatarModal) {
                avatarModal.style.display = 'none';
                document.getElementById('app-content').style.display = 'block';
            }
        });
    }
}

function saveAvatar(avatarId) {
    if (!currentStudent) return;

    currentStudent.avatarId = avatarId;
    const dbIndex = studentDB.students.findIndex(s => s.name === currentStudent.name);
    if (dbIndex !== -1) {
        studentDB.students[dbIndex].avatarId = avatarId;
        // Mentés a PHP backendre a LocalStorage helyett
        saveToDatabase();
    }

    document.getElementById('avatar-modal').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';

    updateUserAvatarUI();
}

function updateUserAvatarUI() {
    if (!currentStudent) return;

    let aId = currentStudent.avatarId;
    const headerAvatarBtn = document.querySelectorAll('.app-header__btn')[0];

    // Csak a header ikont frissítjük az avatárral (a sidebar megmarad a kezdőbetűnek, ahogy a belépés beállítja)
    if (typeof aId !== 'undefined' && aId !== null) {
        const smallSpriteClass = `avatar-sprite-sm avatar-sm-${aId}`;

        if (headerAvatarBtn) {
            headerAvatarBtn.classList.remove('material-symbols-outlined');
            headerAvatarBtn.innerHTML = `<div class="${smallSpriteClass}"></div>`;
            headerAvatarBtn.style.padding = '0';
        }
    } else {
        // Alapértelmezett visszaállítása, ha "Nincs" lett kiválasztva
        if (headerAvatarBtn) {
            headerAvatarBtn.classList.add('material-symbols-outlined');
            headerAvatarBtn.innerHTML = `account_circle`;
            headerAvatarBtn.style.padding = '';
        }
    }
}

// Indítás
initDatabase();
initHints().then(() => {
    // Alapértelmezett betű mimicry szövegének beállítása induláskor
    const mimicryTextEl = document.querySelector('.mimicry-card__text');
    if (mimicryTextEl) {
        mimicryTextEl.textContent = getMimicryText('a');
    }
});
initAvatarModal();
const coverflowEl = document.getElementById('letter-coverflow');

if (coverflowEl) {
    let currentLetter = 'A';
    let activeIndex = 0; // 0: front, 1: right, 2: back, 3: left

    function updateCoverflowFaces(letter) {
        const face0 = document.getElementById('face-0');
        const face1 = document.getElementById('face-1');
        const face2 = document.getElementById('face-2');
        const face3 = document.getElementById('face-3');

        if (face0 && face1 && face2 && face3) {
            // Konzisztens, nyelvtanilag helyes adatok minden kártyaoldalon (Pl. 'Cs', 'Dzs')
            // Nyomtatott kártya: Ha többjegyű betű (pl. Cs), akkor az 's'-t külön span-be tesszük,
            // hogy függetlenül lehessen méretezni (1 sor magasságra).
            if (letter.length > 1) {
                const firstChar = letter.charAt(0);
                const restChars = letter.slice(1).toLowerCase();
                face0.innerHTML = `<span>${firstChar}</span><span class="print-small">${restChars}</span>`;
            } else {
                face0.innerText = letter;
            }

            face1.innerText = letter.toLowerCase();
            face2.innerText = letter; // Írottnál marad a text, mert a FontForge rajzolja egybe!
            face3.innerText = letter.toLowerCase();
        }

        // Dinamikus CSS változók a hosszú betűkhöz
        let spread = '34%';
        let fontSize = '25cqw';

        if (letter.length === 2) {
            fontSize = '20cqw';
        } else if (letter.length >= 3) {
            fontSize = '17cqw';
        }

        coverflowEl.style.setProperty('--card-spread', spread);
        coverflowEl.style.setProperty('--card-font-size', fontSize);
    }

    function renderCoverflowState() {
        const items = [
            document.getElementById('face-0'),
            document.getElementById('face-1'),
            document.getElementById('face-2'),
            document.getElementById('face-3')
        ];

        items.forEach((item, i) => {
            if (!item) return;
            if (i === activeIndex) {
                item.setAttribute('data-position', 'active');
            } else if (i === (activeIndex + 1) % 4) {
                item.setAttribute('data-position', 'next');
            } else if (i === (activeIndex + 3) % 4) { // (activeIndex - 1)
                item.setAttribute('data-position', 'prev');
            } else {
                item.setAttribute('data-position', 'hidden');
            }
        });
    }

    const prevBtn = document.getElementById('coverflow-prev');
    const nextBtn = document.getElementById('coverflow-next');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            activeIndex = (activeIndex + 3) % 4; // Vissza (balra nyíl)
            renderCoverflowState();
        });

        nextBtn.addEventListener('click', () => {
            activeIndex = (activeIndex + 1) % 4; // Előre (jobbra nyíl)
            renderCoverflowState();
        });
    }

    updateCoverflowFaces(currentLetter);
    renderCoverflowState();

    // Adatbázis a galériához minden betűre
    const galleryData = {
        'A': [{ word: 'alma', img: '' }, { word: 'autó', img: '' }, { word: 'asztal', img: '' }],
        'Á': [{ word: 'ágy', img: '' }, { word: 'állat', img: '' }, { word: 'ásó', img: '' }],
        'B': [{ word: 'baba', img: '' }, { word: 'béka', img: '' }, { word: 'bálna', img: '' }],
        'C': [{ word: 'cápa', img: './assets/pics/capa.jpg' }, { word: 'cumi', img: './assets/pics/cumi.jpg' }, { word: 'cékla', img: './assets/pics/cekla.jpg' }],
        'CS': [{ word: 'csiga', img: '' }, { word: 'csillag', img: '' }, { word: 'csizma', img: '' }],
        'D': [{ word: 'dob', img: '' }, { word: 'dinnye', img: '' }, { word: 'dió', img: '' }],
        'DZ': [{ word: 'edző', img: '' }, { word: 'bodza', img: '' }, { word: 'madzag', img: '' }],
        'DZS': [{ word: 'dzsungel', img: '' }, { word: 'dzsip', img: '' }, { word: 'dzsinn', img: '' }],
        'E': [{ word: 'egér', img: '' }, { word: 'eper', img: '' }, { word: 'elefánt', img: '' }],
        'É': [{ word: 'érem', img: '' }, { word: 'épület', img: '' }, { word: 'ének', img: '' }],
        'F': [{ word: 'fa', img: '' }, { word: 'fóka', img: '' }, { word: 'fecske', img: '' }],
        'G': [{ word: 'gomba', img: '' }, { word: 'golyó', img: '' }, { word: 'gép', img: '' }],
        'GY': [{ word: 'gyertya', img: '' }, { word: 'gyűrű', img: '' }, { word: 'gyerek', img: '' }],
        'H': [{ word: 'ház', img: '' }, { word: 'hajó', img: '' }, { word: 'híd', img: '' }],
        'I': [{ word: 'ing', img: '' }, { word: 'iroda', img: '' }, { word: 'iskola', img: '' }],
        'Í': [{ word: 'íj', img: '' }, { word: 'író', img: '' }, { word: 'írás', img: '' }],
        'J': [{ word: 'játék', img: '' }, { word: 'juh', img: '' }, { word: 'jég', img: '' }],
        'K': [{ word: 'kutya', img: '' }, { word: 'könyv', img: '' }, { word: 'kapa', img: '' }],
        'L': [{ word: 'ló', img: '' }, { word: 'labda', img: '' }, { word: 'lámpa', img: '' }],
        'LY': [{ word: 'lyuk', img: '' }, { word: 'bagoly', img: '' }, { word: 'osztály', img: '' }],
        'M': [{ word: 'maci', img: '' }, { word: 'madár', img: '' }, { word: 'macska', img: '' }],
        'N': [{ word: 'nap', img: '' }, { word: 'nadrág', img: '' }, { word: 'nád', img: '' }],
        'NY': [{ word: 'nyuszi', img: '' }, { word: 'nyak', img: '' }, { word: 'nyelv', img: '' }],
        'O': [{ word: 'olló', img: '' }, { word: 'orvos', img: '' }, { word: 'oroszlán', img: '' }],
        'Ó': [{ word: 'óra', img: '' }, { word: 'óvoda', img: '' }, { word: 'óriás', img: '' }],
        'Ö': [{ word: 'öv', img: '' }, { word: 'ökör', img: '' }, { word: 'ördög', img: '' }],
        'Ő': [{ word: 'őz', img: '' }, { word: 'őr', img: '' }, { word: 'ősz', img: '' }],
        'P': [{ word: 'pók', img: '' }, { word: 'pék', img: '' }, { word: 'pénz', img: '' }],
        'Q': [{ word: 'quad', img: '' }, { word: 'quiz', img: '' }, { word: 'quinoa', img: '' }],
        'R': [{ word: 'róka', img: '' }, { word: 'répa', img: '' }, { word: 'rák', img: '' }],
        'S': [{ word: 'sajt', img: '' }, { word: 'sárkány', img: '' }, { word: 'só', img: '' }],
        'SZ': [{ word: 'szem', img: '' }, { word: 'szánkó', img: '' }, { word: 'szék', img: '' }],
        'T': [{ word: 'tej', img: '' }, { word: 'torta', img: '' }, { word: 'tégla', img: '' }],
        'TY': [{ word: 'tyúk', img: '' }, { word: 'pötty', img: '' }, { word: 'korty', img: '' }],
        'U': [{ word: 'ujj', img: '' }, { word: 'utca', img: '' }, { word: 'ugatás', img: '' }],
        'Ú': [{ word: 'út', img: '' }, { word: 'újság', img: '' }, { word: 'úszás', img: '' }],
        'Ü': [{ word: 'üveg', img: '' }, { word: 'ünnep', img: '' }, { word: 'üst', img: '' }],
        'Ű': [{ word: 'űrhajó', img: '' }, { word: 'űrlény', img: '' }, { word: 'zűr', img: '' }],
        'V': [{ word: 'vonat', img: '' }, { word: 'vödör', img: '' }, { word: 'vár', img: '' }],
        'W': [{ word: 'web', img: '' }, { word: 'wifi', img: '' }, { word: 'walkie-talkie', img: '' }],
        'X': [{ word: 'xilofon', img: '' }, { word: 'xerox', img: '' }, { word: 'taxi', img: '' }],
        'Y': [{ word: 'yeti', img: '' }, { word: 'yorki', img: '' }, { word: 'gally', img: '' }],
        'Z': [{ word: 'zebra', img: '' }, { word: 'zászló', img: '' }, { word: 'zongora', img: '' }],
        'ZS': [{ word: 'zsiráf', img: '' }, { word: 'zsák', img: '' }, { word: 'zsemle', img: '' }]
    };

    function renderGallery(letter) {
        const titleEl = document.getElementById('gallery-title');
        const gridEl = document.getElementById('gallery-grid');

        if (!titleEl || !gridEl) return;

        const upperLetter = letter.toUpperCase();
        // A galéria címében is a helyes, magyar formátum (pl. "Cs betűs szavak") jelenjen meg
        titleEl.innerText = `${letter} betűs szavak`;

        const items = galleryData[upperLetter];

        if (items && items.length > 0) {
            const existingCards = gridEl.querySelectorAll('.gallery__card');

            if (existingCards.length === 0) {
                // Első renderelés (vagy üres grid esetén)
                gridEl.innerHTML = '';
                items.forEach((item, index) => {
                    const imgContent = item.img
                        ? `<img src="${item.img}" alt="${item.word}" class="gallery__img" id="gallery-img-${index}">`
                        : `<span class="material-symbols-outlined gallery__placeholder-icon" id="gallery-img-${index}">image</span>`;

                    const cardHTML = `
                        <div class="gallery__card" id="gallery-card-${index}">
                            <div class="gallery__img-wrap" id="gallery-wrap-${index}">
                                ${imgContent}
                            </div>
                            <div class="gallery__content">
                                <p class="gallery__word-title" id="gallery-title-${index}">${item.word}</p>
                                <div class="gallery__divider"></div>
                            </div>
                        </div>
                    `;
                    gridEl.insertAdjacentHTML('beforeend', cardHTML);
                });
            } else {
                // Kártyák dobozai már léteznek, csak a tartalmat cseréljük!
                items.forEach((item, index) => {
                    const wrapEl = document.getElementById(`gallery-wrap-${index}`);
                    const titleEl = document.getElementById(`gallery-title-${index}`);

                    if (wrapEl && titleEl) {
                        wrapEl.innerHTML = item.img
                            ? `<img src="${item.img}" alt="${item.word}" class="gallery__img" id="gallery-img-${index}">`
                            : `<span class="material-symbols-outlined gallery__placeholder-icon" id="gallery-img-${index}">image</span>`;
                        titleEl.innerText = item.word;
                    }
                });
            }
        }
    }

    // Kezdeti galéria betöltés
    renderGallery(currentLetter);

    // Ábécé gombok logikája
    document.querySelectorAll('.alphabet-scroll__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newLetter = btn.innerText.trim();

            // Ha ugyanarra a betűre kattint, ne töltsön be mindent újra (villogás megelőzése)
            if (newLetter === currentLetter) return;

            // Aktív állapot eltávolítása
            document.querySelectorAll('.alphabet-scroll__btn').forEach(b => {
                b.classList.remove('alphabet-scroll__btn--active-primary');
            });
            // Új gomb aktívvá tétele
            btn.classList.add('alphabet-scroll__btn--active-primary');

            // --- ANIMÁCIÓ KEZDETE CSAK A BELSŐ TARTALOMRA ---
            const coverflowEl = document.getElementById('letter-coverflow');
            const videoEl = document.getElementById('instructional-video');
            const mimicryImg = document.querySelector('.mimicry-card__image'); // Ha van mimicry kép
            const galleryContentEls = document.querySelectorAll('.gallery__img-wrap, .gallery__word-title');

            // Fade Out (Kizárólag a tartalom halványul)
            if (coverflowEl) coverflowEl.style.opacity = '0';
            if (videoEl) videoEl.style.opacity = '0';
            if (mimicryImg) mimicryImg.style.opacity = '0';
            galleryContentEls.forEach(el => el.style.opacity = '0');

            // Gyors 150ms után (negyed másodpercen belüli folyamat) tartalom csere és Fade In
            setTimeout(() => {
                // Betű frissítése
                currentLetter = newLetter;

                // Coverflow arcok frissítése és alapállapotba hozása
                activeIndex = 0;
                updateCoverflowFaces(currentLetter);
                renderCoverflowState();

                // Videó frissítése
                if (videoEl) {
                    const videoSource = videoEl.querySelector('source');
                    videoSource.src = `assets/video/${getSafeFileName(currentLetter)}.mp4`;
                    videoEl.load();

                    const overlayBtn = document.getElementById('video-overlay-btn');
                    if (overlayBtn) overlayBtn.style.display = 'flex';
                }

                // Mimicry kép frissítése az assets/pics/betuk mappából
                if (mimicryImg) {
                    const safeName = getSafeFileName(currentLetter);
                    // Kép csere
                    mimicryImg.src = `assets/pics/betuk/${safeName}.jpg`;

                    // Ha a kép még nem létezik (404), azonnal cserélje le egy elegáns beépített vektoros helyőrzőre!
                    mimicryImg.onerror = () => {
                        mimicryImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23cccccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                    };
                }

                // Mimicry szöveg dinamikus frissítése
                const mimicryTextEl = document.querySelector('.mimicry-card__text');
                if (mimicryTextEl) {
                    mimicryTextEl.textContent = getMimicryText(currentLetter);
                }

                // Galéria frissítése (nem rombolja le a kártyákat)
                renderGallery(currentLetter);

                // Fade-in animáció
                if (coverflowEl) coverflowEl.style.opacity = '1';
                if (videoEl) videoEl.style.opacity = '1';
                if (mimicryImg) mimicryImg.style.opacity = '1';

                // Mivel a renderGallery új imgContent-et rakhatott be, újra lekérjük a frissített elemeket a biztonság kedvéért:
                const updatedGalleryEls = document.querySelectorAll('.gallery__img-wrap, .gallery__word-title');
                updatedGalleryEls.forEach(el => el.style.opacity = '1');

            }, 150);
        });
    });

    // Egyedi videó vezérlés (mivel a native controls rejtve van)
    const videoEl = document.getElementById('instructional-video');
    const overlayBtn = document.getElementById('video-overlay-btn');

    if (videoEl && overlayBtn) {
        // Overlay-re kattintás indítja a videót
        overlayBtn.addEventListener('click', () => {
            videoEl.play();
            overlayBtn.style.display = 'none';
        });

        // Magára a videóra kattintás play/pause
        videoEl.addEventListener('click', () => {
            if (videoEl.paused) {
                videoEl.play();
                overlayBtn.style.display = 'none';
            } else {
                videoEl.pause();
                overlayBtn.style.display = 'flex';
            }
        });

        // Videó végén overlay ismét látszik
        videoEl.addEventListener('ended', () => {
            overlayBtn.style.display = 'flex';
        });
    }

    // --- Kiejtés Audio Vezérlés ---
    const pronounceBtn = document.getElementById('btn-pronounce');
    const letterAudio = new Audio();
    let isPlaying = false;

    if (pronounceBtn) {
        pronounceBtn.addEventListener('click', () => {
            if (isPlaying && letterAudio.src.includes(currentLetter.toLowerCase())) {
                // Ha épp szól és újra rányom, induljon újra
                letterAudio.currentTime = 0;
            } else {
                letterAudio.src = `assets/sound/${getSafeFileName(currentLetter)}.mp3`;
                letterAudio.play().catch(e => console.warn("Hanglejátszás hiba:", e));
                isPlaying = true;
                pronounceBtn.classList.add('is-playing');
            }
        });

        letterAudio.addEventListener('ended', () => {
            isPlaying = false;
            pronounceBtn.classList.remove('is-playing');
        });

        letterAudio.addEventListener('error', () => {
            isPlaying = false;
            pronounceBtn.classList.remove('is-playing');
        });
    }

    // --- Súgó Tooltip Vezérlés ---
    const helpBtn = document.getElementById('btn-help');
    const helpTooltip = document.getElementById('help-tooltip');
    const helpCloseBtn = document.getElementById('help-tooltip-close');
    const helpContent = document.getElementById('help-tooltip-content');

    if (helpBtn && helpTooltip) {
        function showHelp() {
            const letter = currentLetter.toLowerCase();
            const hintText = hintsDB[letter] || "Hamarosan érkezik a fonomimikai leírás ehhez a betűhöz is!";

            helpContent.innerHTML = hintText.replace(/\n/g, '<br><br>');
            helpTooltip.style.display = 'block';

            // Késleltetés az animációhoz
            setTimeout(() => {
                helpTooltip.classList.add('help-tooltip--show');
            }, 10);
        }

        function hideHelp() {
            helpTooltip.classList.remove('help-tooltip--show');
            setTimeout(() => {
                helpTooltip.style.display = 'none';
            }, 300);
        }

        helpBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Ne záródjon be egyből a document click miatt
            if (helpTooltip.classList.contains('help-tooltip--show')) {
                hideHelp();
            } else {
                showHelp();
            }
        });

        helpCloseBtn.addEventListener('click', hideHelp);

        // Kattintás a dokumentumon kívülre bezárja a tooltipet
        document.addEventListener('click', (e) => {
            if (helpTooltip.classList.contains('help-tooltip--show')) {
                if (!helpTooltip.contains(e.target) && e.target !== helpBtn) {
                    hideHelp();
                }
            }
        });
    }
}

// Simple button sound effect trigger simulation
document.querySelectorAll('.pressable-btn, .app-header__btn, .alphabet-scroll__btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const currentTransform = btn.style.transform;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = currentTransform || 'scale(1)';
        }, 150);
    });
});
