const poolLinks = document.querySelectorAll('.pool-option[data-pool]');
const closeButtons = document.querySelectorAll('.closeOverlay');

// 當點擊水池選項時，顯示對應的水池
poolLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault(); // 阻止默認行為

        // 獲取對應的水池層ID
        const targetId = link.getAttribute('data-pool');
        const targetLayer = document.getElementById(`waterLayer_${targetId}`);

        // 隱藏所有水池層
        document.querySelectorAll('.overlay').forEach(layer => {
            layer.classList.add('hidden');
        });

        // 顯示選中的水池層
        if (targetLayer) {
            targetLayer.classList.remove('hidden');
        }
    });
});

// 點擊關閉按鈕，隱藏對應的水池層
closeButtons.forEach(button => {
    button.addEventListener('click', event => {
        const overlay = event.target.closest('.overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    });
});

// 點擊撈瓶子按鈕時，觸發撈取新聞
document.querySelectorAll(".releaseBottle").forEach(button => {
    button.addEventListener('click', function() {
        console.log("撈瓶子按鈕被點擊！");
        fetchNews();
    });
});

// News API 密鑰
const API_KEY = '3d29c7d7f9304476afaa830b7d888dad'; // 替換為您從 NewsAPI 獲得的密鑰

// 撈取今日新聞的函數
function fetchNews() {
    const newsContent = document.getElementById("news-content");
    
    // 檢查 news-content 是否存在
    if (!newsContent) {
        console.error("找不到 #news-content 元素！");
        return;
    }

    // 顯示載入中的提示
    newsContent.innerHTML = "<p>載入中...</p>";

    // 發送請求到 NewsAPI
    fetch(`https://newsapi.org/v2/top-headlines?country=tw&apiKey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === 'ok' && data.totalResults > 0) {
                const article = data.articles[0]; // 撈取最新的一則新聞
                const newsContentHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">閱讀更多</a>
                `;
                newsContent.innerHTML = newsContentHTML;
            } else {
                newsContent.innerHTML = "<p>目前沒有可用的新聞，請稍後再試。</p>";
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContent.innerHTML = "<p>發生錯誤，請稍後再試。</p>";
        });
}

const newsContent = document.getElementById("news-content");
newsContent.style.display = "none"; // 隱藏元素
