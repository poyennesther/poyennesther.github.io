document.addEventListener('DOMContentLoaded', () => {
    // 1. 設置婚禮日期
    const weddingDate = new Date('2026-04-18T00:00:00').getTime();

    // 2. 倒數計時功能
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById("timer").innerHTML = "我們結婚了！";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // 如果需要分秒，可以自行取消註解並修改 HTML
        // const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 3. 音樂播放控制
    const musicBtn = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    let isPlaying = false;

    // 嘗試自動播放 (大部分瀏覽器會阻擋，需要使用者互動)
    document.body.addEventListener('click', function() {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(e => console.log("等待使用者互動播放音樂"));
        }
    }, { once: true }); // 只觸發一次

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止觸發上面的 body click
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
        } else {
            audio.play();
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // 4. 滾動淡入效果 (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });
});