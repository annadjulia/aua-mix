const db = require("./db");
const md5 = require("md5");

async function verificarUsuario(email, senha) {
  console.log("Verificando usuário");
  let sql = `SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${md5(
    senha
  )}'`;
  let resp = await db.query(sql);
  return resp;
}

async function verificarEmail(email) {
  console.log("Verificando email");
  let sql = `SELECT * FROM usuarios WHERE email = '${email}'`;
  let resp = await db.query(sql);
  return resp;
}

async function cadastrarUsuario(nome, email, senha) {
  console.log("Cadastrando usuário");
  let jaExiste = await verificarEmail(email);
  let foto = 'https://res.cloudinary.com/dj1sdgtdr/image/upload/v1701051379/media-AUA/profile-pic_trfvz8.png';
  let cidade = 'Região Metropolitana de Porto Alegre';
  if (jaExiste.length > 0) {
    console.log("Usuário já existe");
    return false;
  }
  let sql = `INSERT INTO usuarios (nome, email, senha, foto, cidade, dataIngresso) VALUES ('${nome}', '${email}', 
  '${md5(senha)}', '${foto}', '${cidade}', NOW())`;
  let resp = await db.query(sql);
  return resp;
}

module.exports = {
  verificarUsuario,
  cadastrarUsuario
};
