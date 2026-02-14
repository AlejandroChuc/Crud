const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Puedes borrar o comentar la línea de require('express-mongo-sanitize')
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors());
app.use(express.json()); // El sanitizador debe ir DESPUÉS de esto

// COPIA Y PEGA AQUÍ EL SANITIZADOR MANUAL:
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (var key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key]; 
        } else {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };
  req.body = sanitize(req.body);
  next();
});

// --- CONEXIÓN A BASE DE DATOS ---
mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// --- MODELO ---
const Item = mongoose.model('Item', new mongoose.Schema({
  dato: { type: String, required: true }
}));

// --- RUTAS (Siguen igual abajo...) ---
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// ... resto de tus rutas (post, put, delete)