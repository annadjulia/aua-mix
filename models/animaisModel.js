const db = require('./db');
const cloudinary = require('cloudinary').v2;
const path = require('path');

async function listarAnimais(){
    console.log('Listando animais');
    let sql = `SELECT * FROM animais ORDER BY id DESC`;
    let resp = await db.query(sql);
    return resp;
}

async function cadastrarAnimal(id_usuario, id_especie, nome, idade, caracteristicas, foto){
    console.log('Cadastrando animal');
    let sql = `INSERT INTO animais (usuario_id, especie_id, nome, idade, detalhes, disponivel)
    VALUES ('${id_usuario}', '${id_especie}', '${nome}', '${idade}', '${caracteristicas}', 1)`;
    let resp = await db.query(sql);
    console.log(resp);
    let id_animal = resp.insertId;
    console.log(id_animal);
    let fotoUrl;
    try{
        let rota = path.join(__dirname, '../');
        fotoUrl = await cloudinary.uploader.upload(rota+"/public/uploads/"+foto, {folder: 'media-AUA'});
        console.log(fotoUrl.secure_url);
        fs.unlinkSync(rota+"/public/uploads/"+foto);
        
    }catch (err){
        console.log(err);
    }
    try{
        let respFoto = await cadastrarImg(fotoUrl.secure_url, id_animal);
    }catch (err){
        console.log(err);
    }
    
    return resp;
}

async function getAnimal(id){
    console.log('Buscando animal');
    let sql = `SELECT * FROM animais WHERE id = '${id}'`;
    let resp = await db.query(sql);
    return resp;
}

async function getEspecie(id){
    console.log('Buscando espécie');
    let sql = `SELECT * FROM especies WHERE id = '${id}'`;
    let resp = await db.query(sql);
    return resp;
}

async function cadastrarImg(foto, id_animal){
    console.log('Cadastrando imagem');
    let sql = `INSERT INTO fotos (animal_id, url) VALUES ('${id_animal}', '${foto}')`;
    let resp = await db.query(sql);
    console.log(resp);
    return resp;
}

async function getFoto(id){
    console.log('Buscando foto');
    let sql = `SELECT * FROM fotos WHERE animal_id = '${id}'`;
    let resp = await db.query(sql);
    return resp;
}

module.exports = { listarAnimais, cadastrarAnimal, getAnimal,  getEspecie, cadastrarImg, getFoto };