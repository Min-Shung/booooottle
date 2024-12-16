const closeButtons = document.querySelectorAll('.closeOverlay');
const pickBottle = document.getElementById('pickBottle');
const releaseBottle = document.getElementById('releaseBottle');
//撈瓶子
async function fetchBottle() {
    const response = await fetch('/api/getBottle');
    if (response.ok) {
      const bottle = await response.json();
      console.log('撈到的瓶子:', bottle);
  
      // 獲取瓶子內容並顯示
      const bottleContent = bottle.Content;  // 假設後端返回的內容字段是 `Content`
      const bottleElement = document.getElementById('bottleContent');
      bottleElement.innerHTML = bottleContent;  // 顯示撈到的瓶子內容
    } else {
      console.log('撈瓶子失敗:', response.statusText);
    }
  }
  
pickBottle.addEventListener('click', event => {
    event.preventDefault(); // 阻止默認跳轉行為
    const targetLayer = document.getElementById(`pickbox`); // 找到對應的遮罩層
    targetLayer.classList.remove('hidden'); // 顯示對應遮罩層
    fetchBottle();
});
//丟瓶子
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