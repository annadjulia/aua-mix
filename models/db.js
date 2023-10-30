const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: 'mysql.infocimol.com.br',
      user: 'infocimol04',
      password: '123adoteumamigo',
      database: 'infocimol04'
    });
    console.log('Conexão estabelecida com sucesso');
    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

async function query(sql) {
  const connection = await connect();
  try {
    const [rows, fields] = await connection.execute(sql);
    console.log('Query executada com sucesso');
    return rows;
  } catch (error) {
    console.error('Erro ao executar a query:', error);
    throw error;
  } finally {
    if (connection) {
        connection.end();
        console.log('Conexão encerrada');
    }
  }
}

module.exports = {query};