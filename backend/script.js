import express from 'express';
import cors from 'cors'
import compression from 'compression';
import pg from 'pg'
import env from 'dotenv'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

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
  console.log('hello2')
}
})
})
app.post('/reject',(req,res)=>{
 const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'singhsukh1977.s@gmail.com',
            pass: "qziw dbee wayq nuyc"  
        }
    });
    const mailOptions = {
        from: "singhsukh1977.s@gmail.com",
        to: req.body.contact,
        subject: `Request Rejected`,
        text: `Unfortunately, your event request is rejected, ${req.body.reason}`  
        };
    
        try{
           transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            res.send('deleted')
            db.query(`DELETE FROM requests WHERE id=${req.body.key}`,(err,rows)=>{
              if(!err){
                console.log('hello')
              }
            })
        }
    })
        }
        catch(err){
          console.log('Bad email')
          res.send('e')
        }
        ;})
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
console.log("dello")  
       })
        }
        else{
          res.send('done')
          console.log('hello')
        }
    })
    }
        console.log('hello')
    
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

