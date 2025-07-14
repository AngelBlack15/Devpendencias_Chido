import { Router }                from 'express';
import { body, validationResult } from 'express-validator';
import Link                       from '../models/Link.js';

const router = Router();

// Crear enlace (visits y likes arrancan en 0)
router.post('/',
  body('title').notEmpty(),
  body('url').isURL(),
  body('tags').isArray({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    Link.create(req.body)
      .then(doc => res.status(201).json(doc))
      .catch(err => res.status(400).json({ error: err.message }));
  }
);

// Listar
router.get('/', async (req, res) => {
  try {
    const all = await Link.find().sort('-createdAt');
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar (incluir likes y visits)
router.put('/:id',
  body('title').optional().notEmpty(),
  body('url').optional().isURL(),
  body('tags').optional().isArray(),
  body('likes').optional().isInt({ min: 0 }),
  body('visits').optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

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
