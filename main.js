// Interactive Letter Switcher
const STORAGE_KEY = 'fonomimika_db_v2';
let studentDB = null;
let currentStudent = null;

async function initDatabase() {
    try {
        // 1. Megpróbáljuk LocalStorage-ból
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            studentDB = JSON.parse(localData);
        }
        
        // 2. Fetch a friss students.json (biztos relatív útvonal Vite alatt)
        const response = await fetch('./data/students.json');
        const freshData = await response.json();
        
        // 3. Ha nincs local vagy eltér a tanév, akkor felülírjuk a freshData-val
        if (!studentDB || studentDB.academicYear !== freshData.academicYear) {
            studentDB = freshData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(studentDB));
            console.log('Adatbázis inicializálva/frissítve a fájlból.');
        }
        
        initLoginUI();
    } catch (e) {
        console.error('Hiba az adatbázis betöltésekor:', e);
    }
}

function normalizeStr(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
            // Update UI
            loginModal.style.display = 'none';
            appContent.style.display = 'block';
            
            const avatarLetter = currentStudent.name.charAt(0).toUpperCase();
            sidebarUserInfo.innerHTML = `
                <div class="app-sidebar__avatar">${avatarLetter}</div>
                <div>
                    <p class="app-sidebar__user-name">Szia, ${currentStudent.name}!</p>
                    <p style="font-size: 0.85rem; color: var(--color-on-surface-variant); margin: 0;">${currentStudent.class}</p>
                </div>
            `;
        }
    });
}

// Indítás
initDatabase();

const letterEl = document.getElementById('main-letter');

if (letterEl) {
    let currentLetter = 'A';
    let currentStyle = 0;
    let letterInterval;
    let letterTimeout;

    function startLetterAnimation() {
        if (letterInterval) clearInterval(letterInterval);
        if (letterTimeout) clearTimeout(letterTimeout);
        
        const styles = [
            { text: currentLetter.toUpperCase(), font: 'interactive-card__letter--print' },
            { text: currentLetter.toLowerCase(), font: 'interactive-card__letter--print' },
            { text: currentLetter.toUpperCase(), font: 'interactive-card__letter--script' },
            { text: currentLetter.toLowerCase(), font: 'interactive-card__letter--script' }
        ];

        // Azonnali frissítés és opacitás/skálázás alapállapotba állítása
        letterEl.innerText = styles[0].text;
        letterEl.className = `interactive-card__letter ${styles[0].font}`;
        letterEl.style.opacity = '1';
        letterEl.style.transform = 'scale(1)';

        letterInterval = setInterval(() => {
            currentStyle = (currentStyle + 1) % styles.length;

            letterEl.style.opacity = '0';
            letterEl.style.transform = 'scale(0.8)';

            letterTimeout = setTimeout(() => {
                letterEl.innerText = styles[currentStyle].text;
                letterEl.className = `interactive-card__letter ${styles[currentStyle].font}`;
                letterEl.style.opacity = '1';
                letterEl.style.transform = 'scale(1)';

                document.querySelectorAll('.interactive-card__dot').forEach((dot, index) => {
                    if (index === currentStyle) {
                        dot.classList.add('interactive-card__dot--active');
                    } else {
                        dot.classList.remove('interactive-card__dot--active');
                    }
                });
            }, 300);
        }, 3000);
    }

    startLetterAnimation();

    // Adatbázis a galériához minden betűre
    const galleryData = {
        'A': [{ word: 'Alma', img: '' }, { word: 'Autó', img: '' }, { word: 'Asztal', img: '' }],
        'Á': [{ word: 'Ágy', img: '' }, { word: 'Állat', img: '' }, { word: 'Ásó', img: '' }],
        'B': [{ word: 'Baba', img: '' }, { word: 'Béka', img: '' }, { word: 'Bálna', img: '' }],
        'C': [{ word: 'Cápa', img: './assets/pics/capa.jpg' }, { word: 'Cumi', img: './assets/pics/cumi.jpg' }, { word: 'Cékla', img: './assets/pics/cekla.jpg' }],
        'CS': [{ word: 'Csiga', img: '' }, { word: 'Csillag', img: '' }, { word: 'Csizma', img: '' }],
        'D': [{ word: 'Dob', img: '' }, { word: 'Dinnye', img: '' }, { word: 'Dió', img: '' }],
        'DZ': [{ word: 'Edző', img: '' }, { word: 'Bodza', img: '' }, { word: 'Madzag', img: '' }],
        'DZS': [{ word: 'Dzsungel', img: '' }, { word: 'Dzsip', img: '' }, { word: 'Dzsinn', img: '' }],
        'E': [{ word: 'Egér', img: '' }, { word: 'Eper', img: '' }, { word: 'Elefánt', img: '' }],
        'É': [{ word: 'Érem', img: '' }, { word: 'Épület', img: '' }, { word: 'Ének', img: '' }],
        'F': [{ word: 'Fa', img: '' }, { word: 'Fóka', img: '' }, { word: 'Fecske', img: '' }],
        'G': [{ word: 'Gomba', img: '' }, { word: 'Golyó', img: '' }, { word: 'Gép', img: '' }],
        'GY': [{ word: 'Gyertya', img: '' }, { word: 'Gyűrű', img: '' }, { word: 'Gyerek', img: '' }],
        'H': [{ word: 'Ház', img: '' }, { word: 'Hajó', img: '' }, { word: 'Híd', img: '' }],
        'I': [{ word: 'Ing', img: '' }, { word: 'Iroda', img: '' }, { word: 'Iskola', img: '' }],
        'Í': [{ word: 'Íj', img: '' }, { word: 'Író', img: '' }, { word: 'Írás', img: '' }],
        'J': [{ word: 'Játék', img: '' }, { word: 'Juh', img: '' }, { word: 'Jég', img: '' }],
        'K': [{ word: 'Kutya', img: '' }, { word: 'Könyv', img: '' }, { word: 'Kapa', img: '' }],
        'L': [{ word: 'Ló', img: '' }, { word: 'Labda', img: '' }, { word: 'Lámpa', img: '' }],
        'LY': [{ word: 'Lyuk', img: '' }, { word: 'Bagoly', img: '' }, { word: 'Osztály', img: '' }],
        'M': [{ word: 'Maci', img: '' }, { word: 'Madár', img: '' }, { word: 'Macska', img: '' }],
        'N': [{ word: 'Nap', img: '' }, { word: 'Nadrág', img: '' }, { word: 'Nád', img: '' }],
        'NY': [{ word: 'Nyuszi', img: '' }, { word: 'Nyak', img: '' }, { word: 'Nyelv', img: '' }],
        'O': [{ word: 'Olló', img: '' }, { word: 'Orvos', img: '' }, { word: 'Oroszlán', img: '' }],
        'Ó': [{ word: 'Óra', img: '' }, { word: 'Óvoda', img: '' }, { word: 'Óriás', img: '' }],
        'Ö': [{ word: 'Öv', img: '' }, { word: 'Ökör', img: '' }, { word: 'Ördög', img: '' }],
        'Ő': [{ word: 'Őz', img: '' }, { word: 'Őr', img: '' }, { word: 'Ősz', img: '' }],
        'P': [{ word: 'Pók', img: '' }, { word: 'Pék', img: '' }, { word: 'Pénz', img: '' }],
        'Q': [{ word: 'Quad', img: '' }, { word: 'Quiz', img: '' }, { word: 'Quinoa', img: '' }],
        'R': [{ word: 'Róka', img: '' }, { word: 'Répa', img: '' }, { word: 'Rák', img: '' }],
        'S': [{ word: 'Sajt', img: '' }, { word: 'Sárkány', img: '' }, { word: 'Só', img: '' }],
        'SZ': [{ word: 'Szem', img: '' }, { word: 'Szánkó', img: '' }, { word: 'Szék', img: '' }],
        'T': [{ word: 'Tej', img: '' }, { word: 'Torta', img: '' }, { word: 'Tégla', img: '' }],
        'TY': [{ word: 'Tyúk', img: '' }, { word: 'Pötty', img: '' }, { word: 'Korty', img: '' }],
        'U': [{ word: 'Ujj', img: '' }, { word: 'Utca', img: '' }, { word: 'Ugatás', img: '' }],
        'Ú': [{ word: 'Út', img: '' }, { word: 'Újság', img: '' }, { word: 'Úszás', img: '' }],
        'Ü': [{ word: 'Üveg', img: '' }, { word: 'Ünnep', img: '' }, { word: 'Üst', img: '' }],
        'Ű': [{ word: 'Űrhajó', img: '' }, { word: 'Űrlény', img: '' }, { word: 'Zűr', img: '' }],
        'V': [{ word: 'Vonat', img: '' }, { word: 'Vödör', img: '' }, { word: 'Vár', img: '' }],
        'W': [{ word: 'Web', img: '' }, { word: 'Wifi', img: '' }, { word: 'Walkie-talkie', img: '' }],
        'X': [{ word: 'Xilofon', img: '' }, { word: 'Xerox', img: '' }, { word: 'Taxi', img: '' }],
        'Y': [{ word: 'Yeti', img: '' }, { word: 'Yorki', img: '' }, { word: 'Gally', img: '' }],
        'Z': [{ word: 'Zebra', img: '' }, { word: 'Zászló', img: '' }, { word: 'Zongora', img: '' }],
        'ZS': [{ word: 'Zsiráf', img: '' }, { word: 'Zsák', img: '' }, { word: 'Zsemle', img: '' }]
    };

    function renderGallery(letter) {
        const titleEl = document.getElementById('gallery-title');
        const gridEl = document.getElementById('gallery-grid');

        if (!titleEl || !gridEl) return;

        const upperLetter = letter.toUpperCase();
        titleEl.innerText = `${upperLetter} betűs szavak`;
        gridEl.innerHTML = '';

        const items = galleryData[upperLetter];

        if (items && items.length > 0) {
            items.forEach(item => {
                const imgContent = item.img
                    ? `<img src="${item.img}" alt="${item.word}" class="gallery__img">`
                    : `<span class="material-symbols-outlined gallery__placeholder-icon">image</span>`;

                const cardHTML = `
                    <div class="gallery__card">
                        <div class="gallery__img-wrap">
                            ${imgContent}
                        </div>
                        <div class="gallery__content">
                            <p class="gallery__word-title">${item.word}</p>
                            <div class="gallery__divider"></div>
                        </div>
                    </div>
                `;
                gridEl.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
    }

    // Kezdeti galéria betöltés
    renderGallery(currentLetter);

    // Ábécé gombok logikája
    document.querySelectorAll('.alphabet-scroll__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Aktív állapot eltávolítása
            document.querySelectorAll('.alphabet-scroll__btn').forEach(b => {
                b.classList.remove('alphabet-scroll__btn--active-primary');
            });
            // Új gomb aktívvá tétele
            btn.classList.add('alphabet-scroll__btn--active-primary');

            // Betű frissítése
            currentLetter = btn.innerText.trim();
            currentStyle = 0;

            // Pöttyök azonnali nullázása új betű kiválasztásakor
            document.querySelectorAll('.interactive-card__dot').forEach((dot, index) => {
                if (index === 0) {
                    dot.classList.add('interactive-card__dot--active');
                } else {
                    dot.classList.remove('interactive-card__dot--active');
                }
            });

            startLetterAnimation();

            // Videó frissítése
            const videoEl = document.getElementById('instructional-video');
            if (videoEl) {
                const videoSource = videoEl.querySelector('source');
                videoSource.src = `./assets/video/${currentLetter.toLowerCase()}.mp4`;
                videoEl.load();

                const overlayBtn = document.getElementById('video-overlay-btn');
                if (overlayBtn) {
                    overlayBtn.style.display = 'flex';
                }
            }

            // Galéria frissítése
            renderGallery(currentLetter);
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
