export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { text, target_lang, source_lang  } = req.body;
  const deeplApiKey = process.env.DEEPL_API_KEY;

  if (!text || !target_lang) {
    return res.status(400).json({ error: 'Missing parameters', received: req.body });
  }

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${deeplApiKey}`
      },
      body: new URLSearchParams({
        text,
        target_lang,
        source_lang: source_lang || 'DE' // <- manuell setzen!
      })

    });

    const data = await response.json();
    console.log('DeepL Response:', data);

    return res.status(200).json({
      translatedText: data?.translations?.[0]?.text || '[Fehler: keine Übersetzung]'
    });

  } catch (err) {
    return res.status(500).json({ error: 'Translation failed', detail: err.message });
  }
}
