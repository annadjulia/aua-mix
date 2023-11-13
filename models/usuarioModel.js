const db = require('./db');
const md5 = require('md5');

async function verificarUsuario(email, senha){
    console.log('Verificando usuário');
    let sql = `SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${md5(senha)}'`;
    let resp = await db.query(sql);
    return resp;
}

async function verificarEmail(email){
    console.log('Verificando email');
    let sql = `SELECT * FROM usuarios WHERE email = '${email}'`;
    let resp = await db.query(sql);
    return resp;
}

async function cadastrarUsuario(nome, email, senha){
    console.log('Cadastrando usuário');
    let jaExiste = await verificarEmail(email);
    if(jaExiste.length > 0){
        console.log('Usuário já existe');
        return false;
    }
    let sql = `INSERT INTO usuarios (nome, email, senha, dataIngresso) VALUES ('${nome}', '${email}', '${md5(senha)}', NOW())`;
    let resp = await db.query(sql);
    return resp;
}

async function listarUsuarios(){
    console.log('Listando usuários');
    let sql = `SELECT * FROM usuarios`;
    let resp = await db.query(sql);
    return resp;
}

module.exports = { verificarUsuario, cadastrarUsuario, listarUsuarios };