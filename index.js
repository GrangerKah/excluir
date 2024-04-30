const express = require('express');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.disable("x-powered-by");

app.use(express.json());
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crudapi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CRUD de usuários',
      version: '1.0.0',
      description: 'API para criar, ler, atualizar e deletar usuários'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['index.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM usuario');
  res.json(rows);
});

app.post('/users', async (req, res) => {
  const { nome, idade} = req.body;
  const [result] = await pool.query('INSERT INTO usuario (nome, idade) VALUES (?, ?)', [nome, idade]);
  res.json({ id: result.insertId, nome:nome, idade:idade});
});

app.put('/users/:id', async (req, res) => {
  const { nome, idade } = req.body;
  const { id } = req.params;
  await pool.query('UPDATE usuario SET NOME = ?, IDADE = ? WHERE id = ?', [nome, idade, id]);
  res.status(200).json({ id: id,nome: nome, idade:idade });
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
  res.status(200).json({ id: Number(id) });
 
});

app.listen(3000);