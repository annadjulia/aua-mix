const express = require('express'); 
const app = express(); 
const port = 3000; 
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();
const path = require('path');
const usuarioController = require('./controllers/usuarioController');
const animaisController = require('./controllers/animaisController');

cloudinary.config({
    cloud_name: 'dj1sdgtdr',
    api_key: '174723524863143',
    api_secret: '56QaNgRoQzpaHefInLcyQ-56TAc'
  });

app.use(session({secret: 'abracadabra'}));

app.use(expressLayouts);
app.set('layout', './layouts/default/login');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); 
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
    //animaisController.getAnimal(req, res);
    res.send('nao ta pronto ainda');
});

app.get('/sobre', (req, res) => {
    app.set('layout', './layouts/default/main');
    res.render('sobre');
});

app.get('/perfil', (req, res) => {
    app.set('layout', './layouts/default/main');
    usuarioController.perfil(req, res);
});

app.get('/logout', (req, res) => {
    usuarioController.logout(req, res);
});

app.listen(port, () => { 
    console.log(`Servidor rodando em http://localhost:${port}`);
});