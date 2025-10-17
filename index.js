import express from 'express';
import bodyParser  from "body-parser";
import axios from "axios";
import pg from "pg";
import {db} from './db.js';

const app=express();
app.use(bodyParser.json());
const PORT=process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/',async(req,res)=>
{
  res.render('register.ejs');     
})
app.post('/register',async(req,res)=>
{
  try{
    const {name}=req.body;
    console.log(name);
    const existingUser=await db.query('select * from users where user_name=$1',[name]);
    let userId;
    if(existingUser.rows.length>0){
      userId=existingUser.rows[0].user_id;
      console.log("Existing user with userId "+userId);
      res.redirect('/add-books?userId='+userId);

    }
    else{
      const result=await db.query('Insert into users (user_name) values ($1) returning user_id'[name]);
      console.log("New user registered");
      userId=result.rows[0].user_id;
      res.redirect('/add-books?userId='+userId);
    }

  }
      catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
  /*  const {name}=req.body;
    console.log(name);
    const result= await db.query('INSERT INTO users (user_name) VALUES ($1) RETURNING user_id',[name]);
    console.log("User Registered");
    const userId =result.rows[0].user_id;
    console.log(userId);
    res.redirect('/add-books?userId='+userId)
    */
})
app.get('/add-books',async(req,res)=>{
    try{
        const userId=req.query.userId;
        console.log("is userid "+userId);
        const result=await db.query('select * from books where user_id=$1',[userId]);
        const books=result.rows;
        res.render('books.ejs',{books:books,userId:userId});
        
    }
     catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error loading books page");
  }
})
//winpty taskkill //F //PID $(netstat -ano | grep 3000 | awk '{print $5}' | head -1)
  app.post('/add-book',async(req,res)=>{
    try{
      const {bookname,userId}=req.body;
      console.log(userId,bookname);
      const result=await db.query('INSERT INTO books (book_name,user_id) VALUES ($1,$2) RETURNING book_id',[bookname,userId]);
      res.redirect(`/add-books?userId=${userId}`);
    }
    catch(error){
      console.error("error adding book",error);
      res.status(500).send("Error adding book");
    }
  });
  app.get('/notes',async(req,res)=>{
    try{
      const books_id=req.query.books_id;
      const userId=req.query.userId;
      console.log("books_id is "+books_id);
      const result=await db.query('select * from notes where books_id=$1',[books_id]);
      const kaddu =await db.query('select book_name from books where book_id=$1',[books_id]);
      console.log("book name is "+kaddu.rows[0]?.book_name);
      console.log(result.rows);
      const notes=result.rows;
      const bookName = kaddu.rows[0]?.book_name;
      res.render('notes.ejs',{notes:notes,books_id:books_id,userId:userId,bookName:bookName});
    }
    catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).send("Error loading notes");
    }
  });
  app.post('/add-note',async(req,res)=>{
    try{
      const {notes_text,shipment_date,books_id,userId}=req.body;
      const result=await db.query('INSERT INTO notes (text,shipment_date,books_id,user_id) VALUES ($1,$2,$3,$4) RETURNING notes_id',[notes_text,shipment_date,books_id,userId]);
      
      console.log("Note added");
      res.redirect(`/notes?books_id=${books_id}&userId=${userId}`);
    }
    catch (error) {
      console.error("Error adding note:", error);
      res.status(500).send("Error adding note");
    }
  });
  app.post('/delete-note',async(req,res)=>{
    try{
      const {notes_Id,books_id,userId}=req.body;
      console.log("notes_id to be deleted "+notes_Id);
      const result=await db.query('DELETE FROM notes WHERE notes_id=$1',[notes_Id]);
      console.log("Note deleted");
      res.redirect(`/notes?books_id=${books_id}&userId=${userId}`);
    }
    catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).send("Error deleting note");
    }
  });

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});