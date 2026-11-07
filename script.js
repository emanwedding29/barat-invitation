/* =========================================
   MUSIC
   Browsers (especially iOS Safari) block autoplay until the
   visitor interacts with the page, so we try to autoplay, and
   if blocked, start on the first tap / click / key press.
========================================= */

const weddingMusic = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

function startMusic() {
    if (!weddingMusic) return Promise.resolve(false);

    try {
        const attempt = weddingMusic.play();

        if (attempt && typeof attempt.then === "function") {
            return attempt
                .then(() => {
                    if (musicBtn) musicBtn.classList.add("playing");
                    return true;
                })
                .catch(() => false);
        }

        // Very old browsers: play() returns nothing
        if (musicBtn) musicBtn.classList.add("playing");
        return Promise.resolve(true);
    } catch (error) {
        return Promise.resolve(false);
    }
}

const unlockEvents = ["touchend", "pointerup", "click", "keydown"];

function unlockMusic(event) {
    // Let the music button handle its own taps
    if (event && event.target && event.target.closest && event.target.closest("#musicBtn")) {
        return;
    }

    startMusic().then((started) => {
        if (started) {
            unlockEvents.forEach((type) => {
                document.removeEventListener(type, unlockMusic);
            });
        }
    });
}

if (weddingMusic) {
    // 1) Try to autoplay straight away (works on some desktop browsers)
    startMusic().then((started) => {
        // 2) Otherwise wait for the first real user gesture
        if (!started) {
            unlockEvents.forEach((type) => {
                document.addEventListener(type, unlockMusic, { passive: true });
            });
        }
    });
}

if (musicBtn && weddingMusic) {
    musicBtn.addEventListener("click", () => {
        if (weddingMusic.paused) {
            startMusic();
        } else {
            weddingMusic.pause();
            musicBtn.classList.remove("playing");
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
