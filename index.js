const express =require('express');
const app = express();
const port = 8000;

app.get("/", (req, res)=> {
  res.send('hello welkom bij FoundationMatch, je bent op de home pagina')
})

app.get('/about', (req, res) => {
    res.send('Over FoundationMatch')
  })

app.get('/login', (req, res) => {
    res.send('login bij FoundationMatch')
  })

app.get('/favorites', (req, res) => {
    res.send('Jou opgeslagen favorieten')
  })  

app.use((req,res)=> {
    res.status(404).send("Page Not Found")
})  

app.use(express.static('public'))

app.listen(port, ()=> console.log("listening on port " + port))
