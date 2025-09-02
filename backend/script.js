import express from 'express';
import cors from 'cors'
import compression from 'compression';
import pg from 'pg'
import env from 'dotenv'
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
  password: process.env.DB_PASSWORD, // Render DB password
  database: process.env.DATABASE, // Render DB name
  ssl: {
    rejectUnauthorized: false // needed for Render Postgres
  }
})
db.connect()

app.post('/',(req,res)=>{
    console.log(req.body)
    db.query(`INSERT INTO Events VALUES('${req.body.name}','${req.body.discription}','${req.body.date}','${req.body.type}')`,()=>{
        res.send('done')
    })
})
app.get('/',(req,res)=>{
    db.query('SELECT * FROM Events',(err,rows)=>{
        var arr=rows.rows;
        arr.reverse()
res.json(arr)    })
})
app.post('/submit',(req,res)=>{

    db.query(`SELECT * FROM auths WHERE username='${req.body.username}'`,(err,rows)=>{
    if(rows.rows.length==0||err){
        res.send(false)
    }
    else{
        bcrypt.compare(req.body.password,rows.rows[0].password,(err,result)=>{
       res.send(result)
    })
    }
    
})

})
