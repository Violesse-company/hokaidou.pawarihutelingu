// rireki.html用のアーカイブ再生
document.addEventListener('DOMContentLoaded', () => {
    const videoItems = document.querySelectorAll('.video-item');
    const player = document.getElementById('archivePlayer');

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            // 動画再生部分までスクロール
            window.scrollTo({ top: player.offsetTop, behavior: 'smooth' });
        });
    });
});
