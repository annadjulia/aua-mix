const usuarioModel = require('../models/usuarioModel');
const animaisModel = require('../models/animaisModel');
let animais = [];

function login(req, res) {
    //console.log(req.headers.referer.replace("https://", ""));
    console.log(process.env.URL + '/cadastro')
    console.log(req.session.erro);
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Login",
        erro: req.session.erro
    };
    delete req.session.erro;
    res.render('login');
}

function cadastro(req, res) {
    console.log(req.session.erro);
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Cadastro",
        erro: req.session.erro
    };
    delete req.session.erro;
    res.render('cadastro');
}

async function autenticar(req, res) {
    console.log(req.body);
    const { email, senha } = req.body;
    let resp = await usuarioModel.verificarUsuario(email, senha);
    if(resp.length > 0){
        req.session.usuario = {
            id: resp[0].id,
            nome: resp[0].nome,
            email: resp[0].email,
            ong: resp[0].ong,
            dataIngresso: resp[0].dataIngresso,
            telefone: resp[0].telefone,
            erro: 0
        };
        req.session.erro = 0;
        console.log('Usuário encontrado');
        res.redirect('/');
    }else{
        console.log('Usuário não encontrado');
        req.session.erro = "Email ou senha incorretos";
        res.redirect('/login');
    }
}

async function cadastrar(req, res) {
    console.log(req.body);
    const { nome, email, senha , senha2} = req.body;
    if(senha !== senha2){
        console.log('Senhas não conferem');
        req.session.erro = "Senhas não conferem";
        res.redirect('/cadastro');
    }else{
        let resp = await usuarioModel.cadastrarUsuario(nome, email, senha);
    if(resp === false){
        console.log('Usuário já existe');
        req.session.erro = "Já existe um usuário com esse email";
        res.redirect('/cadastro');
        }else if(resp.affectedRows > 0){
            console.log('Usuário cadastrado');
            req.session.erro = 0;
            res.redirect('/login');
        }else{
            console.log('Erro ao cadastrar usuário');
            req.session.erro = "Erro ao cadastrar usuário";
            res.redirect('/cadastro');
        }
    }
}

async function perfil(req, res){
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Perfil"
    };
    animais = await animaisModel.listarAnimaisUsuario(req.session.usuario.id);
    animais.forEach(async (animal) => {
        let especie = await animaisModel.getEspecie(animal.especie_id);
        animal.especie = especie[0].nome;
    });
    console.log(animais);
    res.render('perfil', { animais });
}

function logout(req, res){
    delete req.session.usuario;
    res.redirect('/login');
}

async function usuarios(req, res){
    res.locals.layoutVariables = {
        usuario: req.session.usuario !== undefined ? req.session.usuario : 0,
        url: process.env.URL,
        title: "Usuários"
    };
    console.log('locals: '+res.locals.layoutVariables.usuario);
    let usuarios = await usuarioModel.listarUsuarios();
    console.log(usuarios);
    res.render('usuarios', { usuarios });
}

async function getUsuario(req, res){
    const { id } = req.params;
    let usuario = await usuarioModel.getUsuario(id);
    if (usuario.length == 0) {
        res.redirect('/users');
    }else{
        console.log(usuario[0]);
        console.log(usuario);
        res.locals.layoutVariables = {
            usuario: req.session.usuario,
            url: process.env.URL,
            title: usuario[0].nome
        };
        let animais = await animaisModel.listarAnimaisUsuario(id);
        console.log(animais);
        res.render('usuario', { usuario: usuario[0], animais });
    }
}

module.exports = { login, cadastro, autenticar, cadastrar, logout, perfil, usuarios, getUsuario };