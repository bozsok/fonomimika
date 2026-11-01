// Interactive Letter Switcher
let studentDB = null;
let currentStudent = null;
let hintsDB = {};
let galleryDB = {};

async function initGallery() {
    try {
        const response = await fetch('data/gallery.json');
        galleryDB = await response.json();
        return galleryDB;
    } catch (e) {
        console.error('Hiba a galéria adatbázis betöltésekor:', e);
    }
}

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

            // Demó módban betöltjük a localStorage-ból a mentett avatárt
            if (import.meta.env.VITE_APP_MODE === 'demo') {
                const savedAvatar = localStorage.getItem('demo_avatar_id');
                if (savedAvatar !== null) {
                    currentStudent.avatarId = parseInt(savedAvatar, 10);
                }
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
                updateLearnedLettersUI();
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
        // Demó módban local storage-ba mentünk, egyébként a PHP backendre
        if (import.meta.env.VITE_APP_MODE === 'demo') {
            localStorage.setItem('demo_avatar_id', avatarId);
        } else {
            saveToDatabase();
        }
    }

    document.getElementById('avatar-modal').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';

    updateUserAvatarUI();
    updateLearnedLettersUI();
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

function updateLearnedLettersUI() {
    if (!currentStudent) return;
    const learned = currentStudent.learnedLetters || [];
    
    document.querySelectorAll('.alphabet-scroll__btn').forEach(btn => {
        const letter = btn.innerText.trim();
        btn.classList.remove('alphabet-scroll__btn--learned-student');
        if (learned.includes(letter)) {
            btn.classList.add('alphabet-scroll__btn--learned-student');
        }
    });
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
const galleryReady = initGallery();
initAvatarModal();
const coverflowEl = document.getElementById('letter-coverflow');
const navProgressBtn = document.getElementById('nav-btn-progress');
let currentLetter = 'A';
let currentMainView = 'teach';
let switchView = () => {};

if (coverflowEl) {
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

    function getGalleryImgHTML(item, index) {
        if (!item.img) {
            return `<span class="material-symbols-outlined gallery__placeholder-icon" id="gallery-img-${index}">image</span>`;
        }
        return `<img src="${item.img}" alt="${item.word}" class="gallery__img" id="gallery-img-${index}" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'material-symbols-outlined gallery__placeholder-icon\\' id=\\'gallery-img-${index}\\'>image</span>';">`;
    }

    function renderGallery(letter) {
        const titleEl = document.getElementById('gallery-title');
        const gridEl = document.getElementById('gallery-grid');

        if (!titleEl || !gridEl) return;

        const upperLetter = letter.toUpperCase();
        // A galéria címében is a helyes, magyar formátum (pl. "Cs betűs szavak") jelenjen meg
        titleEl.innerText = `${letter} betűs szavak`;

        const items = galleryDB ? galleryDB[upperLetter] : null;

        if (items && items.length > 0) {
            const existingCards = gridEl.querySelectorAll('.gallery__card');

            if (existingCards.length === 0) {
                // Első renderelés (vagy üres grid esetén)
                gridEl.innerHTML = '';
                items.forEach((item, index) => {
                    const imgContent = getGalleryImgHTML(item, index);

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
                        wrapEl.innerHTML = getGalleryImgHTML(item, index);
                        titleEl.innerText = item.word;
                    }
                });
            }
        }
    }

    // Kezdeti galéria betöltés (amint a gallery.json megérkezett)
    galleryReady.then(() => {
        renderGallery(currentLetter);
    });

    // --- Főmenü Nézetváltás (Tanítás / Gyakorlás / Haladás) ---
    const navTeachBtn = document.getElementById('nav-btn-teach');
    const navPracticeBtn = document.getElementById('nav-btn-practice');
    const viewTeaching = document.getElementById('view-teaching');
    const viewPractice = document.getElementById('view-practice');
    const viewProgress = document.getElementById('view-progress');
    const sidebarStudentContent = document.getElementById('sidebar-student-content');
    const sidebarTeacherContent = document.getElementById('sidebar-teacher-content');
    const appContainer = document.querySelector('.app-container');

    switchView = function (viewName) {
        currentMainView = viewName;

        // Bármelyik nézetváltáskor, ha ment a videó a Tanítás nézetben, megállítjuk
        const videoEl = document.getElementById('instructional-video');
        const overlayBtn = document.getElementById('video-overlay-btn');
        if (videoEl && !videoEl.paused) {
            videoEl.pause();
            if (overlayBtn) overlayBtn.style.display = 'flex';
        }

        if (viewName === 'teach') {
            if (navTeachBtn) navTeachBtn.classList.add('app-header__nav-item--active');
            if (navPracticeBtn) navPracticeBtn.classList.remove('app-header__nav-item--active');
            if (navProgressBtn) navProgressBtn.classList.remove('app-header__nav-item--active');

            if (viewTeaching) viewTeaching.classList.remove('learning-hero--hidden');
            if (viewPractice) viewPractice.classList.add('gallery--hidden');
            if (viewProgress) viewProgress.classList.add('progress-view--hidden');

            if (sidebarStudentContent) sidebarStudentContent.style.display = '';
            if (sidebarTeacherContent) sidebarTeacherContent.style.display = 'none';
            if (appContainer) appContainer.classList.remove('app-container--teacher-mode');
        } else if (viewName === 'practice') {
            if (navPracticeBtn) navPracticeBtn.classList.add('app-header__nav-item--active');
            if (navTeachBtn) navTeachBtn.classList.remove('app-header__nav-item--active');
            if (navProgressBtn) navProgressBtn.classList.remove('app-header__nav-item--active');

            if (viewTeaching) viewTeaching.classList.add('learning-hero--hidden');
            if (viewPractice) viewPractice.classList.remove('gallery--hidden');
            if (viewProgress) viewProgress.classList.add('progress-view--hidden');

            if (sidebarStudentContent) sidebarStudentContent.style.display = '';
            if (sidebarTeacherContent) sidebarTeacherContent.style.display = 'none';
            if (appContainer) appContainer.classList.remove('app-container--teacher-mode');

            // Gyakorlás megjelenítésekor biztosítjuk a kártyák frissességét
            renderGallery(currentLetter);
        } else if (viewName === 'progress') {
            if (navProgressBtn) navProgressBtn.classList.add('app-header__nav-item--active');
            if (navTeachBtn) navTeachBtn.classList.remove('app-header__nav-item--active');
            if (navPracticeBtn) navPracticeBtn.classList.remove('app-header__nav-item--active');

            if (viewTeaching) viewTeaching.classList.add('learning-hero--hidden');
            if (viewPractice) viewPractice.classList.add('gallery--hidden');
            if (viewProgress) viewProgress.classList.remove('progress-view--hidden');

            if (sidebarStudentContent) sidebarStudentContent.style.display = 'none';
            if (sidebarTeacherContent) sidebarTeacherContent.style.display = 'flex';
            if (appContainer) appContainer.classList.add('app-container--teacher-mode');

            // Tanulók listájának és részleteinek inicializálása
            initTeacherProgressView();
        }
    }

    if (navTeachBtn) {
        navTeachBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('teach');
        });
    }

    if (navPracticeBtn) {
        navPracticeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('practice');
        });
    }

    if (navProgressBtn) {
        navProgressBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('progress');
        });
    }

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

/* ========================================================================= */
/* Pedagógus Belépés és Haladás Nézet Logika                                */
/* ========================================================================= */
const TEACHER_PASSWORD = 'agika01';
let isTeacherAuthenticated = false;
let teacherSelectedStudent = null;

const btnTeacherAuth = document.getElementById('btn-teacher-auth');
const teacherAuthIcon = document.getElementById('teacher-auth-icon');
const teacherAuthText = document.getElementById('teacher-auth-text');
const teacherAuthPopover = document.getElementById('teacher-auth-popover');
const teacherAuthClose = document.getElementById('teacher-auth-close');
const teacherAuthForm = document.getElementById('teacher-auth-form');
const teacherPasswordInput = document.getElementById('teacher-password-input');
const teacherAuthError = document.getElementById('teacher-auth-error');
const teacherSearch = document.getElementById('teacher-search');
const teacherStudentList = document.getElementById('teacher-student-list');

// Demó módban elrejtjük a pedagógus belépőt
if (import.meta.env.VITE_APP_MODE === 'demo') {
    const teacherContainer = document.querySelector('.teacher-auth-container');
    if (teacherContainer) teacherContainer.style.display = 'none';
}

function showTeacherAuthPopover() {
    if (!teacherAuthPopover) return;
    teacherAuthPopover.style.display = 'block';
    if (teacherAuthError) teacherAuthError.style.display = 'none';
    if (teacherPasswordInput) {
        teacherPasswordInput.value = '';
        setTimeout(() => teacherPasswordInput.focus(), 50);
    }
    setTimeout(() => {
        teacherAuthPopover.classList.add('teacher-auth-popover--show');
    }, 10);
}

function hideTeacherAuthPopover() {
    if (!teacherAuthPopover) return;
    teacherAuthPopover.classList.remove('teacher-auth-popover--show');
    setTimeout(() => {
        teacherAuthPopover.style.display = 'none';
    }, 250);
}

if (btnTeacherAuth) {
    btnTeacherAuth.addEventListener('click', (e) => {
        e.stopPropagation();

        // Ha már be van jelentkezve: rákattintva kijelentkezik
        if (isTeacherAuthenticated) {
            isTeacherAuthenticated = false;
            if (teacherAuthIcon) teacherAuthIcon.textContent = 'lock';
            if (teacherAuthText) teacherAuthText.textContent = 'Belépés';
            btnTeacherAuth.classList.remove('pressable-btn--teacher--active');
            btnTeacherAuth.title = 'Pedagógus belépés';

            if (navProgressBtn) navProgressBtn.style.display = 'none';

            // Ha éppen a Haladás nézetben volt, visszatérünk a Tanítás fülre
            if (currentMainView === 'progress') {
                switchView('teach');
            }
            return;
        }

        // Ha nincs bejelentkezve: megnyitja/bezárja a jelszókérő tooltipet
        if (teacherAuthPopover && teacherAuthPopover.classList.contains('teacher-auth-popover--show')) {
            hideTeacherAuthPopover();
        } else {
            showTeacherAuthPopover();
        }
    });
}

if (teacherAuthClose) {
    teacherAuthClose.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTeacherAuthPopover();
    });
}

// Kattintás a popoveren kívülre bezárja azt
document.addEventListener('click', (e) => {
    if (teacherAuthPopover && teacherAuthPopover.classList.contains('teacher-auth-popover--show')) {
        if (!teacherAuthPopover.contains(e.target) && (!btnTeacherAuth || !btnTeacherAuth.contains(e.target))) {
            hideTeacherAuthPopover();
        }
    }
});

// Pedagógus belépési űrlap beküldése
if (teacherAuthForm) {
    teacherAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPassword = teacherPasswordInput ? teacherPasswordInput.value.trim() : '';

        if (enteredPassword === TEACHER_PASSWORD) {
            isTeacherAuthenticated = true;
            if (teacherAuthIcon) teacherAuthIcon.textContent = 'lock_open';
            if (teacherAuthText) teacherAuthText.textContent = 'Kilépés';
            if (btnTeacherAuth) {
                btnTeacherAuth.classList.add('pressable-btn--teacher--active');
                btnTeacherAuth.title = 'Pedagógus kijelentkezés';
            }

            if (navProgressBtn) navProgressBtn.style.display = 'inline-flex';

            hideTeacherAuthPopover();
            // Azonnal a Haladás oldalra lépünk
            switchView('progress');
        } else {
            if (teacherAuthError) teacherAuthError.style.display = 'block';
            if (teacherPasswordInput) {
                teacherPasswordInput.select();
            }
        }
    });
}

function initTeacherProgressView() {
    const list = studentDB?.students || [];

    // Ha még nincs kiválasztott diák, de van diák az adatbázisban, kiválasztjuk az elsőt
    if (!teacherSelectedStudent && list.length > 0) {
        teacherSelectedStudent = list[0];
    }

    if (teacherSearch) teacherSearch.value = '';
    renderTeacherStudentList(list);
    renderTeacherDetail();
}

function renderTeacherStudentList(list) {
    if (!teacherStudentList) return;
    teacherStudentList.innerHTML = '';

    if (list.length === 0) {
        teacherStudentList.innerHTML = '<p style="color: var(--color-on-surface-variant); padding: 1rem;">Nincs találat.</p>';
        return;
    }

    list.forEach(student => {
        const item = document.createElement('div');
        item.className = 'teacher-student-item';

        // Ha a kiválasztott diák megegyezik, aktív stílust kap
        if (teacherSelectedStudent && teacherSelectedStudent.name === student.name) {
            item.classList.add('teacher-student-item--active');
        }

        item.innerHTML = `
            <div>
                <div style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.2rem;">${student.name}</div>
                <div style="font-size: 0.85rem; opacity: 0.85;">${student.class || 'Nincs osztály'}</div>
            </div>
            <span class="material-symbols-outlined" style="font-size: 1.25rem;">chevron_right</span>
        `;

        item.addEventListener('click', () => {
            teacherSelectedStudent = student;
            renderTeacherStudentList(list);
            renderTeacherDetail();
        });

        teacherStudentList.appendChild(item);
    });
}

if (teacherSearch) {
    teacherSearch.addEventListener('input', (e) => {
        const val = normalizeStr(e.target.value);
        const list = studentDB?.students || [];

        if (!val) {
            renderTeacherStudentList(list);
            return;
        }

        const filtered = list.filter(s =>
            normalizeStr(s.name).includes(val) ||
            normalizeStr(s.class || '').includes(val)
        );
        renderTeacherStudentList(filtered);
    });
}

function renderTeacherDetail() {
    const nameEl = document.getElementById('teacher-detail-name');
    const classEl = document.getElementById('teacher-detail-class');
    const statsEl = document.getElementById('teacher-detail-stats');
    const badgeEl = document.getElementById('teacher-detail-badge');
    const grid = document.getElementById('teacher-alphabet-grid');

    if (!grid) return;
    grid.innerHTML = '';

    if (!teacherSelectedStudent) {
        if (nameEl) nameEl.innerText = 'Válassz egy tanulót!';
        if (classEl) classEl.innerText = 'A bal oldali névsorból válassz ki egy diákot az elsajátított betűk kezeléséhez.';
        if (statsEl) statsEl.style.display = 'none';
        return;
    }

    if (nameEl) nameEl.innerText = teacherSelectedStudent.name;
    if (classEl) classEl.innerText = `${teacherSelectedStudent.class || 'Nincs osztály megadva'} • Elsajátított betűk kezelése`;

    // Biztosítjuk, hogy a diák adatobjektumában létezzen a learnedLetters tömb
    if (!Array.isArray(teacherSelectedStudent.learnedLetters)) {
        teacherSelectedStudent.learnedLetters = [];
    }

    const alphabet = ['A', 'Á', 'B', 'C', 'Cs', 'D', 'Dz', 'Dzs', 'E', 'É', 'F', 'G', 'Gy', 'H', 'I', 'Í', 'J', 'K', 'L', 'Ly', 'M', 'N', 'Ny', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R', 'S', 'Sz', 'T', 'Ty', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W', 'X', 'Y', 'Z', 'Zs'];

    function updateStatsBadge() {
        if (statsEl && badgeEl) {
            statsEl.style.display = 'block';
            badgeEl.innerText = `${teacherSelectedStudent.learnedLetters.length} / ${alphabet.length} betű megtanulva`;
        }
    }

    updateStatsBadge();

    alphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'teacher-alphabet-btn';
        btn.innerText = letter;

        // Ha már megtanulta, kék hátteret kap
        if (teacherSelectedStudent.learnedLetters.includes(letter)) {
            btn.classList.add('teacher-alphabet-btn--learned');
        }

        btn.addEventListener('click', () => {
            const idx = teacherSelectedStudent.learnedLetters.indexOf(letter);
            if (idx > -1) {
                // Ha benne van, töröljük
                teacherSelectedStudent.learnedLetters.splice(idx, 1);
                btn.classList.remove('teacher-alphabet-btn--learned');
            } else {
                // Ha nincs benne, hozzáadjuk
                teacherSelectedStudent.learnedLetters.push(letter);
                btn.classList.add('teacher-alphabet-btn--learned');
            }

            updateStatsBadge();

            // Azonnali mentés a szerverre
            saveToDatabase();

            // Ha a jelenleg bejelentkezett felhasználót módosítjuk, azonnal frissítjük a főfelületet is
            if (currentStudent && teacherSelectedStudent.name === currentStudent.name) {
                updateLearnedLettersUI();
            }
        });

        grid.appendChild(btn);
    });
}
