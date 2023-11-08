const db = require('./db');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

async function listarAnimais(){
    console.log('Listando animais');
    let sql = `SELECT animais.*, fotos.url, fotos.legenda FROM animais 
                INNER JOIN fotos on fotos.animal_id = animais.id
                ORDER BY animais.id DESC`;
    try{
        let resp = await db.query(sql);
        return resp;
    }
    catch(err){
        console.log(err);
    }
}

async function cadastrarAnimal(id_usuario, id_especie, nome, idade, caracteristicas, foto){
    console.log('Cadastrando animal');
    let sql = `INSERT INTO animais (usuario_id, especie_id, nome, idade, detalhes, disponivel)
    VALUES ('${id_usuario}', '${id_especie}', '${nome}', '${idade}', '${caracteristicas}', 1)`;
    let resp = await db.query(sql);
    console.log(resp);
    let id_animal = resp.insertId;
    console.log(id_animal);
    let fotoUrl, respFoto;
    foto = foto.filename;
    try{
        let rota = path.join(__dirname, '../');
        fotoUrl = await cloudinary.uploader.upload(rota+"/public/uploads/"+foto, {folder: 'media-AUA'});
        console.log(fotoUrl.secure_url);
        fs.unlinkSync(rota+"/public/uploads/"+foto);
        respFoto = await cadastrarImg(fotoUrl.secure_url, id_animal);
        console.log(respFoto);
        if(respFoto.affectedRows == 1){
            console.log('Imagem cadastrada com sucesso');
        }else{
            console.log('Erro ao cadastrar imagem');
        }
    }catch (err){
        console.log("erro:"+err);
    }
    
    return resp;
}

async function getAnimal(id){
    console.log('Buscando animal');
    let sql = `SELECT animais.*, fotos.url, fotos.legenda FROM animais 
                INNER JOIN fotos on fotos.animal_id = animais.id 
                WHERE animais.id = '${id}'`;
                console.log(path)
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