const usuarioModel = require('../models/usuarioModel');

function login(req, res) {
    console.log(req.headers.referer.replace("https://", ""));
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

function perfil(req, res){
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Perfil"
    };
    res.render('perfil');
}

function logout(req, res){
    delete req.session.usuario;
    res.redirect('/login');
}

module.exports = { login, cadastro, autenticar, cadastrar, logout, perfil };