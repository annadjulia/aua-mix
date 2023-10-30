const animaisModel = require('../models/animaisModel');
const cloudinary = require('cloudinary').v2;
let animais = [];

function cadastroAnimais(req, res) {
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Cadastro de animais"
    };
    res.render('cadAnimais');
}

async function listarAnimais(req, res) {
    animais = await animaisModel.listarAnimais();
    animais.forEach(async (animal) => {
        let especie = await animaisModel.getEspecie(animal.especie_id);
        animal.especie = especie[0].nome;
    });
    console.log(animais);
    res.locals.layoutVariables = {
        usuario: req.session.usuario,
        url: process.env.URL,
        title: "Animais"
    };
    res.render('animais', { animais });
}

async function getAnimal(req, res) {
    const { id } = req.params;
    console.log("id"+id);
    let animal = await animaisModel.getAnimal(id);
    if (animal.length == 0) {
        res.redirect('/animais');
    }else{
        console.log(animal[0]);
        console.log(animal);
        res.locals.layoutVariables = {
            usuario: req.session.usuario,
            url: process.env.URL,
            title: animal[0].nome
        };
        res.render('animal', { animal: animal[0] });
    }
}

async function cadastrar(req, res) {
    let {nome, especie, tamanho, idade, caracteristicas, foto} = req.body;
    foto = req.file;
    const id_usuario = req.session.usuario.id;
    const id_especie = 1;
    let resp = await animaisModel.cadastrarAnimal(id_usuario, id_especie, nome, idade, caracteristicas, foto);
    if (resp.affectedRows > 0) {
        console.log('Animal cadastrado');
        res.redirect('/animais');
    } else {
        console.log('Erro ao cadastrar animal');
        res.redirect('/cadastroAnimais');
    }
}

module.exports = { cadastroAnimais, cadastrar, getAnimal, listarAnimais};