const { stringify } = require("uuid");
const usuarioModel = require("../models/usuarioModel");
const animaisController = require("./animaisController");
let animais = [];

function login(req, res) {
  console.log(req.session.erro);
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Login",
    erro: req.session.erro,
  };
  delete req.session.erro;
  res.render("login");
}

function cadastro(req, res) {
  console.log(req.session.erro);
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Cadastro",
    erro: req.session.erro,
  };
  delete req.session.erro;
  res.render("cadastro");
}

async function autenticar(req, res) {
  console.log(req.body);
  const { email, senha } = req.body;
  let resp = await usuarioModel.verificarUsuario(email, senha);
  let data = resp[0].dataIngresso.getDate() + "/" + (resp[0].dataIngresso.getMonth() + 1) + "/" + resp[0].dataIngresso.getFullYear();
  if (resp.length > 0) {
    req.session.usuario = {
      id: resp[0].id,
      nome: resp[0].nome,
      email: resp[0].email,
      ong: resp[0].ong,
      dataIngresso: data,
      telefone: resp[0].telefone,
      foto: resp[0].foto,
      cidade: resp[0].cidade,
      erro: 0,
    };
    req.session.erro = 0;
    console.log("Usuário encontrado");
    res.redirect("/");
  } else {
    console.log("Usuário não encontrado");
    req.session.erro = "Email ou senha incorretos";
    res.redirect("/login");
  }
}

async function cadastrar(req, res) {
  console.log(req.body);
  const { nome, email, senha, senha2 } = req.body;
  if (senha !== senha2) {
    console.log("Senhas não conferem");
    req.session.erro = "Senhas não conferem";
    res.redirect("/cadastro");
  } else {
    let resp = await usuarioModel.cadastrarUsuario(nome, email, senha);
    if (resp === false) {
      console.log("Usuário já existe");
      req.session.erro = "Já existe um usuário com esse email";
      res.redirect("/cadastro");
    } else if (resp.affectedRows > 0) {
      console.log("Usuário cadastrado");
      req.session.erro = 0;
      res.redirect("/login");
    } else {
      console.log("Erro ao cadastrar usuário");
      req.session.erro = "Erro ao cadastrar usuário";
      res.redirect("/cadastro");
    }
  }
}

async function perfil(req, res) {
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Perfil",
    erro: req.session.erro,
  };
  delete req.session.erro;
  console.log("session:" + JSON.stringify(req.session.usuario));
  animais = await animaisController.listarAnimaisUsuario(req.session.usuario.id);
  animais.forEach(animal => { console.log("id: " + animal.id + " - nome: " + animal.nome) });
  res.render("perfil", { animais });
}

async function editarPerfil(req, res) {
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Editar Perfil",
  };
  let usuario = req.session.usuario;
  console.log("session:" + JSON.stringify(req.session.usuario));
  res.render("editarPerfil", { usuario });
}

async function salvarPerfil(req, res) {
  console.log(req.body);
  const { nome, email, telefone, cidade, ong } = req.body;
  let foto = "";
  if (req.file) {
    foto = req.file.filename;
    foto = await usuarioModel.salvarFotoCloudinary(foto);
  } else {
    foto = req.session.usuario.foto;
  }
  let resp = await usuarioModel.salvarPerfil(
    req.session.usuario.id,
    nome,
    email,
    telefone,
    cidade,
    foto,
    ong
  );
  if (resp === false) {
    console.log("Erro ao salvar perfil");
    req.session.erro = "Erro ao salvar perfil";
    res.redirect("/editarPerfil");
  } else if (resp.affectedRows > 0) {
    console.log("Perfil salvo");
      req.session.usuario.nome = nome;
      req.session.usuario.email = email;
      req.session.usuario.telefone = telefone;
      req.session.usuario.cidade = cidade;
      req.session.usuario.foto = foto;
      req.session.usuario.ong = ong;
      req.session.erro = 0;
      console.log("session:" + JSON.stringify(req.session.usuario));
      res.redirect("/perfil");
    } else {
      console.log("Erro ao salvar perfil");
      req.session.erro = "Erro ao salvar perfil";
      res.redirect("/editarPerfil");
    }
  }

  function logout(req, res) {
    delete req.session.usuario;
    res.redirect("/login");
  }

  module.exports = {
    login,
    cadastro,
    autenticar,
    cadastrar,
    logout,
    perfil,
    editarPerfil,
    salvarPerfil,
  };