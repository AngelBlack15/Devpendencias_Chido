import 'dotenv/config';
import express      from 'express';
import mongoose     from 'mongoose';
import cors         from 'cors';
import cookieParser from 'cookie-parser';
import path         from 'path';

import authRoutes           from './routes/auth.js';
import administratorsRoutes from './routes/administrators.js';
import linksRoutes          from './routes/links.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Rutas API
app.use('/api/administrators', administratorsRoutes);
app.use('/api/login',           authRoutes);
app.use('/api/links',           linksRoutes);

// 404 para /api que no existan
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// En producción, servir la carpeta `dist` de Vite (o tu build)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve('devpendencias-ui', 'dist');
  app.use(express.static(distPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // En desarrollo, placeholder en /
  app.get('/', (req, res) => {
    res.send('API Express corriendo en http://localhost:' + PORT);
  });
}

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGO_URI, { dbName: 'devpendencias' })
  .then(() => {
    console.log(`✅ MongoDB conectado a ${mongoose.connection.name}`);
    app.listen(PORT, () =>
      console.log(`🚀 Server corriendo en http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Error al conectar MongoDB:', err.message);
    process.exit(1);
  });
