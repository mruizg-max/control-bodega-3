const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Configuración para leer datos de los formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (tu HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// --- CONEXIÓN A MONGODB (CORREGIDA) ---
const mongoURI = 'mongodb://mruizg_db_user:Bodega2024*@cluster0-shard-00-00.v8cdw8u.mongodb.net:27017,cluster0-shard-00-01.v8cdw8u.mongodb.net:27017,cluster0-shard-00-02.v8cdw8u.mongodb.net:27017/controlBodega?ssl=true&replicaSet=atlas-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// --- MODELO DE DATOS ---
const RegistroSchema = new mongoose.Schema({
    nombre: String,
    sku: String,
    fecha: { type: Date, default: Date.now }
});
const Registro = mongoose.model('Registro', RegistroSchema);

// --- RUTAS ---

// 1. Ruta para guardar un registro
app.post('/api/guardar', async (req, res) => {
    try {
        const nuevoRegistro = new Registro(req.body);
        await nuevoRegistro.save();
        res.status(200).send("✅ Registro guardado con éxito");
    } catch (error) {
        res.status(500).send("❌ Error al guardar en la base de datos");
    }
});

// 2. Ruta para obtener registros
app.get('/api/registros', async (req, res) => {
    try {
        const registros = await Registro.find().sort({ fecha: -1 });
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: "No se pudieron obtener los registros" });
    }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
