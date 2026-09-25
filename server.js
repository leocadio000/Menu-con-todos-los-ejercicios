const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite'); // módulo SQLite incluido en Node.js (v22.5+), sin instalación

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- BASE DE DATOS (SQLite) -------------------
// El archivo lab_prog3.db se crea automáticamente en la raíz del proyecto.
const dbPath = path.join(__dirname, 'lab_prog3.db');
const db = new DatabaseSync(dbPath);

// Crear tablas si no existen (equivalente a database.sql)
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS registros_formulario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cedula TEXT UNIQUE NOT NULL,
    correo TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    profesion TEXT,
    nivel_estudios TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Sembrar usuario admin por defecto (admin / admin123) con contraseña hasheada
const usuarioExistente = db.prepare('SELECT * FROM usuarios WHERE username = ?').get('admin');
if (!usuarioExistente) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO usuarios (username, password) VALUES (?, ?)').run('admin', hash);
  console.log('Usuario admin creado (admin / admin123)');
}

// ------------------- MIDDLEWARES -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_lab_programacion_3',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hora
}));

// Middleware de autenticación
function autenticado(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.status(401).json({ error: 'No autorizado. Por favor inicia sesión.' });
  }
}

// ------------------- RUTAS DE AUTENTICACIÓN (Login) -------------------

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM usuarios WHERE username = ?').get(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.usuario = user.username;
      res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/check-auth', (req, res) => {
  if (req.session.usuario) {
    res.json({ autenticado: true, usuario: req.session.usuario });
  } else {
    res.json({ autenticado: false });
  }
});

// ------------------- MENÚ DINÁMICO (JSON) -------------------

app.get('/api/menu', autenticado, (req, res) => {
  const menuEstructura = [
    { id: 'p1', titulo: 'Práctica 1: Página Personal', modulo: 'p1' },
    { id: 'p2', titulo: 'Práctica 2: Biografía y Horario', modulo: 'p2' },
    { id: 'p3', titulo: 'Práctica 3: Banco XX (CSS)', modulo: 'p3' },
    { id: 'p5', titulo: 'Práctica 5: Módulo de Pruebas', modulo: 'p5' },
    { id: 'p6', titulo: 'Práctica 6: XML, JSON y AJAX', modulo: 'p6' },
    { id: 'p7', titulo: 'Práctica 7: Formulario Multipágina (BD)', modulo: 'p7' },
    { id: 'p8', titulo: 'Práctica 8: Explicación MVC', modulo: 'p8' },
    { id: 'p9', titulo: 'Práctica 9: Validador de Cédula (Módulo 10)', modulo: 'p9' },
    { id: 'p10', titulo: 'Práctica 10: Spring Framework', modulo: 'p10' }
  ];
  res.json(menuEstructura);
});

// ------------------- FORMULARIO MULTIPÁGINA A BD -------------------

app.post('/api/registro-multipaso', autenticado, (req, res) => {
  const { nombre, apellido, cedula, correo, telefono, direccion, profesion, nivel_estudios } = req.body;

  if (!nombre || !apellido || !cedula || !correo) {
    return res.status(400).json({ success: false, error: 'Faltan campos obligatorios.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO registros_formulario (nombre, apellido, cedula, correo, telefono, direccion, profesion, nivel_estudios)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      nombre, apellido, cedula, correo,
      telefono ?? null, direccion ?? null, profesion ?? null, nivel_estudios ?? null
    );
    const registro = db.prepare('SELECT * FROM registros_formulario WHERE id = ?').get(info.lastInsertRowid);
    res.json({ success: true, registro });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Listado de registros guardados (útil para verificar que la BD está funcionando)
app.get('/api/registros', autenticado, (req, res) => {
  const registros = db.prepare('SELECT * FROM registros_formulario ORDER BY id DESC').all();
  res.json(registros);
});

// ------------------- SERVICIO WEB CÉDULA (Módulo 10) -------------------

app.post('/api/validar-cedula', (req, res) => {
  const { cedula } = req.body;
  if (!cedula) return res.status(400).json({ esValida: false, mensaje: 'Cédula requerida' });

  const c = cedula.replace(/-/g, '');
  if (c.length !== 11 || isNaN(c)) {
    return res.json({ esValida: false, mensaje: 'La cédula debe contener exactamente 11 dígitos numéricos.' });
  }

  let suma = 0;
  const pesos = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

  for (let i = 0; i < 10; i++) {
    let mult = parseInt(c.charAt(i)) * pesos[i];
    if (mult >= 10) mult = Math.floor(mult / 10) + (mult % 10);
    suma += mult;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;
  const esValida = digitoVerificador === parseInt(c.charAt(10));

  res.json({
    cedula: c,
    esValida,
    mensaje: esValida ? 'Cédula válida' : 'Cédula inválida'
  });
});

app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));
