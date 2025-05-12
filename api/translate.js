export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { text, target_lang } = req.body;
  const deeplApiKey = process.env.DEEPL_API_KEY;

  if (!text || !target_lang) {
    return res.status(400).json({ error: 'Missing text or target_lang' });
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
        target_lang
      })
    });

    const data = await response.json();
    res.status(200).json({ translatedText: data?.translations?.[0]?.text || text });
  } catch (e) {
    res.status(500).json({ error: 'Translation failed', detail: e.message });
  }
}
