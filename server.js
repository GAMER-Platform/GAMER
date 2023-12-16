/* CHUNG-HAO 2023 版權所有 */

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer  = require('multer');
const upload = multer();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sign.html'));
});

/*-------------------seeting sign in/up User-------------------*/

const session = require('express-session');

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

/*-------------------建立資料庫連線：使用者-------------------*/


let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database - User...');
});

db.run('CREATE TABLE users(name text, email text UNIQUE, password text, profession text)', (err) => {
  if (err) {
    return console.log(err.message);
  }
});

/*-------------------建立資料庫連線：連盟者 遊戲-------------------*/

db.run('CREATE TABLE Games(id INTEGER PRIMARY KEY, name TEXT, image TEXT, description TEXT, link TEXT)', (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log('Connected to the in-memory SQlite database - Game...');
});

/*--------------------建立一個allow的資料庫----------------------*/

db.run('CREATE TABLE AllowedGames(id INTEGER PRIMARY KEY, name TEXT, image TEXT, description TEXT)', (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log('Connected to the in-memory SQlite database - allow...');
});

/*--------------------建立資料庫連線：聯盟者 競賽----------------------*/
db.run('CREATE TABLE Contests(id INTEGER PRIMARY KEY, name TEXT, description TEXT, link TEXT, participants TEXT)', (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log('Connected to the in-memory SQlite database - Contest...');
});

/*-------------------將用戶的名字、電郵和密碼插入到 users 表格中-------------------*/

app.post('/signup', (req, res) => {
  console.log(req.body);
  db.run(`INSERT INTO users(name, email, password, profession) VALUES(?, ?, ?, ?)`, [req.body.name, req.body.email, req.body.password, req.body.profession], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.redirect('/signin');
  });
});

/*-------------------將遊戲中的資訊存在 game 表格當中------------------*/

app.post('/addGame', upload.any(), (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const description = req.body.description;
  const link = req.body.link;
  db.run(`INSERT INTO Games(name, image, description, link) VALUES(?, ?, ?, ?)`, [name, description, link], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({ message: 'Game added successfully.' });
  });
});

/*-------------------將競賽中的資訊存在 contest 表格當中------------------*/

app.post('/addContest', (req, res) => {
  console.log(req.body);
  const { name1, description1, link1} = req.body;
  db.run(`INSERT INTO Contests(name, description, link) VALUES(?, ?, ?)`, [name1, description1, link1], function(err) {
    if (err) {
      return console.log(err.message);
    }
    return res.json();
  });
});

/*-------------------儲存Gmae - allow後的資料------------------*/

app.post('/allowGame', (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  db.run(`INSERT INTO AllowedGames(name, image, description) VALUES(?, ?, ?)`, [name, image, description], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({ message: 'Game allowed successfully.' });
  });
});

/*-------------------儲存contest - allow後的資料------------------*/

app.post('/AllowContests', (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const link = req.body.link;

  db.run(`INSERT INTO AllowedContests(id, name, description, link) VALUES(?, ?, ?, ?)`, [id, name, description, link], function(err) {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      return res.json({ message: 'Contest allowed successfully.' });
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
        req.session.email = req.body.email; 

        let redirectPage;
        switch (row.profession) {
          case '使用者':
            redirectPage = 'User.html';
            break;
          case '聯盟者':
            redirectPage = 'alliance.html';
            break;
          case '管理者':
            redirectPage = 'manager.html';
            break;
          case '廣告商':
            redirectPage = 'advertisers.html';
            break;
          default:
            redirectPage = 'index.html';
        }
        return res.json({ redirect: redirectPage });
      } else {
        return res.status(400).json({ error: '密碼錯誤，請重新輸入。' });
      }
    } else {
      return res.status(400).json({ error: '該用戶未註冊，請先註冊。' });
    }
  });
});


/*---------------------取得用戶---------------------*/

app.get('/api/user', (req, res) => {
  const userEmail = req.session.email;
  db.get(`SELECT name FROM users WHERE email = ?`, [userEmail], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row) {
      return res.json({ name: row.name });
    } else {
      return res.status(400).json({ error: '無法找到用戶。' });
    }
  });
});

/*---------------------讓manager取得用戶---------------------*/
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

/*---------------------限制看到的頁面---------------------*/

app.get('/checkRole', (req, res) => {
  const role = req.session.role;
  if (role === '聯盟者') {
    res.json({ canAddGame: true });
  } else {
    res.json({ canAddGame: false });
  }
});

/*-------------------取得所有遊戲資訊-------------------*/

app.get('/getGames', (req, res) => {
  db.all(`SELECT * FROM Games`, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json(rows);
  });
});

/*---------------刪除該資料庫中欄位----------------*/

app.delete('/deleteGame/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM Games WHERE id = ?`, id, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({ success: true, message: 'Game deleted successfully.' });
  });
});

/*---------------取得allow後的資料----------------*/

app.get('/getAllowedGames', (req, res) => {
  db.all('SELECT * FROM AllowedGames', [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json(rows);
  });
});

/*----------------------取得競賽資訊----------------------*/

app.get('/getContests', (req, res) => {
  db.all('SELECT * FROM Contests', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

/* ----------------------刪除競賽資訊----------------------- */
app.delete('/deleteContests/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM Games WHERE id = ?`, id, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({ success: true, message: 'Game deleted successfully.' });
  });
});
/*-------------------監聽-------------------*/

app.listen(5501, () => {
  console.log('Server is running on port 5501 http://127.0.0.1:5501');
});

module.exports = app;