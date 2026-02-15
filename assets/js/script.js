// ========= 你需要改的設定 =========
const CONFIG = {
  // 1) 活動時間（台灣時間）：yyyy-mm-ddThh:mm:ss+08:00
  eventISO: "2026-04-18T10:00:00+08:00",

  // 2) 顯示在頁面上的日期文字
  eventDateText: "2026/04/18 (Sat) 10:00",

  // 3) Google 表單連結
  googleFormURL: "https://forms.gle/PUT_YOUR_FORM_LINK_HERE",

  // 4) 圖片清單：你可以只放你有的張數
  // 若你把檔案放在 assets/images/，檔名 img_1.jpg, img_2.jpg ... 就不用再改
  images: [
    { id: "img_1", src: "assets/images/img_1.jpg" },
    { id: "img_2", src: "assets/images/img_2.jpg" },
    { id: "img_3", src: "assets/images/img_3.jpg" },
    { id: "img_4", src: "assets/images/img_4.jpg" },
    { id: "img_5", src: "assets/images/img_5.jpg" },
    { id: "img_6", src: "assets/images/img_6.jpg" },
  ],
};

// ========= 小工具 =========
const $ = (sel) => document.querySelector(sel);

function pad2(n){ return String(n).padStart(2, "0"); }

function formatCountdown(ms){
  if (ms <= 0) return "已開始";
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const hh = Math.floor((sec % 86400) / 3600);
  const mm = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  return `${days} 天 ${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
}

// ========= 倒數 =========
function startCountdown(){
  const el = $("#countdownValue");
  const eventMs = new Date(CONFIG.eventISO).getTime();

  const tick = () => {
    const now = Date.now();
    el.textContent = formatCountdown(eventMs - now);
  };

  tick();
  setInterval(tick, 1000);
}

// ========= 圖片載入 =========
function loadImages(){
  for (const item of CONFIG.images){
    const img = document.getElementById(item.id);
    if (!img) continue;
    img.src = item.src;
  }
}

// ========= RSVP 按鈕 =========
function setupRSVP(){
  const btn = $("#rsvpBtn");
  btn.href = CONFIG.googleFormURL;
}

// ========= 顯示文字 =========
function setupText(){
  $("#eventDateText").textContent = CONFIG.eventDateText;
  $("#yearNow").textContent = String(new Date().getFullYear());
}

// ========= BGM（常駐） =========
// 注意：多數手機瀏覽器會阻擋「未經互動」的自動播放
function setupBGM(){
  const audio = $("#bgm");
  const btnPlay = $("#btnPlay");
  const btnMute = $("#btnMute");

  // Restore state
  const savedMuted = localStorage.getItem("bgm_muted");
  const savedVol = localStorage.getItem("bgm_vol");
  const savedWasPlaying = localStorage.getItem("bgm_playing");

  if (savedVol !== null) audio.volume = Math.min(1, Math.max(0, Number(savedVol)));
  audio.muted = savedMuted === "1";

  const updateUI = () => {
    btnPlay.textContent = audio.paused ? "▶︎ 播放" : "⏸ 暫停";
    btnMute.textContent = audio.muted ? "🔇 靜音" : "🔊 音量";
  };

  btnPlay.addEventListener("click", async () => {
    try{
      if (audio.paused) {
        await audio.play();
        localStorage.setItem("bgm_playing", "1");
      } else {
        audio.pause();
        localStorage.setItem("bgm_playing", "0");
      }
    }catch(e){
      // Auto-play blocked; user can try again
      console.warn("Audio play blocked:", e);
    }
    updateUI();
  });

  btnMute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    localStorage.setItem("bgm_muted", audio.muted ? "1" : "0");
    updateUI();
  });

  audio.addEventListener("volumechange", () => {
    localStorage.setItem("bgm_vol", String(audio.volume));
  });

  // Try resume if previously playing (may still be blocked until user taps)
  if (savedWasPlaying === "1") {
    audio.play().then(() => {
      updateUI();
    }).catch(() => {
      updateUI();
    });
  } else {
    updateUI();
  }
}

// ========= Init =========
document.addEventListener("DOMContentLoaded", () => {
  setupText();
  setupRSVP();
  loadImages();
  startCountdown();
  setupBGM();
});
