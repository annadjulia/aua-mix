const db = require('./db');

async function listarAnimais(){
    console.log('Listando animais');
    let sql = `SELECT * FROM animais ORDER BY id DESC`;
    let resp = await db.query(sql);
    return resp;
}

async function cadastrarAnimal(id_usuario, id_especie, nome, idade, caracteristicas){
    console.log('Cadastrando animal');
    let sql = `INSERT INTO animais (usuario_id, especie_id, nome, idade, detalhes, disponivel)
    VALUES ('${id_usuario}', '${id_especie}', '${nome}', '${idade}', '${caracteristicas}', 1)`;
    let resp = await db.query(sql);
    console.log(resp);
    return resp;
}

async function getAnimal(id){
    console.log('Buscando animal');
    let sql = `SELECT * FROM animais WHERE id = '${id}'`;
    let resp = await db.query(sql);
    return resp;
}

async function cadastrarEspecie(nome){
    console.log('Cadastrando espécie');
    let sql = `INSERT INTO especies (nome) VALUES ('${nome}')`;
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

module.exports = { listarAnimais, cadastrarAnimal, getAnimal, cadastrarEspecie, getEspecie, cadastrarImg, getFoto };