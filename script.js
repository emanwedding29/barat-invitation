/* =========================================
   OPEN INVITATION + MUSIC
   Music starts inside the button's click handler, which is a real
   tap, so iPhones and Androids both allow it.
========================================= */

const openInvitation = document.getElementById("openInvitation");
const openingScreen = document.getElementById("openingScreen");
const weddingMusic = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

function startMusic() {
    if (!weddingMusic) return;

    weddingMusic.muted = false;

    try {
        const attempt = weddingMusic.play();

        if (attempt && typeof attempt.then === "function") {
            attempt
                .then(() => {
                    if (musicBtn) musicBtn.classList.add("playing");
                })
                .catch(() => {
                    console.log("Music could not start.");
                });
        } else if (musicBtn) {
            musicBtn.classList.add("playing");
        }
    } catch (error) {
        console.log("Music could not start.");
    }
}

if (openInvitation && openingScreen) {
    openInvitation.addEventListener("click", () => {
        // Start music first, directly inside the tap
        startMusic();

        // Show the main invitation
        document.body.classList.remove("locked");
        window.scrollTo(0, 0);

        // Fade out the opening screen
        openingScreen.classList.add("hidden");
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
