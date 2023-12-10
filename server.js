const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sign.html'));
});

/*-------------------建立資料庫連線-------------------*/


let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.run('CREATE TABLE users(name text, email text UNIQUE, password text)', (err) => {
  if (err) {
    return console.log(err.message);
  }
});

/*-------------------將用戶的名字、電郵和密碼插入到 users 表格中-------------------*/

app.post('/signup', (req, res) => {
  db.run(`INSERT INTO users(name, email, password) VALUES(?, ?, ?)`, [req.body.name, req.body.email, req.body.password], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.redirect('/signin');
  });
});

/*-------------------程式碼會檢查用戶的電郵和密碼是否正確-------------------*/

app.get('/signin', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sign.html'));
});

app.post('/signin', (req, res) => {
  db.get(`SELECT * FROM users WHERE email = ?`, [req.body.email], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row) {
      if (row.password === req.body.password) {
        return res.json({ redirect: 'index.html' });
      } else {
        return res.status(400).json({ error: '密碼錯誤，請重新輸入。' });
      }
    } else {
      return res.status(400).json({ error: '該用戶未註冊，請先註冊。' });
    }
  });
});

/*-------------------監聽-------------------*/

app.listen(5501, () => {
  console.log('Server is running on port 5501');
});