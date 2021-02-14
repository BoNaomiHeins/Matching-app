const express =require('express');
const app = express();
const port = 8000;  
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'static/public')));

app.get("/", (req, res)=> {
  res.sendFile(__dirname + '/static/public/index.html')
})

app.get("/home", (req, res)=> {
  res.render('home')
})

app.get("/matchresulaten", (req, res)=> {
  res.render('matchresultaten')
})

app.get('/Overons', (req, res) => {
    res.send('Over FoundationMatch')
  })

app.get('/login', (req, res) => {
    res.send('login bij FoundationMatch')
  })

app.get('/favorieten/:name', (req, res) => {
    res.render('favorieten', {persoon: req.params.name})
  })  

app.use((req,res)=> {
    res.status(404).send("Page Not Found")
})  

app.listen(port, ()=> console.log("listening on port " + port))
