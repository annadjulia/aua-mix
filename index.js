const express = require("express");
const app = express();
const PORT = 10000;
const HOST = "0.0.0.0";
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv").config();
const { v4: uuid } = require("uuid");
const path = require("path");
const usuarioController = require("./controllers/usuarioController");
const animaisController = require("./controllers/animaisController");
const usersController = require("./controllers/usersController");

//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = `${uuid()}-${file.originalname}`;
    cb(null, fileName);
  },
});
var upload = multer({ storage: storage });

//cloudinary
cloudinary.config({
  cloud_name: "dj1sdgtdr",
  api_key: "174723524863143",
  api_secret: "56QaNgRoQzpaHefInLcyQ-56TAc",
});

//session
app.use(session({ 
  secret: "abracadabra",
}));

//ejs
app.use(expressLayouts);
app.set("layout", "./layouts/default/login");
app.set("view engine", "ejs");

//body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "public")), (req, res, next) => {
  if (req.session.usuario) {
    console.log("Logado");
    next();
  } else {
    console.log("Não logado");
    console.log(req.url + " url , " + req.path + " path");
    if (
      req.url == "/cadastroAnimais" ||
      req.url == "/perfil" ||
      req.url == "/logout" ||
      req.url == "/editarPerfil" ||
      req.url == "/salvarPerfil"
    ) {
      res.locals.layoutVariables = {
        usuario: null,
        url: process.env.URL,
        title: "Login",
        erro: "Você precisa estar logado para acessar essa página",
      };
      req.session.erro = "Você precisa estar logado para acessar essa página";
      res.redirect("/login");
    } else {
      res.locals.layoutVariables += {
        erro: req.session.erro,
      };
      next();
    }
  }
});

//rotas
app.get("/", (req, res) => {
  app.set("layout", "./layouts/default/main");
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Home",
    erro: req.session.erro,
  };
  res.render("home");
});

app.get("/sobre", (req, res) => {
  app.set("layout", "./layouts/default/main");
  res.locals.layoutVariables = {
    usuario: req.session.usuario,
    url: process.env.URL,
    title: "Sobre",
  };
  res.render("sobre");
});

//usuario
app.get("/login", (req, res) => {
  app.set("layout", "./layouts/default/login");
  usuarioController.login(req, res);
});

app.post("/login", (req, res) => {
  usuarioController.autenticar(req, res);
});

app.get("/cadastro", (req, res) => {
  app.set("layout", "./layouts/default/login");
  usuarioController.cadastro(req, res);
});

app.post("/cadastro", (req, res) => {
  usuarioController.cadastrar(req, res);
});

app.get("/perfil", (req, res) => {
  app.set("layout", "./layouts/default/main");
  usuarioController.perfil(req, res);
});

app.get("/editarPerfil", (req, res) => {
  app.set("layout", "./layouts/default/main");
  usuarioController.editarPerfil(req, res);
});

app.post("/salvarPerfil", upload.single("foto"), (req, res) => {
  usuarioController.salvarPerfil(req, res);
});

app.get("/logout", (req, res) => {
  usuarioController.logout(req, res);
});

//users
app.get("/users", (req, res) => {
  app.set("layout", "./layouts/default/main");
  usersController.usuarios(req, res);
});

app.get("/users/:id", (req, res) => {
  app.set("layout", "./layouts/default/main");
  usersController.getUsuario(req, res);
});

//animais
app.get("/cadastroAnimais", (req, res) => {
  app.set("layout", "./layouts/default/main");
  animaisController.cadastroAnimais(req, res);
});

app.post("/cadastroAnimais", upload.single("foto"), (req, res) => {
  animaisController.cadastrar(req, res);
});

app.get("/animais", (req, res) => {
  app.set("layout", "./layouts/default/main");
  animaisController.listarAnimais(req, res);
});

app.get("/animais/:id", (req, res) => {
  app.set("layout", "./layouts/default/main");
  animaisController.getAnimal(req, res);
});

app.get("/editarAnimal/:id", (req, res) => {
  app.set("layout", "./layouts/default/main");
  animaisController.editarAnimal(req, res);
});

app.post("/salvarAnimal", upload.single("foto"), (req, res) => {
  animaisController.salvarAnimal(req, res);
});

app.get("/excluirAnimal/:id", (req, res) => {
  animaisController.excluirAnimal(req, res);
});

app.get("/pesquisarAnimal", (req, res) => {
  app.set("layout", "./layouts/default/main");
  animaisController.pesquisarAnimal(req, res);
});

//server
app.listen(PORT, () => {
  console.log(`Servidor rodando em ${HOST}:${PORT}`);
});
