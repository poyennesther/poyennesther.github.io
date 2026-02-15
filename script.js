document.addEventListener('DOMContentLoaded', () => {
    // 1. 設定婚禮日期：2026年4月18日 上午 10:00:00
    const weddingDate = new Date('2026-04-18T10:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.querySelector(".big-countdown").innerHTML = "We are Married!";
            // 隱藏底部 RSVP 區塊 (可選)
            // document.querySelector(".sticky-footer").style.display = "none";
            return;
        }

        // 計算天、時、分、秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 更新頁面中間的大倒數 (包含秒)
        const bigDays = document.getElementById("big-days");
        if(bigDays) {
            document.getElementById("big-days").innerText = String(days).padStart(2, '0');
            document.getElementById("big-hours").innerText = String(hours).padStart(2, '0');
            document.getElementById("big-mins").innerText = String(minutes).padStart(2, '0');
            document.getElementById("big-secs").innerText = String(seconds).padStart(2, '0');
        }
    }

    // 每秒更新
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 音樂播放邏輯
    const musicBtn = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    let isPlaying = false;

    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            audio.play().catch(() => {});
            isPlaying = true;
            musicBtn.classList.add('playing');
        }
    }, { once: true });

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
        } else {
            audio.play();
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // 滾動動畫 Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});