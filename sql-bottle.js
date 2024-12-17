var mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
 
//將request進來的 data 轉成 json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// 監聽於 3306 端口
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


// 讀取aka撈
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
app.post('/add', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const addData = {
        UserID: req.body.UserID,      
        Content: req.body.Content,   
        CreatedAt: new Date()       
    };

    console.log("Data to insert: ", addData);
    mc.promise().query('INSERT INTO bottle_text.bottles SET ?', addData)
        .then(([results]) => {
            return res.send({ 
                error: false, 
                data: results, 
                message: 'New record inserted successfully.'
            });
        })
        .catch((error) => {
            console.error("Insert error: ", error);
            return res.status(500).send({ 
                error: true, 
                message: 'Failed to insert record into database.'
            });
        });
});
