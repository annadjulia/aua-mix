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

async function listarAnimais(req, res) {
  animais = await animaisModel.listarAnimais();
  console.log(animais);
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

module.exports = {
  cadastroAnimais,
  cadastrar,
  getAnimal,
  listarAnimais,
  listarAnimaisUsuario
};
