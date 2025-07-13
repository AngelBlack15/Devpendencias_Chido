// routes/links.js
import { Router }               from 'express';
import { body, validationResult } from 'express-validator';
import Link                      from '../models/Link.js';

const router = Router();

// Crear enlace
router.post('/',
  body('title').notEmpty().withMessage('Título obligatorio'),
  body('url').isURL().withMessage('URL inválida'),
  body('tags').isArray({ min: 1 }).withMessage('Debes enviar al menos una etiqueta'),
  body('tags.*').isString().withMessage('Etiqueta inválida'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    Link.create(req.body)
      .then(doc => res.status(201).json(doc))
      .catch(err => res.status(400).json({ error: err.message }));
  }
);

// Listar enlaces
router.get('/', async (req, res) => {
  try {
    const all = await Link.find().sort('-createdAt');
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar
router.put('/:id',
  body('title').notEmpty().withMessage('Título obligatorio'),
  body('url').isURL().withMessage('URL inválida'),
  body('tags').isArray({ min: 1 }).withMessage('Debes enviar al menos una etiqueta'),
  body('tags.*').isString().withMessage('Etiqueta inválida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const link = await Link.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!link) return res.status(404).json({ error: 'No encontrado' });
      res.json(link);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await Link.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
