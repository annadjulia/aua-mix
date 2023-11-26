const db = require("./db");

async function listarUsuarios() {
  console.log("Listando usuários");
  let sql = `SELECT * FROM usuarios`;
  let resp = await db.query(sql);
  return resp;
}

async function getUsuario(id) {
  console.log("Procurando usuário");
  let sql = `SELECT * FROM usuarios WHERE id = ${id}`;
  let resp = await db.query(sql);
  return resp;
}

module.exports = {
  listarUsuarios,
  getUsuario
};