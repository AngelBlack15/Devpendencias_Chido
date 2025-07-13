// routes/auth.js
import { Router } from 'express';
import bcrypt     from 'bcrypt';
import jwt        from 'jsonwebtoken';
import User       from '../models/User.js';  // Fíjate en la extensión .js

const router = Router();

// POST /api/login
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Usuario, email y contraseña requeridos' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Correo no registrado' });

    if (user.name !== username.trim()) {
      return res.status(401).json({ error: 'Nombre de usuario incorrecto' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Opcional: devolver token
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ name: user.name /*, token*/ });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
