const express = require('express');
const axios = require('axios');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/translate
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { text, source_lang, target_lang } = req.body;
    if (!text || !target_lang) return res.status(400).json({ error: 'text and target_lang required' });

    const cached = await db.query(
      `SELECT translated_text FROM translation_cache WHERE source_text = $1 AND source_lang = $2 AND target_lang = $3`,
      [text, source_lang || 'auto', target_lang]
    );

    if (cached.rows.length) {
      await db.query(
        `UPDATE translation_cache SET hit_count = hit_count + 1 WHERE source_text = $1 AND target_lang = $2`,
        [text, target_lang]
      );
      return res.json({ translation: cached.rows[0].translated_text, cached: true });
    }

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      { q: text, source: source_lang, target: target_lang, format: 'text' }
    );

    const translation = response.data.data.translations[0].translatedText;

    await db.query(
      `INSERT INTO translation_cache (source_text, source_lang, target_lang, translated_text)
       VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      [text, source_lang || 'auto', target_lang, translation]
    );

    res.json({ translation, cached: false });
  } catch (err) {
    next(err);
  }
});

// POST /api/translate/audio
router.post('/audio', authenticate, async (req, res, next) => {
  try {
    const { text, language_code } = req.body;
    if (!text || !language_code) return res.status(400).json({ error: 'text and language_code required' });

    // Return TTS config — client uses expo-speech with these params
    const voiceMap = { DE: 'de-DE', EN: 'en-GB', FR: 'fr-FR', ES: 'es-ES', IT: 'it-IT' };
    res.json({
      text,
      language: voiceMap[language_code.toUpperCase()] || language_code,
      rate: 0.85,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
