const usersModel = require("../models/usersModel");
const animaisController = require("./animaisController");

async function usuarios(req, res) {
  res.locals.layoutVariables = {
    usuario: req.session.usuario !== undefined ? req.session.usuario : 0,
    url: process.env.URL,
    title: "Usuários",
  };
  console.log("locals: " + res.locals.layoutVariables.usuario);
  let usuarios = await usersModel.listarUsuarios();
  usuarios.forEach(user => { console.log("id: "+user.id+" - nome: "+user.nome) });
  res.render("usuarios", { usuarios });
}

async function getUsuario(req, res) {
  const { id } = req.params;
  let usuario = await usersModel.getUsuario(id);
  if (usuario.length == 0) {
    res.redirect("/users");
  } else {
    console.log(usuario[0]);
    console.log(usuario);
    res.locals.layoutVariables = {
      usuario: req.session.usuario,
      url: process.env.URL,
      title: usuario[0].nome,
    };
    //pegar lista de animais do usuario
    let data = usuario[0].dataIngresso.getDate() + "/" + (usuario[0].dataIngresso.getMonth() + 1) + "/" + usuario[0].dataIngresso.getFullYear();
    usuario[0].dataIngresso = data
    let animais = await animaisController.listarAnimaisUsuario(id);
    animais.forEach(animal => { console.log("id: "+animal.id+" - nome: "+animal.nome) });
    res.render("usuario", { usuario: usuario[0], animais });
  }
}

module.exports = {
  usuarios,
  getUsuario,
};
