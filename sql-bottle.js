var mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
 
//將request進來的 data 轉成 json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// 監聽於 8080 端口
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});

//sql連線
var mc = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "111aaa222bbb",
    insecureAuth : true
});

mc.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.message);
    } else {
        console.log('Connected to MySQL successfully.');
    }
});

// 讀取aka撈--用戶漂流瓶內容
app.get('/show', async function (req, res) {
    try {
        console.log('GET /show is triggered');
        // 修復 CORS 問題
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        const [results, fields] = await mc.promise().query('SELECT * FROM bottle_text.bottles');
        return res.send({ error: false, data: results, message: 'products list.' });
    } 
    catch (error) {
        console.error(error);  // 輸出錯誤到控制台
        return res.status(500).send({ error: true, message: 'Database query failed.' });
    }
});
//新增aka丟
app.post('/add', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        const { UserID, Content } = req.body; // 從請求中獲取數據
        //debug
        if (!Content) {
            return res.status(400).send({
                error: true,
                message: '請填入內容！'
            });}
        if (!UserID) {
                return res.status(400).send({
                    error: true,
                    message: '無用戶資料！'
            });}
        // 從資料庫查詢禁用字列表
        const [forbiddenWords] = await mc.promise().query('SELECT word FROM bottle_text.sensitive_words');
        // 提取禁用字數組
        const wordList = forbiddenWords.map(row => row.word);
        // 檢查內容中是否包含禁用字
        const hasForbiddenWord = wordList.some(word => Content.includes(word));
        if (hasForbiddenWord) {
            return res.status(400).send({ 
                error: true, 
                message: '提交內容包含敏感字彙，請重新輸入。' 
            });
        }

        // 若通過審核，執行插入操作
        const [result] = await mc.promise().query(
            'INSERT INTO bottle_text.bottles SET ?', 
            { UserID, Content }
        );

        return res.send({ 
            error: false, 
            data: result, 
            message: '提交成功！' 
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ 
            error: true, 
            message: '伺服器發生錯誤，請稍後再試。' 
        });
    }
});
