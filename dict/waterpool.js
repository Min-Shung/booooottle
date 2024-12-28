const pickBottle = document.getElementById('pickBottle');
const releaseBottle = document.getElementById('releaseBottle');
const today = new Date().toISOString().split('T')[0];
const apiBaseUrl = 'https://final-proj-w8vi.onrender.com'; // API 根網址 ＃要改
//信箱
    const mailbox = document.getElementById('mailbox');
    const mailindex = document.getElementById('mailindex');
    const closeBottum = document.getElementById('mailclose');
    mailbox.addEventListener('click', () => {
        mailindex.classList.remove('hidden');
    });
    closeBottum.addEventListener('click', () => {
        mailindex.classList.add('hidden');
    });

// 撈瓶子按鈕
pickBottle.addEventListener('click', event => {
    event.preventDefault(); // 阻止默認行為
    console.log('撈瓶子按鈕被點擊');
    const targetLayer = document.getElementById(`pickbox`); // 找到對應的遮罩層
    targetLayer.classList.remove('hidden'); // 顯示對應遮罩層
});
/*--------登入註冊--------*/
document.getElementById('loginButton').addEventListener('click', function () {
    // 跳轉新視窗到 sign.html
    window.open('login/sign.html', '_self');
});
let username = localStorage.getItem('username'); // 宣告全域變數
document.addEventListener('DOMContentLoaded', () => {
    username = localStorage.getItem('username'); // 從 localStorage 獲取用戶名稱
    const loginButton = document.getElementById('loginButton'); 
    if (username) {
        // 如果有用戶名稱，更新按鈕文字
        loginButton.textContent = `歡迎，${username}`;
    }
});
/*--------主頁丟瓶子---------*/
const addData = async () => {
    try {
        const UserID = localStorage.getItem('userid');; // 使用者ID，根據實際情況獲取
        const Content = document.getElementById('bottletext_input').value;
        const response = await fetch(`${apiBaseUrl}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserID, Content })
        });

        const result = await response.json();
        console.log('Response:', response.status, result);//debug
        if (response.ok) {
            showPop("提交成功");
            releaseClick.count++;
            const releasetime = RELEASE_LIMIT - releaseClick.count;
            localStorage.setItem('releaseTime', JSON.stringify(releaseClick));
            setTimeout(() => {
                showPop(`今日丟瓶子次數：${releaseClick.count} ，剩餘次數：${releasetime}`);
            },900);
            setTimeout(() => {
                document.getElementById('bottletext_input').value = '';
            }, 1000);
        }
        else {
            showPop(result.message); // 禁用字錯誤或其他問題
        }
    } 
    catch (error) {
        console.error('Error:', error);
        showPop('提交失敗，請再試一次。');
    }
};


//提交表單（漂流瓶）
const text_buttom = document.getElementById('text_buttom');
text_buttom.addEventListener('click', event => { 
    event.preventDefault(); 
    if (releaseClick.count >= RELEASE_LIMIT) {
        showPop("今日丟瓶子次數已達上限！");
        return;
    }

    // 禁用按鈕以防止多次提交
    text_buttom.disabled = true;

    // 嘗試提交資料
    addData();

    // 恢復按鈕啟用
    setTimeout(() => {
    text_buttom.disabled = false;
    }, 1000); 
});
const RELEASE_LIMIT = 1;
const todaytime = new Date().toISOString().split('T')[0]; // 獲取當天日期（YYYY-MM-DD 格式）
let releaseClick = JSON.parse(localStorage.getItem('releaseTime')) || { count: 0, date: "" };

// 檢查日期是否過期，重置計數
if (releaseClick.date !== todaytime) {
    releaseClick = { count: 0, date: todaytime };
    localStorage.setItem('releaseTime', JSON.stringify(releaseClick));
}

releaseBottle.addEventListener('click', event => {
    const username = localStorage.getItem('username'); 
    if (!username) {
        showPop("請先登入！");
        return;
    }

    if (releaseClick.count < RELEASE_LIMIT) {
        event.preventDefault();
        releaseClick.count++; // 更新計數
        localStorage.setItem('releaseTime', JSON.stringify(releaseClick)); // 儲存到 LocalStorage
        
        const targetLayer = document.getElementById('releasebox');
        targetLayer.classList.remove('hidden');
    } else {
        showPop("今日丟瓶子次數已達上限！");
    }
});


/*-----------關閉按鈕-----------*/
const closeButtons = document.querySelectorAll('.closeOverlay');
const closeformButtons = document.querySelectorAll('.formcloseOverlay');
// 點擊關閉按鈕
closeButtons.forEach(button => {
    button.addEventListener('click', event => {
        const overlay = event.target.closest('.overlay');
        const bottleImage = overlay.querySelector('.bottle');
        if (bottleImage) {
            bottleImage.style.display = 'block'; // 恢復瓶子的顯示
            bottleImage.dataset.used = 'false'; // 重置瓶子的狀態
        }
        if (overlay) {
            overlay.classList.add('hidden');
            const inlay = overlay.querySelector('.news-container'); // 直接抓取
            if (inlay) {
                inlay.classList.add('hiddenForInner');
                inlay.classList.remove('show');
                inlay.innerHTML = ''; // 清空內容
            }
            
        }
    });
});
// 點擊主頁丟瓶子的關閉按鈕
closeformButtons.forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault(); 
        const overlay = event.target.closest('.overlay');
        console.log('關閉按鈕被點擊');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    });
});
/*--------------瓶子動畫------------*/

function bottleback() {
    const todaybotimg = document.getElementById('todaybot');
    const poembotimg = document.getElementById('poembot');
    const thebotimg = document.getElementById('thebot');
    const devbotimg = document.getElementById('devbot');
    todaybotimg.style.display = 'block';
    poembotimg.style.display = 'block';
    thebotimg.style.display = 'block';
    devbotimg.style.display = 'block';
}
async function bottleshack(layerid,bottleid,contentid) {
    const waterLayerToday = document.getElementById(layerid);
    const bottleImage = document.getElementById(bottleid);
    const newsContent = document.getElementById(contentid);
    if (!waterLayerToday || !bottleImage || !newsContent) return;
    // 撈瓶子的動畫效果
    newsContent.classList.add('hiddenForInner');
    waterLayerToday.classList.add('shake'); // 啟動動畫
    void waterLayerToday.offsetWidth; // 強制瀏覽器重新渲染

    // 設定動畫結束後的動作
    waterLayerToday.addEventListener('animationend', () => {
        if (bottleImage) bottleImage.style.display = 'none'; // 隱藏瓶子
        newsContent.classList.remove('hiddenForInner');
        newsContent.classList.add('show'); // 顯示新聞內容
        
        // 移除動畫類，重置狀態
        waterLayerToday.classList.remove('shake');
        bottleImage.style.transform = ''; // 重置transform样式
    }, { once: true }); // 確保事件只觸發一次
}

/*-------------側邊欄點擊-----------*/
const poolLinks = document.querySelectorAll('.pool-option[data-pool]');

// 當點擊水池選項時，顯示對應的水池
poolLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault(); // 阻止默認行為
            const username = localStorage.getItem('username');
            if (!username) {
                showPop("請先登入！");
                return;
            }
            else{
                if (releaseClick.count < RELEASE_LIMIT) {
                    const targetLayer = document.getElementById(`releasebox`);
                    targetLayer.classList.remove('hidden');
                }
                
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
                const bottleImage = targetLayer.querySelector('.bottle');
                if (bottleImage) {
                    bottleImage.style.display = 'block'; // 瓶子顯示
                    bottleImage.dataset.used = 'false'; // 重置狀態
                }
            }
        }
    });
});
//
//
//以下是各個分區的設定
//
//
/*-------------今日--------------*/
/*-------------新聞--------------*/
async function fetchNews(contentId) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/news`); // 修改成後端的 URL
        const article = await response.json();
        const newsContent = document.getElementById(contentId);

        if (article && article.title && article.description) {
            newsContent.innerHTML = `
                <p class="content" id="title">${article.title}</p>
                <hr>
                <p class="content">${article.description}</p>
            `;
        } else {
            newsContent.innerHTML = `<p class="content">No news available</p>`;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        const newsContent = document.getElementById(contentId);
        newsContent.innerHTML = `<p class="content">Error loading news</p>`;
    }
}
/*-------------KKBOX--------------*/
async function fetchKKBOX(contentid){
    const today = new Date();
    const year = today.getFullYear();
    const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day-2}`;
    };
    const formatDateforweek = (date) => {
        const dayOfWeek = date.getDay();
        const daysToSunday =  dayOfWeek >= 4 ? dayOfWeek - 4 + 7 : dayOfWeek + 3;  
        date.setDate(date.getDate() - daysToSunday);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const theyear = new Date().getFullYear();
    const category = [297, 390, 308];
    let songlanguage;
    const randomcategory = category[Math.floor(Math.random() * category.length)];
    const language = randomcategory === 297 ? '華語' : randomcategory === 308 ? '日語' : '西洋';
    const rankType = Math.floor(Math.random() * 3);
    let type='daily';
    let date=formatDate(today) ;
    let rankname="日";

    if (rankType === 1) {
        type = 'weekly';
        date = formatDateforweek(today);
        rankname="週";
    } else if (rankType === 2){
        type = 'yearly';
        date = year;
        rankname="年度";
    }
    const apiUrl = `${apiBaseUrl}/proxy?type=${type}&category=${randomcategory}&date=${date}&year=${year}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(responseData => {
            const newReleases = responseData.data.charts.newrelease;
            const newsContent = document.getElementById(contentid);
            newsContent.innerHTML = ''; // 清空內容
            const displayMode = Math.random() < 0.5 ? 0 : 1;
            if (displayMode === 0) {
                let topthree=`<p style="font-size: 26px; font-weight: bold;">${language}本${rankname}排行榜</p><hr>`;
                newReleases.slice(0, 3).forEach(release => {
                    const songName = release.song_name;
                    const artistName = release.artist_name;
                    const thisPeriod = release.rankings.this_period;
                    const lastPeriod = release.rankings.last_period;
                    topthree+=`
                    <p><strong>歌名:</strong>${songName}</p>
                    <p><strong>歌手:</strong>${artistName}</p>
                    <p><strong>本${rankname}排名:</strong>${thisPeriod}</p>
                    <p><strong>上${rankname}排名:</strong>${lastPeriod}</p>
                    <p>------</p>`
                });
            newsContent.innerHTML =topthree;
            }
            else{
                const randomIndex = Math.floor(Math.random() * newReleases.length);
                const randomRelease = newReleases[randomIndex];
                const songName = randomRelease.song_name;
                const artistName = randomRelease.artist_name;
                const albumName = randomRelease.album_name;
                const coverimage = randomRelease.cover_image.small;
                const songurl=randomRelease.song_url;
                const thisPeriod = randomRelease.rankings.this_period;
                newsContent.innerHTML = `
                <p style="font-size: 26px; font-weight: bold;" >${language}本${rankname}排行榜隨機推薦</p><hr>
                <p><strong>歌名:</strong><a href="${songurl}" target="_blank">${songName}</a></p>
                <p><strong>歌手:</strong>${artistName}</p>
                <p><strong>專輯:</strong>${albumName}</p>
                <p><strong>本${rankname}排名:</strong>${thisPeriod}</p>
                <img src="${coverimage}" alt="${songName}" style="width: 100px; height: auto; margin-bottom: 10px;">
                `
            }
    })
}
const newsContent = document.getElementById('newsContent');
const ToDaybutton=document.getElementById('ToDaybutton');
ToDaybutton.addEventListener('click', async event => {
    const bottleImage = document.getElementById('todaybot');
    if (bottleImage.dataset.used === 'true') return;
    
    await bottleshack("waterLayer_today","todaybot","newsContent");
    // 這裡可以根據隨機決定要顯示哪一個內容（新聞或KKBOX）
    const randomtoday = Math.random();
    if (randomtoday < 0.5) await fetchNews("newsContent");
    else await fetchKKBOX("newsContent");
    const InnerLayer = document.getElementById(`newsContent`); // 找到對應的遮罩層
    InnerLayer.classList.remove('hiddenForInner'); // 顯示對應遮罩層
});

/*-----------幸運河---------------*/
// 顯示幸運河的詩籤結果
let luckyData = JSON.parse(localStorage.getItem('LuckyClickTime')) || { count: 0, date: "" };
if (luckyData.date !== today) {
    luckyData = { count: 0, date: today };
  }
let luckystorage='';
const luckybuttom=document.getElementById('luckybuttom');
luckybuttom.addEventListener('click', async event => {
    if (luckyData.count===0) {
        const bottleImage = document.getElementById('poembot');
        if (bottleImage.dataset.used === 'true') return;
        await bottleshack("waterLayer_fortune", "poembot", "luckyContent");
        try {
            // 讀取詩籤資料
            const response = await fetch("../src/poems.json");
            if (!response.ok) throw new Error("無法載入詩籤檔案");

            const poems = await response.json();
            console.log("詩籤資料：", poems);

            // 權重設定
            const weightMap = { "大吉": 9, "中吉": 20, "小吉": 20, "吉": 30, "小凶": 18, "凶": 3 };
            const weightedPool = [];
            for (const [key, weight] of Object.entries(weightMap)) {
                for (let i = 0; i < weight; i++) {
                    weightedPool.push(key);
                }
            }

            // 從權重池中隨機選擇
            const randomCategory = weightedPool[Math.floor(Math.random() * weightedPool.length)];
            console.log("隨機類別：", randomCategory);

            // 選取符合該類別的詩籤
            const filteredPoems = Object.values(poems).filter(
                poem => typeof poem === "object" && poem.吉凶 === randomCategory
            );

            if (filteredPoems.length === 0) {
                throw new Error(`無符合的詩籤類別：${randomCategory}`);
            }

            const randomPoem = filteredPoems[Math.floor(Math.random() * filteredPoems.length)];
            if (!randomPoem) {
                throw new Error("無法選取隨機詩籤");
            }

            // 顯示詩籤內容
            const luckyContent = document.getElementById('luckyContent');
            luckyContent.innerHTML='';
            luckystorage=`
                <h4>詩籤內容</h4>
                <p id="lucky"><strong></strong>${randomPoem.吉凶}</p>
                <p id="poem"><strong></strong>${randomPoem.詩籤}</p>
                <hr>
                <p id="ex"><strong></strong>${randomPoem.解釋}</p>
                <p class="content"><strong>願望：</strong>${randomPoem.願望}</p>
                <p class="content"><strong>疾病：</strong>${randomPoem.疾病}</p>
                <p class="content"><strong>盼望的人：</strong>${randomPoem.盼望的人}</p>
                <p class="content"><strong>遺失物：</strong>${randomPoem.遺失物}</p>
                <p class="content"><strong>蓋新居：</strong>${randomPoem.蓋新居}</p>
                <p class="content"><strong>交往：</strong>${randomPoem.交往}</p>
                <p class="content"><strong>旅行：</strong>${randomPoem.旅行}</p>
            `
            luckyContent.innerHTML += luckystorage ;
            luckyData.count = 1;
            localStorage.setItem('luckystorage', luckystorage);
        } catch (error) {
            console.error("錯誤:", error);
            alert("無法載入詩籤，請稍後再試！");
        }
    }
    else{
        showPop("今日已經撈過了～");
        const bottleImage = document.getElementById('poembot');
        if (bottleImage.dataset.used === 'true') return;
        await bottleshack("waterLayer_fortune", "poembot", "luckyContent");
        const luckyContent = document.getElementById('luckyContent');
        const storedLuckystorage = localStorage.getItem('luckystorage');
        luckyContent.innerHTML ='';
        luckyContent.innerHTML += storedLuckystorage ;
    }
    const InnerLayer = document.getElementById('luckyContent');
    InnerLayer.classList.remove('hiddenForInner');
});

/*--------漂流瓶撈瓶子---------*/
const DAILY_LIMIT = 6;
let clickData = JSON.parse(localStorage.getItem('buttonClickData')) || { count: 0, date: "" };

// 檢查是否為今天，並重置次數
if (clickData.date !== today) {
  clickData = { count: 0, date: today };
}
const bottleButton = document.getElementById('bottleButton');
bottleButton.addEventListener('click', async event => {
    event.preventDefault(); // 阻止默認跳轉行為
    if (clickData.count < DAILY_LIMIT) {
        clickData.count++;
        let clicktime=DAILY_LIMIT-clickData.count;
        localStorage.setItem('buttonClickData', JSON.stringify(clickData));
        showPop(`今日撈取次數：${clickData.count} ，剩餘${clicktime}`);
        const bottleImage = document.getElementById('thebot');
        if (bottleImage.dataset.used === 'true') return;
        await bottleshack("waterLayer_bottle","thebot","bottleContent");
        try {
            const tableName = 'bottles';
            const response = await fetch(`${apiBaseUrl}/show?table=${tableName}`);
            const result = await response.json();
            const randomItem = result.data; 
            const dataList = document.getElementById('bottleContent');
            dataList.innerHTML = ''; // 清空舊資料
            if (result.data) {
                const InnerLayer = document.getElementById('bottleContent');
                InnerLayer.innerHTML ='';
                InnerLayer.innerHTML = `
                    <p class = "content"> ${randomItem.content.replace(/\n/g, '<br>')}</p>
                    <p class = "content"> ${new Date(randomItem.createdat).toLocaleString()}<p>
                    <button class="switch" id="commentbut">留言</button>
                `;
            }
            else {
                dataList.innerHTML = '<li>水裡空空的>w<</li>';
            }
            const InnerLayer = document.getElementById(`bottleContent`); // 找到對應的遮罩層
            InnerLayer.classList.remove('hiddenForInner'); // 顯示對應遮罩層
            const bottleContent = document.getElementById('bottleContent');
            const comment = document.getElementById('comment');
            const commentButton = document.getElementById('commentbut');
            const commentCloseButton = document.getElementById('commentClose');

            // 显示 comment 区域
            commentButton.addEventListener('click', () => {
                bottleContent.classList.remove('show');
                bottleContent.classList.add('hidden');

                comment.classList.remove('hidden');
                comment.classList.add('show');
            });

            // 关闭 comment 区域并返回 bottleContent
            commentCloseButton.addEventListener('click', event => {
                 event.preventDefault(); 
                 event.stopPropagation();
                comment.classList.remove('show');
                comment.classList.add('hidden');

                bottleContent.classList.remove('hidden');
                bottleContent.classList.add('show');
    });
        }
        catch (error) {
            console.error('Error fetching data:', error);
            alert('獲取資料失敗');
        }
    } 
    else {
        showPop('漂流海的撈取次數已達上限！');
      }
    });

/*--------開發碎碎念---------*/
  const devButton = document.getElementById('devButton');
  devButton.addEventListener('click', async event => {
      event.preventDefault(); // 阻止默認跳轉行為
      const bottleImage = document.getElementById('devbot');
     if (bottleImage.dataset.used === 'true') return;
     await bottleshack("waterLayer_developer","devbot","developerContent");
      try {
        const tableName = 'wtfdevelopersay';
        const response = await fetch(`${apiBaseUrl}/show?table=${tableName}`);
        const result = await response.json();
        const randomItem = result.data; 
        const dataList = document.getElementById('developerContent');
        dataList.innerHTML = ''; // 清空舊資料
              // 隨機選擇一個項目
              dataList.innerHTML = `
                  <p class="content">${randomItem.content.replace(/\n/g, '<br>')}</p>
              `;
        dataList.classList.remove('hiddenForInner'); // 顯示對應遮罩層
      } 
      catch (error) {
          console.error('Error fetching data:', error);
          alert('獲取資料失敗');
      }
      });
/*---------快速說明----------*/
const quickGuideButton = document.getElementById('sideExp');
// 快速說明的彈出框
const quickGuideOverlay = document.getElementById('quickGuideOverlay');
// 關閉按鈕
const closeQuickGuideButton = document.getElementById('formcloseOverlay');

// 顯示快速說明彈出框
quickGuideButton.addEventListener('click', () => {
    quickGuideOverlay.classList.remove('hidden');
});

// 關閉快速說明彈出框
closeQuickGuideButton.addEventListener('click', () => {
    quickGuideOverlay.classList.add('hidden');
});

/*--------主頁撈瓶子--------*/
pickBottle.addEventListener('click', async (event) => {
    event.preventDefault(); // 阻止默認行為
    const pickbox = document.getElementById("HomeContent"); // 找到 pickbox 容器
    pickbox.classList.remove('hidden'); // 顯示 pickbox
    const randombottle = Math.random();
    try {
        if (!pickbox) {
            console.error("Element with id 'pickbox' not found.");
            alert("無法顯示內容");
            return;
        }
        pickbox.innerHTML = ''; // 清空舊資料
        pickbox.classList.remove('hiddenForInner');
        pickbox.classList.add('show');
        if (randombottle < 0.35) {
            // 35% 機率抓取 News
            await fetchNews("HomeContent");
        } else if (randombottle < 0.7) {
            // 35% 機率抓取 KKBOX
            await fetchKKBOX("HomeContent");
        } else if (randombottle < 0.99) {
            // 29% 機率抓取 BottleContent
            if (!pickbox) {
                console.error("Element with id 'BottleContent' not found.");
                return;
            }
            const response = await fetch(`${apiBaseUrl}/show?table=bottles`);
            const result = await response.json();
            const randomItem = result.data;
            if (result.data) {
                pickbox.innerHTML = `
                    <p class="content">${randomItem.content.replace(/\n/g, '<br>')}</p>
                    <p class="content">${new Date(randomItem.createdat).toLocaleString()}</p>
                `;
            } else {
                pickbox.innerHTML = '<li>水裡空空的>w<</li>';
            }
            pickbox.classList.remove('hidden');
        } else {
            // 1% 機率抓取 DevContent
            if (!pickbox) {
                console.error("Element with id 'DevContent' not found.");
                return;
            }
            const response = await fetch(`${apiBaseUrl}/show?table=wtfdevelopersay`);
            const result = await response.json();
            const randomItem = result.data;
            if (result.data && result.data.length > 0) {
                pickbox.innerHTML = `
                    <p class="content">${randomItem.content.replace(/\n/g, '<br>')}</p>
                `;
            } else {
                pickbox.innerHTML = '<li>開發池裡空空的>w<</li>';
            }
            pickbox.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('獲取資料失敗');
    }
});

/*--------彈出提示----------*/
function showPop(message){
    const windowcontext = document.querySelector('#windowcontext');
    windowcontext.innerHTML=message;
    const theWindow = document.querySelector('#resign');
    theWindow.classList.add('show');
    setTimeout(() => {
        theWindow.classList.remove('show');
    }, 1000);
}
