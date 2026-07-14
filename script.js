/* ===================================
   LẤY PHẦN TỬ
=================================== */

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enterButton");
const loadingPercent = document.getElementById("loadingPercent");
const loaderBar = document.querySelector(".loader-bar");

const audio = document.getElementById("audio");
const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const forwardButton = document.getElementById("forwardButton");
const muteButton = document.getElementById("muteButton");

const currentTimeText = document.getElementById("currentTime");
const durationText = document.getElementById("duration");

const progressContainer = document.getElementById("progressContainer");
const progressFill = document.getElementById("progressFill");
const progressDot = document.getElementById("progressDot");

const albumImage = document.getElementById("albumImage");
const equalizer = document.getElementById("equalizer");
const musicPlayer = document.querySelector(".music-player");

const bioCard = document.getElementById("bioCard");
const cursorGlow = document.querySelector(".cursor-glow");


/* ===================================
   INTRO LOADING
=================================== */

let loadingValue = 0;

const loadingInterval = setInterval(() => {

    loadingValue += Math.floor(Math.random() * 8) + 2;

    if (loadingValue >= 100) {
        loadingValue = 100;
        clearInterval(loadingInterval);

        loadingPercent.textContent = "READY";
        enterButton.classList.add("show");

        // Thử tự động phát nhạc
        tryAutoPlay();
    } else {
        loadingPercent.textContent = `${loadingValue}%`;
    }

    loaderBar.style.width = `${loadingValue}%`;

}, 100);


/* ===================================
   THỬ AUTOPLAY
=================================== */

async function tryAutoPlay() {

    try {

        audio.volume = 0.65;

        await audio.play();

        setMusicPlayingUI(true);

        // Nếu trình duyệt cho phép tự phát
        setTimeout(closeIntro, 500);

    } catch (error) {

        console.log(
            "Trình duyệt đã chặn autoplay. Hãy bấm Enter Bio."
        );

    }

}


/* ===================================
   ENTER BIO
=================================== */

enterButton.addEventListener("click", async () => {

    try {

        audio.volume = 0.65;
        await audio.play();

        setMusicPlayingUI(true);

    } catch (error) {

        console.error("Không thể phát nhạc:", error);

    }

    closeIntro();

});


function closeIntro() {

    intro.classList.add("hidden");

    document.body.classList.add("bio-loaded");

}


/* ===================================
   PARTICLES
=================================== */

tsParticles.load("particles", {

    fullScreen: {
        enable: false
    },

    background: {
        color: {
            value: "transparent"
        }
    },

    fpsLimit: 120,

    detectRetina: true,

    particles: {

        number: {
            value: 58,

            density: {
                enable: true,
                area: 800
            }
        },

        color: {
            value: [
                "#ff0015",
                "#9b000d",
                "#ffffff"
            ]
        },

        shape: {
            type: "circle"
        },

        opacity: {
            value: {
                min: 0.12,
                max: 0.65
            },

            animation: {
                enable: true,
                speed: 0.7,
                minimumValue: 0.1,
                sync: false
            }
        },

        size: {
            value: {
                min: 1,
                max: 3
            }
        },

        links: {
            enable: true,
            distance: 130,
            color: "#ff0015",
            opacity: 0.14,
            width: 1
        },

        move: {
            enable: true,
            speed: 0.7,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
                default: "out"
            }
        }
    },

    interactivity: {

        detectsOn: "window",

        events: {

            onHover: {
                enable: true,
                mode: "grab"
            },

            onClick: {
                enable: true,
                mode: "push"
            },

            resize: true
        },

        modes: {

            grab: {
                distance: 145,

                links: {
                    opacity: 0.55
                }
            },

            push: {
                quantity: 3
            }
        }
    }

});


/* ===================================
   CHUYỂN ĐỔI THỜI GIAN
=================================== */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;

}


/* ===================================
   THÔNG TIN BÀI NHẠC
=================================== */

audio.addEventListener("loadedmetadata", () => {

    durationText.textContent = formatTime(audio.duration);

});


audio.addEventListener("timeupdate", () => {

    currentTimeText.textContent = formatTime(audio.currentTime);

    if (!audio.duration) {
        return;
    }

    const progress =
        (audio.currentTime / audio.duration) * 100;

    progressFill.style.width = `${progress}%`;
    progressDot.style.left = `${progress}%`;

});


/* ===================================
   PLAY / PAUSE
=================================== */

playButton.addEventListener("click", async () => {

    if (audio.paused) {

        try {
            await audio.play();
            setMusicPlayingUI(true);
        } catch (error) {
            console.error(error);
        }

    } else {

        audio.pause();
        setMusicPlayingUI(false);

    }

});


audio.addEventListener("play", () => {
    setMusicPlayingUI(true);
});


audio.addEventListener("pause", () => {
    setMusicPlayingUI(false);
});


function setMusicPlayingUI(isPlaying) {

    const playIcon = playButton.querySelector("i");

    if (isPlaying) {

        playIcon.className = "fa-solid fa-pause";

        albumImage.classList.add("rotating");
        equalizer.classList.add("active");
        musicPlayer.classList.add("playing");

    } else {

        playIcon.className = "fa-solid fa-play";

        albumImage.classList.remove("rotating");
        equalizer.classList.remove("active");
        musicPlayer.classList.remove("playing");

    }

}


/* ===================================
   RESTART VÀ FORWARD
=================================== */

restartButton.addEventListener("click", () => {

    audio.currentTime = 0;

    if (audio.paused) {
        audio.play();
    }

});


forwardButton.addEventListener("click", () => {

    audio.currentTime = Math.min(
        audio.currentTime + 10,
        audio.duration || audio.currentTime + 10
    );

});


/* ===================================
   MUTE
=================================== */

muteButton.addEventListener("click", () => {

    audio.muted = !audio.muted;

    const icon = muteButton.querySelector("i");

    icon.className = audio.muted
        ? "fa-solid fa-volume-xmark"
        : "fa-solid fa-volume-high";

});


/* ===================================
   CLICK VÀO THANH TIẾN TRÌNH
=================================== */

progressContainer.addEventListener("click", event => {

    if (!audio.duration) {
        return;
    }

    const rect =
        progressContainer.getBoundingClientRect();

    const clickPosition =
        event.clientX - rect.left;

    const percentage =
        clickPosition / rect.width;

    audio.currentTime =
        percentage * audio.duration;

});


/* ===================================
   ÁNH SÁNG THEO CHUỘT
=================================== */

window.addEventListener("pointermove", event => {

    cursorGlow.animate(
        {
            left: `${event.clientX}px`,
            top: `${event.clientY}px`
        },
        {
            duration: 500,
            fill: "forwards"
        }
    );

});


/* ===================================
   CARD REACTIVE THEO CHUỘT
=================================== */

bioCard.addEventListener("pointermove", event => {

    const rect = bioCard.getBoundingClientRect();

    const mouseX =
        event.clientX - rect.left;

    const mouseY =
        event.clientY - rect.top;

    const percentX =
        (mouseX / rect.width) * 100;

    const percentY =
        (mouseY / rect.height) * 100;

    bioCard.style.setProperty(
        "--mouse-x",
        `${percentX}%`
    );

    bioCard.style.setProperty(
        "--mouse-y",
        `${percentY}%`
    );

    // Hiệu ứng nghiêng nhẹ
    const rotateY =
        (mouseX / rect.width - 0.5) * 3;

    const rotateX =
        (0.5 - mouseY / rect.height) * 2;

    bioCard.style.transform =
        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;

});


bioCard.addEventListener("pointerleave", () => {

    bioCard.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0)";

});


/* ===================================
   DỪNG HIỆU ỨNG KHI TAB BỊ ẨN
=================================== */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        equalizer.classList.remove("active");
        musicPlayer.classList.remove("playing");

    } else if (!audio.paused) {

        equalizer.classList.add("active");
        musicPlayer.classList.add("playing");

    }

});