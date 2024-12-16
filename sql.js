const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

// 設定 MySQL 資料庫連結
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '111aaa222bbb',
  database: 'bottle_text'
});

// API：撈一個瓶子
app.get('/api/getBottle', async (req, res) => {
    try {
      // 撈取符合條件的瓶子，排除敏感內容，優先返回新瓶子
      const [rows] = await db.query(
        `SELECT BottleID, Content, CreatedAt
         FROM bottles
         ORDER BY CreatedAt DESC, RAND() 
         LIMIT 1`
      );
      
      if (rows.length) {
        const bottle = rows[0];
        res.json(bottle);  // 返回瓶子的內容
      } else {
        res.status(404).send('沒有可撈的瓶子');
      }
    } catch (err) {
      console.error('Error fetching bottle:', err);
      res.status(500).send('伺服器錯誤');
    }
  });
  

// 啟動伺服器
app.listen(3000, () => {
  console.log('伺服器已啟動，http://localhost:3000');
});
