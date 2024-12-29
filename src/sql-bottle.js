const { Client } = require('pg'); // 使用 PostgreSQL 的客户端
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const WebSocket = require('ws');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL 
const client = new Client({
    host: 'dpg-cthjlud2ng1s73abp7c0-a.singapore-postgres.render.com',  
    user: 'bottle_storage_user',           
    password: 'UPd0VCwkhvvI97fbngzVby1trGpdHCxu', 
    database: 'bottle_storage',    
    port: 5432,
    ssl: {
      rejectUnauthorized: false   
  }                   
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL', err));

// 監聽8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});


//註冊
app.post('/register', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const { username, pw } = req.body;

  // 檢查輸入是否完整
  if (!username || !pw) {
      return res.status(400).json({ error: '帳號或密碼不得為空！' });
  }

  try {
      // 查詢用戶是否已存在
      const checkQuery = 'SELECT username FROM users WHERE username = $1';
      const checkResult = await client.query(checkQuery, [username]);

      if (checkResult.rows.length > 0) {
          return res.status(409).json({ error: '帳號已存在！' });
      }

      // 加密密碼
      const saltRounds = 7.859613;
      const hashedPassword = await bcrypt.hash(String(pw), saltRounds);

      // 插入新用戶
      const insertQuery = 'INSERT INTO users (username, pw) VALUES ($1, $2)';
      const insertResult = await client.query(insertQuery, [username, hashedPassword]);

      console.log('新用戶註冊成功:', insertResult);

      return res.status(201).json({ message: '註冊成功！' });
  } catch (error) {
      console.error('伺服器錯誤:', error);
      if (error.code === '23505') { // 唯一約束違反錯誤代碼
        return res.status(409).json({ error: '帳號已存在！' });
    }
      return res.status(500).json({ error: '伺服器錯誤，請稍後再試！' });
  }
});

//登入
app.post('/login', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const { username, pw } = req.body;
  if (!username || !pw) {
      return res.status(400).json({ error: '帳號或密碼不得為空！' });
  }

  try {
      // 查詢用戶資料
      const query = 'SELECT username, pw, userid FROM users WHERE username = $1';
      const values = [username];
      const result = await client.query(query, values);
      console.log(result.rows);
      // 如果找不到用戶
      if (result.rows.length === 0) {
          return res.status(401).json({ error: '帳號或密碼不正確！' });
      }
      const user = result.rows[0]; // 查詢結果中的用戶資料

      // 驗證密碼
      const isMatch = await bcrypt.compare(String(pw), String(user.pw));
      if (!isMatch) {
          return res.status(401).json({ error: '帳號或密碼不正確！' });
      }

      // 成功登錄
      return res.status(200).json({ message: '登錄成功！', username: user.username ,userid: user.userid });
  } catch (error) {
      console.error('伺服器錯誤:', error);
      return res.status(500).json({ error: '伺服器錯誤，請稍後再試！' });
  }
});
//留言
app.post("/api/messages", async (req, res) => {
  const { sender_id, recipient_id, article_id ,retext} = req.body;

  try {
      const result = await client.query(
          `INSERT INTO messages (sender_id, recipient_id, content, article_id) 
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [sender_id, recipient_id, retext, article_id]
      );
      res.status(201).json({ message: "留言已成功送出", data: result.rows[0] });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "伺服器錯誤，請稍後再試。" });
  }
});

// 獲取信箱訊息（依時間排序，最舊的在前）
app.get('/mailbox/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const messages = await client.query(
          'SELECT * FROM messages WHERE recipient_id = $1 ORDER BY created_at DESC',
          [userId]
      );
      console.log('Requesting messages SQL:' ,  userId);
      res.status(200).json({ messages: result.rows });
  } catch (error) {
      console.error('無法取得信件:', error);
      res.status(500).json({ error: '無法取得信件' });
  }
});

//撈
// Route for 'bottles' table
app.get('/show/bottles', async function (req, res) {
  try {
      // CORS
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      // Query to fetch all columns
      const result = await client.query('SELECT * FROM bottles');

      if (result.rows.length === 0) {
          return res.send({ error: false, data: null, message: 'No data found in bottles.' });
      }

      const randomIndex = Math.floor(Math.random() * result.rows.length);
      const randomItem = result.rows[randomIndex];

      return res.send({ error: false, data: randomItem, message: 'Bottles list.' });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ error: true, message: '資料獲取失敗' });
  }
});

//wtfdevelopersay
app.get('/show/wtfdevelopersay', async function (req, res) {
  try {
      // CORS
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      const result = await client.query('SELECT * FROM wtfdevelopersay');

      const randomIndex = Math.floor(Math.random() * result.rows.length);
      const randomItem = result.rows[randomIndex];

      return res.send({ error: false, data: randomItem, message: 'Developers Say list.' });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ error: true, message: '資料獲取失敗' });
  }
});
//丟
app.post('/add', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        const { UserID, Content } = req.body;  

        if (!Content) {
            return res.status(400).send({ error: true, message: '請填寫內容～' });
        }
        // 禁用字列表
        const result = await client.query('SELECT word FROM sensitive_words');
        const forbiddenWords = result.rows.map(row => row.word);

        // 檢查内容中是否包含禁用字
        const hasForbiddenWord = forbiddenWords.some(word => Content.includes(word));
        if (hasForbiddenWord) {
            return res.status(400).send({ error: true, message: '內容含有違禁詞，請重新輸入。' });
        }

        const insertResult = await client.query(
            'INSERT INTO bottles (userid, content) VALUES ($1, $2)', [UserID, Content]
        );

        return res.send({ error: false, data: insertResult, message: '提交成功！' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: true, message: '伺服器錯誤，請稍後重試。' });
    }
});
//kkbox代理
app.get('/proxy', async (req, res) => {
    const { type, category, date, year } = req.query;
  
    // 驗證參數
    if (!type || !category || (!date && type !== 'yearly') || (type === 'yearly' && !year)) {
      return res.status(400).send('Missing required query parameters');
    }
  
    let url;
    if (type === 'daily') {
      url = `https://kma.kkbox.com/charts/api/v1/daily?category=${category}&date=${date}&lang=tc&limit=10&terr=tw&type=newrelease`;
    } else if (type === 'weekly') {
      url = `https://kma.kkbox.com/charts/api/v1/weekly?category=${category}&date=${date}&lang=tc&limit=10&terr=tw&type=newrelease`;
    } else if (type === 'yearly') {
      url = `https://kma.kkbox.com/charts/api/v1/yearly?category=${category}&lang=tc&limit=10&terr=tw&type=newrelease&year=${year}`;
    } else {
      return res.status(400).send('Invalid type parameter');
    }
  
    console.log('Requesting KKBOX API with URL:', url);
  
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'YourAppName/1.0',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data from KKBOX API:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send('Failed to fetch data from KKBOX API');
      }
    }
  });
//NEWSAPI
const newsAPI_KEY = '3d29c7d7f9304476afaa830b7d888dad'; // 替換成你的 NewsAPI API 金鑰

// 啟用 CORS，允許前端訪問
app.use(cors());

app.get('/api/news', async (req, res) => {
    try {
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

        // 隨機關鍵字
        const keywords = ['政治', '社會', '財經', '生活', '影視', '體育', '金融', '麥當勞', '蘋果', '早餐', '颱風', '宣布', '地震', '天氣'];
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

        // 主請求
        const url = `https://newsapi.org/v2/everything?q=${randomKeyword}&language=zh&from=${formatDate(lastWeek)}&to=${formatDate(today)}&pageSize=1&apiKey=${newsAPI_KEY}`;
        const response = await axios.get(url);

        if (response.data && response.data.articles && response.data.articles.length > 0) {
            res.json(response.data.articles[0]); // 回傳第一篇文章
        } else {
            // 備用請求
            const fallbackUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsAPI_KEY}`;
            const fallbackResponse = await axios.get(fallbackUrl);
            const randomIndex = Math.floor(Math.random() * fallbackResponse.data.articles.length);
            res.json(fallbackResponse.data.articles[randomIndex]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news data', details: error.message });
    }
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
