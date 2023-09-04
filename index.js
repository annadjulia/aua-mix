const express = require('express'); 
const app = express(); 
const PORT = 3000; 
const HOST = 'localhost';
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dotenv = require('dotenv').config();
const path = require('path');
const usuarioController = require('./controllers/usuarioController');
const animaisController = require('./controllers/animaisController');

/*multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });

//cloudinary
cloudinary.config({
    cloud_name: 'dj1sdgtdr',
    api_key: '174723524863143',
    api_secret: '56QaNgRoQzpaHefInLcyQ-56TAc'
  });
*/
  
//session
app.use(session({secret: 'abracadabra'}));

//ejs
app.use(expressLayouts);
app.set('layout', './layouts/default/login');
app.set('view engine', 'ejs');

//body-parser
app.use(express.urlencoded({ extended: true })); 
//app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.session.usuario) {
        console.log('Logado');
        res.locals.layoutVariables ={
            usuario: req.session.usuario
        };
        next();
    }else{
        console.log('Não logado');
        if(req.url == '/cadastroAnimais' || req.url == '/perfil' || req.url == '/logout'){
            res.redirect('/login?erro=2');
        }else{
            res.locals.layoutVariables ={
                usuario: req.session.usuario
            };
            next();
        }
    }
});

app.get('/', (req, res) => {
    app.set('layout', './layouts/default/main');
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Home"
    };
    res.render('home');
});

app.get('/login', (req, res) => {
    app.set('layout', './layouts/default/login');
    usuarioController.login(req, res);
});

app.post('/login', (req, res) => {
    usuarioController.autenticar(req, res);
});

app.get('/cadastro', (req, res) => {
    app.set('layout', './layouts/default/login');
    usuarioController.cadastro(req, res);
});

app.post('/cadastro', (req, res) => {
    usuarioController.cadastrar(req, res);
});

app.get('/cadastroAnimais', (req, res) => {
    app.set('layout', './layouts/default/main');
    animaisController.cadastroAnimais(req, res);
});

app.post('/cadastroAnimais', (req, res) => {
    animaisController.cadastrar(req, res);
});

app.get('/animais', (req, res) => {
    app.set('layout', './layouts/default/main');
    animaisController.listarAnimais(req, res);
});

app.get('/animais/:id', (req, res) => {
    app.set('layout', './layouts/default/main');
    animaisController.getAnimal(req, res);
    //res.send('nao ta pronto ainda');
});

app.get('/sobre', (req, res) => {
    app.set('layout', './layouts/default/main');
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Sobre"
    };
    res.render('sobre');
});

app.get('/perfil', (req, res) => {
    app.set('layout', './layouts/default/main');
    usuarioController.perfil(req, res);
});

app.get('/logout', (req, res) => {
    usuarioController.logout(req, res);
});

app.listen(PORT, () => { 
    console.log(`Servidor rodando em ${HOST}:${PORT}`);
});