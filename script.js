// ライブ切り替え
function setLiveUrl(liveId) {
    document.getElementById('youtubeLive').src = `https://www.youtube.com/embed/${liveId}?autoplay=1`;
}

// ハンバーガーメニュー開閉
const hamburger = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// ダークモード切替
const toggleBtn = document.getElementById('toggleTheme');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        toggleBtn.textContent = "デフォルトに戻す";
    } else {
        toggleBtn.textContent = "ダークモード";
    }
});
