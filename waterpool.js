const closeButtons = document.querySelectorAll('.closeOverlay');
const pickBottle = document.getElementById('pickBottle');
const releaseBottle = document.getElementById('releaseBottle');

// 撈瓶子
const apiBaseUrl = 'http://localhost:8080'; // API 根網址 ＃要改
/*--------撈瓶子---------*/

pickBottle.addEventListener('click', async event => {
    try {
        const response = await fetch(`${apiBaseUrl}/show`);
        const result = await response.json();

        const dataList = document.getElementById('bottleContent');
        dataList.innerHTML = ''; // 清空舊資料
        /*--------等瓶子格式確定後再修改---------------*/
        if (result.data && result.data.length > 0) {
            // 隨機選擇一個項目
            const randomIndex = Math.floor(Math.random() * result.data.length);
            const randomItem = result.data[randomIndex];

            // 創建並顯示隨機選擇的項目
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>BottleID:</strong> ${randomItem.BottleID}<br>
                <strong>UserID:</strong> ${randomItem.UserID}<br>
                <strong>Content:</strong> ${randomItem.Content}<br>
                <strong>CreatedAt:</strong> ${new Date(randomItem.CreatedAt).toLocaleString()}
            `;
            dataList.appendChild(listItem);}
        else {
            dataList.innerHTML = '<li>水裡空空的>w<</li>';
        }
    } 
        catch (error) {
            console.error('Error fetching data:', error);
            alert('獲取資料失敗');
        }
        event.preventDefault(); // 阻止默認跳轉行為
        const targetLayer = document.getElementById(`pickbox`); // 找到對應的遮罩層
        targetLayer.classList.remove('hidden'); // 顯示對應遮罩層
    });

// 撈取新聞
/*async function fetchNews() {
    const newsContent = document.getElementById("news-content");

    // 檢查 news-content 是否存在
    if (!newsContent) {
        console.error("找不到 #news-content 元素！");
        return;
    }

    // 顯示載入中的提示
    newsContent.innerHTML = "<p>載入中...</p>";
    newsContent.style.display = "block"; // 顯示元素

    try {
        // 發送請求到 NewsAPI
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=tw&apiKey=3d29c7d7f9304476afaa830b7d888dad`);
        
        // 檢查 HTTP 響應是否成功
        if (!response.ok) {
            throw new Error(`HTTP 錯誤: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'ok' && data.totalResults > 0) {
            // 隨機選擇一則新聞
            const randomIndex = Math.floor(Math.random() * data.articles.length);
            const article = data.articles[randomIndex];

            // 顯示新聞內容
            const newsContentHTML = `
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">閱讀更多</a>
            `;
            newsContent.innerHTML = newsContentHTML;
        } else {
            newsContent.innerHTML = "<p>目前沒有可用的新聞，請稍後再試。</p>";
        }
    } catch (error) {
        console.error('發生錯誤:', error);
        newsContent.innerHTML = "<p>發生錯誤，請稍後再試。</p>";
    }
}*/

// 撈瓶子按鈕
pickBottle.addEventListener('click', event => {
    event.preventDefault(); // 阻止默認行為
    console.log('撈瓶子按鈕被點擊');
    const targetLayer = document.getElementById(`pickbox`); // 找到對應的遮罩層
    targetLayer.classList.remove('hidden'); // 顯示對應遮罩層
    fetchNews();  // 撈取新聞
});

/*--------丟瓶子---------*/

const addData = async () => {
    const UserID = 1; // 使用者ID，根據實際情況獲取   #要修改
    const Content = document.getElementById('bottletext_input').value;

    try {
        const response = await fetch(`${apiBaseUrl}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserID, Content })
        });

        const result = await response.json();
        console.log('Response:', response.status, result);//debug
        if (response.ok) {
            alert(result.message);
        }
        else {
            alert(result.message); // 禁用字錯誤或其他問題
            document.getElementById('errorMessage').textContent = result.message;
        }
    } 
    catch (error) {
        console.error('Error:', error);
        alert('提交失敗，請再試一次。');
    }
};
//提交表單（漂流瓶）
const text_buttom = document.getElementById('text_buttom');
text_buttom.addEventListener('click', event => { 
    addData(); 
});

releaseBottle.addEventListener('click', event => {
    event.preventDefault();
    const targetLayer = document.getElementById(`releasebox`);
    targetLayer.classList.remove('hidden');
});

// 點擊關閉按鈕
closeButtons.forEach(button => {
    button.addEventListener('click', event => {
        const overlay = event.target.closest('.overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    });
});

const poolLinks = document.querySelectorAll('.pool-option[data-pool]');

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

// 顯示幸運河的詩籤結果
document.querySelector("#waterLayer_fortune .releaseBottle").addEventListener("click", async function () {
    try {
        // 讀取詩籤資料
        const response = await fetch("poems.json");
        if (!response.ok) throw new Error("無法載入詩籤檔案");

        const poems = await response.json();

        // 隨機抽取一條詩籤
        const poemKeys = Object.keys(poems);
        const randomKey = poemKeys[Math.floor(Math.random() * poemKeys.length)];
        const randomPoem = poems[randomKey];

        // 美化框框內顯示詩籤內容
        const bottleContent = document.querySelector("#waterLayer_fortune .poem-overlay");
        bottleContent.innerHTML = `
            <h4>詩籤內容</h4>
            <p id = "lucky"><strong></strong>${randomPoem.吉凶}</p>
            <p id = "poem"><strong></strong>${randomPoem.詩籤}</p>
            <hr>
            <p id = "ex"><strong></strong>${randomPoem.解釋}</p>
            <p id = "content"><strong>願望：</strong>${randomPoem.願望}</p>
            <p id = "content"><strong>疾病：</strong>${randomPoem.疾病}</p>
            <p id = "content"><strong>盼望的人：</strong>${randomPoem.盼望的人}</p>
            <p id = "content"><strong>遺失物：</strong>${randomPoem.遺失物}</p>
            <p id = "content"><strong>蓋新居：</strong>${randomPoem.蓋新居}</p>
            <p id = "content"><strong>交往</strong>${randomPoem.交往}</p>
            <p id = "content"><strong>旅行：</strong>${randomPoem.旅行}</p>
        `;

        // 確保幸運河背景層顯示
        document.getElementById("waterLayer_fortune").classList.remove("hidden");

    } catch (error) {
        console.error("錯誤:", error);
        alert("無法載入詩籤，請稍後再試！");
    }
});
