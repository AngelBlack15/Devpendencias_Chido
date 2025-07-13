// controllers/userController.js
const bcrypt = require('bcrypt');
const User   = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validaciones básicas
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email y password son obligatorios' });
  }

  try {
    // Verificar email único
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Correo ya registrado' });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = new User({ name, email, password: hash });
    await user.save();

    // Devolver datos públicos
    const { password: pw, ...publicData } = user.toObject();
    res.status(201).json(publicData);
  } catch (err) {
    console.error('❌ Error register user:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const users = await User.find().select('name email -_id');
    res.json(users);
  } catch (err) {
    console.error('❌ Error list users:', err);
    res.status(500).json({ error: err.message });
  }
};
