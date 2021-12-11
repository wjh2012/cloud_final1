var express = require('express');
var router = express.Router();

var mysql = require('mysql');                   // 데이터 베이스 모듈

const connection = {                          // 데이터 베이스 연결 설정 
  host: "127.0.0.1",     
  port: "3306",                                // PORT
  user: "root",                                 // 사용자
  password: "11111111",                       // 비밀 번호
  database: "member",                         // Database 명
};

var conn = mysql.createConnection(connection); // DB 연결 객체
conn.connect();                                // DB 연결

// index ////////////////////////////////////////////////////////////////////////////////////

router.get('/', function(req, res) {                 // index
  res.render('view');                           // view.jade
})

// 2. 회원 가입 /////////////////////////////////////////////////////////////////////////////

router.get('/register', function(req, res) {  
  res.render('register');                     // register.jade   
});

router.post('/register', function(req, res) {  
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const job = req.body.job;
  const gender = req.body.gender;
  const hobby = req.body.hobby;
   console.log(name);
  const sql = 'INSERT INTO test (name, id, pwd, tel, job, gender, hobby) VALUES(?, ?, ?, ?, ?, ?, ?)';
    conn.query(sql, [name, id, pwd, tel, job, gender, hobby], function(err, member, fields){
    // 웹브라우저 자바스크립트 API 사용
    res.send("<script> alert('회원 등록되었습니다.'); location.href = 'login';</script>");
//    res.redirect('/login');              // 회원가입 후 로그인으로 자동이돋
  });
});

// 3. 로그인 ////////////////////////////////////////////////////////////////////////////////////////////

router.get('/login', function(req, res) {      
  res.render('login');                         // 회원가입 폼   
});

router.post('/login', function(req, res) {  
  const id = req.body.id;                    // 아이디
  const pwd = req.body.pwd;              // 패스워드
  sql = 'SELECT * FROM test';             
  var use = 1;

  conn.query(sql, function(err, members, fields){      

  for(var i=0 ; i<members.length ; i++){         // 행(아이템)의 갯수
    if(members[i].id == id && members[i].pwd == pwd) {
      use = 0;
//     res.write(`<script> alert('로그인되었어요.'); </script>`);
     res.redirect('/member/' + members[i].id_1); 
    } 
  }  

  if(use == 1) {
   res.send("<script> alert('회원 번호나 비밀번호가 틀립니다.'); window.location = '/' </script>");
   }
  });
});

// 회원 가입 후 //////////////////////////////////////////////////////////////////////////////

router.get('/member/:idx', function(req, res){
    const idx = req.params.idx;
    res.render('view_1', {id : idx});  
  });

// 4. 회원 수정 //////////////////////////////////////////////////////////////////////////////

router.get('/edit/:idx', function(req, res){    // 글 수정 페이지
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member, fields){
      console.log(member[0]);
     res.render('edit', {member : member[0]});  // 회원 수정 화면
  });
});

router.post(['/edit/:idx'], function(req, res){    
  const idx = req.params.idx;
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const job = req.body.job;
  const gender = req.body.gender;
  const hobby = req.body.hobby;
  console.log(idx)
  var sql = 'UPDATE test SET name=?, id=?, pwd=?, job=? WHERE id_1=?';
  conn.query(sql, [name, id, pwd, job, idx], function(err, result, fields){
     console.log('업데이트되었어요');
     res.redirect('/member/'+ idx);
  });
});

// 5. 회원 삭제 /////////////////////////////////////////////////////////////////////////////////

router.get('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member){
    res.render('delete', {member : member[0]});
  });
});

router.post('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'DELETE FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, result){
    res.redirect('/');
  });
});

/////////////////////////////////////////////////////

module.exports = router;