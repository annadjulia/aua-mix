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

async function salvarPerfil(id, nome, email, telefone, cidade, foto) {
  console.log("Salvando perfil");
  try {
    let rota = path.join(__dirname, "../");
    fotoUrl = await cloudinary.uploader.upload(
      rota + "/public/uploads/" + foto,
      { folder: "media-AUA" }
    );
    console.log(fotoUrl.secure_url);
    fs.unlinkSync(rota + "/public/uploads/" + foto);
    respFoto = await cadastrarImg(fotoUrl.secure_url, id_animal);
    console.log(respFoto);
    if (respFoto.affectedRows == 1) {
      console.log("Imagem cadastrada com sucesso");
    } else {
      console.log("Erro ao cadastrar imagem");
    }
  } catch (err) {
    console.log("erro:" + err);
  }
  let sql = `UPDATE usuarios SET nome = '${nome}', email = '${email}', telefone = '${telefone}', cidade = '${cidade}', foto = '${foto}' WHERE id = ${id}`;
  let resp = await db.query(sql);
  return resp;
}

module.exports = {
  verificarUsuario,
  cadastrarUsuario,
  salvarPerfil,
};
