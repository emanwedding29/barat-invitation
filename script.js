/* =========================================
   MUSIC
   Phones block audio with sound until the visitor touches the
   page. So we: (1) try to play with sound, (2) if blocked, play
   MUTED (always allowed) and (3) unmute on the first touch/tap.
========================================= */

const weddingMusic = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

function setPlayingState(on) {
    if (!musicBtn) return;
    musicBtn.classList.toggle("playing", on);
}

function isAudible() {
    return weddingMusic && !weddingMusic.paused && !weddingMusic.muted;
}

function playWithSound() {
    weddingMusic.muted = false;
    try {
        const p = weddingMusic.play();
        if (p && typeof p.then === "function") {
            return p.then(() => true).catch(() => false);
        }
        return Promise.resolve(true);
    } catch (e) {
        return Promise.resolve(false);
    }
}

const unlockEvents = ["touchend", "pointerup", "click", "keydown", "wheel"];

function removeUnlockListeners() {
    unlockEvents.forEach((type) => {
        document.removeEventListener(type, unlockMusic);
    });
}

function unlockMusic(event) {
    // The music button handles its own taps
    if (event && event.target && event.target.closest && event.target.closest("#musicBtn")) {
        return;
    }

    playWithSound().then((ok) => {
        if (ok && isAudible()) {
            setPlayingState(true);
            removeUnlockListeners();
        }
    });
}

if (weddingMusic) {
    playWithSound().then((ok) => {
        if (ok) {
            setPlayingState(true);
            return;
        }

        // Blocked: start silently so the first touch only has to unmute
        weddingMusic.muted = true;
        const p = weddingMusic.play();
        if (p && typeof p.catch === "function") {
            p.catch(() => {});
        }

        unlockEvents.forEach((type) => {
            document.addEventListener(type, unlockMusic, { passive: true });
        });
    });
}

if (musicBtn && weddingMusic) {
    musicBtn.addEventListener("click", () => {
        if (isAudible()) {
            weddingMusic.pause();
            setPlayingState(false);
        } else {
            playWithSound().then((ok) => {
                setPlayingState(ok);
                if (ok) removeUnlockListeners();
            });
        }
    });
}

/* =========================================
   COUNTDOWN
========================================= */

// Barat: 29 November 2026, 7:00 PM Pakistan time
const weddingDate = new Date("2026-11-29T19:00:00+05:00").getTime();

function updateCountdown() {
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }

    const difference = weddingDate - Date.now();

    if (difference <= 0) {
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
}

if (
    document.getElementById("days") &&
    document.getElementById("hours") &&
    document.getElementById("minutes") &&
    document.getElementById("seconds")
) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".section, .closing-section, .closing-contacts-section, footer"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach((element) => {
        element.classList.add("show");
    });
}
