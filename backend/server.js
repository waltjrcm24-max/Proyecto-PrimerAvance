const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes, intenta más tarde',
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND active = true',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = result.rows[0];
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas de registros de residuos
app.get('/api/waste-records', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, type, location } = req.query;
    let query = 'SELECT * FROM waste_records WHERE 1=1';
    const params = [];
    
    if (startDate) {
      params.push(startDate);
      query += ` AND date >= $${params.length}`;
    }
    
    if (endDate) {
      params.push(endDate);
      query += ` AND date <= $${params.length}`;
    }
    
    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }
    
    if (location) {
      params.push(location);
      query += ` AND location = $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo registros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/waste-records', authenticateToken, async (req, res) => {
  try {
    const { type, location, weight, date, time, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO waste_records (type, location, weight, date, time, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [type, location, weight, date, time, notes, req.user.userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/waste-records/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM waste_records WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de usuarios (solo admin)
app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  try {
    const result = await pool.query(
      'SELECT id, username, email, name, role, active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de mensajes de operadores
app.get('/api/operator-messages', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  try {
    const result = await pool.query(
      'SELECT * FROM operator_messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/operator-messages', authenticateToken, async (req, res) => {
  try {
    const { message, record_id } = req.body;
    
    const userResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    const result = await pool.query(
      `INSERT INTO operator_messages (operator_id, operator_name, message, record_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.userId, userResult.rows[0].name, message, record_id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'Local'}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...');
  pool.end();
  process.exit(0);
});