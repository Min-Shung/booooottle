const { Client } = require('pg'); // 使用 PostgreSQL 的客户端
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');

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
      const query = 'SELECT username, pw FROM users WHERE username = $1';
      const values = [username];
      const result = await client.query(query, values);

      // 如果找不到用戶
      if (result.rows.length === 0) {
          return res.status(401).json({ error: '帳號或密碼不正確！' });
      }
      const user = result.rows[0]; // 查詢結果中的用戶資料

      // 驗證密碼
      const saltRounds = 7.859613;
      const isMatch = await bcrypt.compare(pw, saltRounds);
      if (!isMatch) {
          return res.status(401).json({ error: '帳號或密碼不正確！' });
      }

      // 成功登錄
      return res.status(200).json({ message: '登錄成功！' });
  } catch (error) {
      console.error('伺服器錯誤:', error);
      return res.status(500).json({ error: '伺服器錯誤，請稍後再試！' });
  }
});

//撈
app.get('/show', async function (req, res) {
    try {
        //  CORS
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        const tableName = req.query.table;
        const allowedTables = ['bottles', 'wtfdevelopersay']; 
        if (!allowedTables.includes(tableName)) {
            return res.status(400).send({ error: true, message: 'Invalid table name.' });
        }
        const result = await client.query(`SELECT * FROM ${tableName}`);
        return res.send({ error: false, data: result.rows, message: `${tableName} list.` });
    } catch (error) {
        console.error(error);  
        return res.status(500).send({ error: true, message: 'Database query failed.' });
    }
});
//丟
app.post('/add', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        const { UserID, Content } = req.body;  

        if (!Content) {
            return res.status(400).send({ error: true, message: 'Please fill in content!' });
        }
        if (!UserID) {
            return res.status(400).send({ error: true, message: 'No user data!' });
        }

        // 禁用字列表
        const result = await client.query('SELECT word FROM sensitive_words');
        const forbiddenWords = result.rows.map(row => row.word);

        // 檢查内容中是否包含禁用字
        const hasForbiddenWord = forbiddenWords.some(word => Content.includes(word));
        if (hasForbiddenWord) {
            return res.status(400).send({ error: true, message: 'Content contains forbidden words, please re-enter.' });
        }

        const insertResult = await client.query(
            'INSERT INTO bottles (UserID, Content) VALUES ($1, $2)', [UserID, Content]
        );

        return res.send({ error: false, data: insertResult, message: 'Submission successful!' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: true, message: 'Server error, please try again later.' });
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
