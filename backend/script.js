import express from 'express';
import cors from 'cors'
import compression from 'compression';
import pg from 'pg'
import env from 'dotenv'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import e from 'express';

const app=express();

env.config()
app.listen(2000,()=>{
    console.log("Server Started!")
})
app.use(express.json())
app.use(cors())
app.use(compression())
var db=new pg.Client({
  host: process.env.HOST, // Render host
  port: 5432,
  user: process.env.DB_USER, // Render DB user
  password:process.env.DB_PASSWORD, // Render DB password
  database: process.env.DATABASE, // Render DB name
  ssl: { rejectUnauthorized: false } 
})
db.connect()

app.post('/',(req,res)=>{
    console.log(req.body)
    db.query(`INSERT INTO requests(name,contact,location,sdis,ldis,date,etype) VALUES('${req.body.name}','${req.body.contact}','${req.body.location}','${req.body.sdis}','${req.body.ldis}','${req.body.date}','${req.body.type}')`,(err)=>{
      if(err)  {
        throw err
      }
      res.send('done')
    })
})
app.get('/',(req,res)=>{
      db.query('SELECT * FROM ELIST',(err,rows)=>{
        var arr=rows.rows.reverse();
res.json(arr)    })
 
})
app.post('/admin',(req,res)=>{
 db.query(`INSERT INTO ELIST(name,contact,location,sdis,ldis,date,etype) VALUES('${req.body.name}','${req.body.contact}','${req.body.location}','${req.body.sdis}','${req.body.ldis}','${req.body.date}','${req.body.type}')`,(err,rows)=>{
if(err){
  res.send('err')
}
else{
  res.send('done')
}
})
})
app.post('/reject', (req, res) => {
  console.log('Reject route hit with body:', req.body);
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'singhsukh1977.s@gmail.com',
      pass: "watl kavj zwim xnyj"
    },
    debug: true, // Enable debug output
    logger: true // Log to console
  });
  
  const mailOptions = {
    from: "singhsukh1977.s@gmail.com",
    to: req.body.contact,
    subject: `Request Rejected`,
    text: `Unfortunately, your event request is rejected.`  
  };
  
  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('Transporter verification failed:', error);
    } else {
      console.log('Server is ready to send emails');
    }
  });
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email send error:", error);
      console.error("Error code:", error.code);
      console.error("Error response:", error.response);
      return res.status(500).json({ 
        error: 'Failed to send email', 
        details: error.message,
        code: error.code 
      });
    }
    console.log("Email sent successfully:", info);
    res.json({ success: true, message: 'Rejection email sent' });
  });
});
app.post('/main',(req,res)=>{
db.query(`INSERT INTO ELIST(name,contact,location,sdis,ldis,date,etype) VALUES('${req.body.name}','${req.body.contact}','${req.body.location}','${req.body.sdis}','${req.body.ldis}','${req.body.date}','${req.body.etype}')`,(err,rows)=>{
if(err){
  res.send('err')
}
else{
  db.query(`DELETE FROM requests WHERE id=${req.body.id}`,(err,rows)=>{
if(!err){
    res.send('done')
}
  })
}
})})
app.post('/submit',(req,res)=>{
    db.query(`SELECT * FROM auths WHERE username='${req.body.username}'`,(err,rows)=>{
    if(rows.rows.length==0||err){
        res.send('bc')
    }
    else{
        bcrypt.compare(req.body.password,rows.rows[0].password,(err,result)=>{
        if(result){
          db.query(`SELECT * FROM requests`,(err,rows)=>{
res.send(rows.rows.reverse())    
       })
        }
        else{
          res.send('done')
        }
    })
    }
    
})
app.post('/delete',(req,res)=>{
  console.log(req.body.key)
  db.query(`DELETE FROM ELIST WHERE id=${req.body.key}`,(err)=>{
    if(err){
      throw err
    }
    else{
      res.send('done')
    }
  })
})
})


