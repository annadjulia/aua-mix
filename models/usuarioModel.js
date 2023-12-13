const db = require("./db");
const md5 = require("md5");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

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

async function salvarPerfil(id, nome, email, telefone, cidade, foto, ong) {
  console.log("Salvando perfil");
  let sql = `UPDATE usuarios SET nome = '${nome}', email = '${email}', telefone = '${telefone}', cidade = '${cidade}', foto = '${foto}', ong = '${ong}' WHERE id = ${id}`;
  let resp = await db.query(sql);
  return resp;
}

async function salvarFotoCloudinary(foto) {
  console.log("Salvando foto no Cloudinary");
  try {
    let rota = path.join(__dirname, "../");
    fotoUrl = await cloudinary.uploader.upload(
      rota + "/public/uploads/" + foto,
      { folder: "media-AUA" }
    );
    console.log(fotoUrl.secure_url);
    fs.unlinkSync(rota + "/public/uploads/" + foto);
    return fotoUrl.secure_url;
  } catch (err) {
    console.log("erro:" + err);
  }
}

module.exports = {
  verificarUsuario,
  cadastrarUsuario,
  salvarPerfil,
  salvarFotoCloudinary,
};
