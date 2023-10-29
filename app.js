const express = require('express'); 
const mongoose = require('mongoose');

const stuffRoutes = require("./routes/stuff")
const userRoutes = require("./routes/user")


//connexion à mongoDB
mongoose.connect('mongodb+srv://louka:Vl0BQE65CpmwRkIp@clusterocp7.o8rc2u9.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express(); //initialise Express

app.use((req, res, next) => { // Configure les en-têtes des requetes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(express.json()); // convertit en json


app.use("/api/books", stuffRoutes);
app.use("/api/auth", userRoutes);


const path = require('path'); // gestion du chemin des fichiers
app.use('/images', express.static(path.join(__dirname, 'images'))); 

module.exports = app;