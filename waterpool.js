const pickBottle = document.getElementById('pickBottle');
const releaseBottle = document.getElementById('releaseBottle');
const apiBaseUrl = 'http://localhost:8080'; // API 根網址 ＃要改
// 撈瓶子按鈕
pickBottle.addEventListener('click', event => {
    event.preventDefault(); // 阻止默認行為
    console.log('撈瓶子按鈕被點擊');
    const targetLayer = document.getElementById(`pickbox`); // 找到對應的遮罩層
    targetLayer.classList.remove('hidden'); // 顯示對應遮罩層
});
/*--------主頁丟瓶子---------*/

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

/*-----------關閉按鈕-----------*/
const closeButtons = document.querySelectorAll('.closeOverlay');
const closeformButtons = document.querySelectorAll('.formcloseOverlay');
// 點擊關閉按鈕
closeButtons.forEach(button => {
    button.addEventListener('click', event => {
        const overlay = event.target.closest('.overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            const inlay = overlay.querySelector('.news-container'); // 直接抓取
            if (inlay) {
                inlay.classList.add('hiddenForInner');
            }
            inlay.innerHTML = ''; // 清空內容
        }
    });
});
// 點擊主頁丟瓶子的關閉按鈕
closeformButtons.forEach(button => {
    button.addEventListener('click', event => {
        const overlay = event.target.closest('.overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        
    });
});
/*-------------側邊欄點擊-----------*/
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
//
//
//以下是各個分區的設定
//
//
/*-------------新聞--------------*/
function fetchNews() {
    // 直接使用 NewsAPI 的 HTTP 請求，而不是 require
    const apiKey = 'f076c58eb1d24bf18489cc021bf02feb'; // 你的 NewsAPI API 金鑰
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
  
    // 格式化日期
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    // 定義隨機關鍵字陣列
    const keywords = ['政治', '社會', '財經', '生活', '影視', '體育', '金融'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  
    // 使用 fetch 發送 HTTP 請求
    const url = `https://newsapi.org/v2/everything?q=${randomKeyword}&language=zh&from=${formatDate(lastWeek)}&to=${formatDate(today)}&pageSize=1&apiKey=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(responseData => {
        if (responseData && responseData.articles && responseData.articles.length > 0) {
          const article = responseData.articles[0]; // 只取得第一篇文章
          const title = article.title;
          const description = article.description;
  
          const newsContent = document.getElementById('newsContent');
          newsContent.innerHTML = ''; // 清空內容
          newsContent.innerHTML = `
            <p class = "content" id = "title">${title}</p>
            <p class = "content">${description}</p>
          `;
        } else {
          alert('未找到任何文章');
        }
      })
      .catch(error => {
        console.error('無法取得新聞資料:', error.message);
        alert('無法取得新聞資料');
      });
  }
  
  
ToDaybutton.addEventListener('click', async event => {
    fetchNews();
    const InnerLayer = document.getElementById(`newsContent`); // 找到對應的遮罩層
    InnerLayer.classList.remove('hiddenForInner'); // 顯示對應遮罩層
});
/*-----------幸運河---------------*/
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
        const bottleContent = document.querySelector("#waterLayer_fortune .news-container");
        bottleContent.innerHTML = `
            <h4>詩籤內容</h4>
            <p id = "lucky"><strong></strong>${randomPoem.吉凶}</p>
            <p id = "poem"><strong></strong>${randomPoem.詩籤}</p>
            <hr>
            <p id = "ex"><strong></strong>${randomPoem.解釋}</p>
            <p class = "content"><strong>願望：</strong>${randomPoem.願望}</p>
            <p class = "content"><strong>疾病：</strong>${randomPoem.疾病}</p>
            <p class = "content"><strong>盼望的人：</strong>${randomPoem.盼望的人}</p>
            <p class = "content"><strong>遺失物：</strong>${randomPoem.遺失物}</p>
            <p class = "content"><strong>蓋新居：</strong>${randomPoem.蓋新居}</p>
            <p class = "content"><strong>交往：</strong>${randomPoem.交往}</p>
            <p class = "content"><strong>旅行：</strong>${randomPoem.旅行}</p>
        `;

        // 確保幸運河背景層顯示
        document.getElementById("waterLayer_fortune").classList.remove("hidden");

    } catch (error) {
        console.error("錯誤:", error);
        alert("無法載入詩籤，請稍後再試！");
    }
    const InnerLayer = document.getElementById(`luckyContent`); // 找到對應的遮罩層
    InnerLayer.classList.remove('hiddenForInner'); // 顯示對應遮罩層
});
/*
function randomizeImages() {
    const container = document.getElementById('imageContainer');
    const images = container.querySelectorAll('img');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    images.forEach(img => {
      const randomX = Math.random() * (containerWidth - 100); // 隨機 x 位移
      const randomY = Math.random() * (containerHeight - 200); // 隨機 y 位移
      img.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
    });
  }
  // 當頁面載入完成後隨機排列圖片
  window.onload = randomizeImages;
*/
  /*--------漂流瓶撈瓶子---------*/
const bottleButton = document.getElementById('bottleButton');
bottleButton.addEventListener('click', async event => {
    event.preventDefault(); // 阻止默認跳轉行為
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
            const InnerLayer = document.getElementById('bottleContent');
            InnerLayer.innerHTML ='';
            InnerLayer.innerHTML = `
                <p class = "content"> ${randomItem.Content}</p>
                <p class = "content"> ${new Date(randomItem.CreatedAt).toLocaleString()}<p>
            `;
           }
        else {
            dataList.innerHTML = '<li>水裡空空的>w<</li>';
        }
        const InnerLayer = document.getElementById(`bottleContent`); // 找到對應的遮罩層
        InnerLayer.classList.remove('hiddenForInner'); // 顯示對應遮罩層
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        alert('獲取資料失敗');
    }
    });
