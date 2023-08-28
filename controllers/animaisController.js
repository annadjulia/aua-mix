const animaisModel = require('../models/animaisModel');
let animais = [];

function cadastroAnimais(req, res) {
    res.render('cadAnimais');
}

async function listarAnimais(req, res) {
    animais = await animaisModel.listarAnimais();
    animais.forEach(async (animal) => {
        let especie = await animaisModel.getEspecie(animal.especie_id);
        animal.especie = especie[0].nome;
        let foto = await animaisModel.getFoto(animal.id);
        animal.foto = foto[0].url;
    });
    console.log(animais);
    res.render('animais', { animais });
}
/*
async function getAnimal(req, res) {
    const { id } = req.params;
    console.log("id"+id);
    let animal = await animaisModel.getAnimal(id);
    console.log(animal[0]);
    let especie = await animaisModel.getEspecie(animal[0].especie_id);
    animal[0].especie = especie[0].nome;
    let foto = await animaisModel.getFoto(animal[0].id);
    animal[0].foto = foto[0].url;
    console.log(animal);
    res.render('animal', { animal: animal[0] });
}
*/
async function cadastrar(req, res) {
    const {nome, especie, tamanho, idade, caracteristicas, foto} = req.body;
    console.log(req.session.usuario)
    const id_usuario = 1;
    console.log(req.body);
    let respEsp = await animaisModel.cadastrarEspecie(especie);
    if (respEsp.affectedRows > 0) {
        console.log('Espécie cadastrada');
    } else {
        console.log('Erro ao cadastrar espécie');
    }
    const id_especie = respEsp.insertId;
    let resp = await animaisModel.cadastrarAnimal(id_usuario, id_especie, nome, idade, caracteristicas);
    if (resp.affectedRows > 0) {
        console.log('Animal cadastrado');
        let respImg = await animaisModel.cadastrarImg(foto, resp.insertId);
        if (respImg.affectedRows > 0) {
            console.log('Imagem cadastrada');
        } else {
            console.log('Erro ao cadastrar imagem');
        }
        res.redirect('/animais');
    } else {
        console.log('Erro ao cadastrar animal');
        res.redirect('/cadastroAnimais');
    }
}

async function uploadImageToCloudinary(imagePath) {
    try {
      const result = await cloudinary.uploader.upload(imagePath);
      return result.secure_url;
    } catch (error) {
      console.error('Erro ao enviar imagem para o Cloudinary:', error);
      return null;
    }
  }

module.exports = { cadastroAnimais, cadastrar, listarAnimais, uploadImageToCloudinary};