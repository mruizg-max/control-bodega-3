const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. TU CONEXIÓN (Pega aquí tu link de MongoDB Atlas)
const mongoURI = "mongodb+srv://mruizg_db_user:a7jmca7XAYdmVrST@miproyectologistico.v8cdw8u.mongodb.net/ControlBodega?retryWrites=true&w=majority";

mongoose.connect('mongodb://mruizg_db_user:mruizg_db_password@cluster0-shard-00-00.v8cdw8u.mongodb.net:27017,cluster0-shard-00-01.v8cdw8u.mongodb.net:27017,cluster0-shard-00-02.v8cdw8u.mongodb.net:27017/controlBodega?ssl=true&replicaSet=atlas-shard-0&authSource=admin&retryWrites=true&w=majority')

  .catch(err => console.error("❌ Error de conexión:", err));

// 2. MODELOS DE DATOS
const Usuario = mongoose.model('Usuario', new mongoose.Schema({ nombre: String }));
const Registro = mongoose.model('Registro', new mongoose.Schema({
  usuario: String,
  sku: String,
  tipo: String,
  fecha: { type: Date, default: Date.now }
}));

// 3. CARGA AUTOMÁTICA DE TUS USUARIOS
async function inicializarUsuarios() {
  const count = await Usuario.countDocuments();
  if (count === 0) {
    const nombres = ["JEFA MAGDA", "E. JHONNY", "AZRA", "MIGUEL", "ANGELA", "IVONNE", "MARIO", "DULCE", "ALEXA", "OSIEL"];
    await Usuario.insertMany(nombres.map(n => ({ nombre: n })));
    console.log("👥 Usuarios listos");
  }
}

// 4. RUTAS PARA EL DASHBOARD
app.get('/api/usuarios', async (req, res) => {
  const lista = await Usuario.find();
  res.json(lista.map(u => u.nombre));
});

app.post('/api/registrar', async (req, res) => {
  try {
    const nuevo = new Registro(req.body);
    await nuevo.save();
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
