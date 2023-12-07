const animaisModel = require("../models/animaisModel");
const usersModel = require("../models/usersModel");
let animais = [];

function cadastroAnimais(req, res) {
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Cadastro de animais",
  };
  res.render("cadAnimais");
}

async function cadastrar(req, res) {
  let { nome, idade, caracteristicas, especie, tamanho, sexo, foto } = req.body;
  foto = req.file;
  console.log(caracteristicas[0])
  caracteristicas = caracteristicas[0];
  const id_usuario = req.session.usuario.id;
  const id_especie = 1;
  let resp = await animaisModel.cadastrarAnimal(
    id_usuario,
    id_especie,
    nome,
    idade,
    caracteristicas,
    foto,
    tamanho,
    sexo
  );
  if (resp.affectedRows > 0) {
    console.log("Animal cadastrado");
    res.redirect("/animais");
  } else {
    console.log("Erro ao cadastrar animal");
    res.redirect("/cadastroAnimais");
  }
}

async function listarAnimais(req, res) {
  animais = await animaisModel.listarAnimais();
  animais.forEach(animal => { console.log("id: " + animal.id + " - nome: " + animal.nome) });
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Animais",
  };
  res.render("animais", { animais });
}

async function getAnimal(req, res) {
  const { id } = req.params;
  console.log("id" + id);
  let animal = await animaisModel.getAnimal(id);
  if (animal.length == 0) {
    res.redirect("/animais");
  } else {
    console.log(animal[0]);
    console.log(animal);
    res.locals.layoutVariables = {
      usuario: req.session.usuario,
      url: process.env.URL,
      title: animal[0].nome,
    };
    let data = animal[0].dataAdd.getDate() + "/" + (animal[0].dataAdd.getMonth() + 1) + "/" + animal[0].dataAdd.getFullYear();
    animal[0].dataAdd = data
    animal[0].caracteristicas = JSON.parse(animal[0].caracteristicas);
    let usuario = await usersModel.getUsuario(animal[0].usuario_id);
    res.render("animal", { animal: animal[0], usuario: usuario[0] });
  }
}

async function listarAnimaisUsuario(id) {
  let animais = await animaisModel.listarAnimaisUsuario(id);
  return animais;
}

async function editarAnimal(req, res) {
  
  
}

async function salvarAnimal(req, res) {
  const { id } = req.params;
  let resp = await animaisModel.salvarAnimal(id);
  if (resp.affectedRows > 0) {
    console.log("Animal salvo");
    res.redirect("/animais");
  } else {
    console.log("Erro ao salvar animal");
    res.redirect("/animais");
  }
}

  async function excluirAnimal(req, res) {
    const { id } = req.params;
    let resp = await animaisModel.excluirAnimal(id);
    if (resp.affectedRows > 0) {
      console.log("Animal excluído");
      req.session.erro = "Animal excluído";
    } else {
      console.log("Erro ao excluir animal");
      req.session.erro = "Erro ao excluir animal";
    }
    res.redirect("/perfil");
  }

  module.exports = {
    cadastroAnimais,
    cadastrar,
    getAnimal,
    listarAnimais,
    listarAnimaisUsuario,
    editarAnimal,
    excluirAnimal
  };
