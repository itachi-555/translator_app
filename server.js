const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware to parse JSON bodies

const translate = async (text, sourceLang, targetLang) => {
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
  const response = await axios.get(apiUrl);

  if (response.status !== 200) {
    throw new Error(`Translation failed: ${response.status}`);
  }

  return response.data.responseData.translatedText;
};

// Function to fetch languages from external API
async function getLanguages() {
  try {
    const response = await axios.get('https://libretranslate.com/languages', {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Extracting necessary data from response
    const languages = response.data.map(lang => ({
      code: lang.code,
      name: lang.name
    }));

    return languages; // Return the languages array
  } catch (error) {
    console.log(`error :${error}`);
  }
}
app.post('/translate', (req, res) => {
  const { word, language, tolanguage } = req.body;

  translate(word, language, tolanguage)
    .then((translation) => {
      console.log(`Translate ${word} from ${language} to ${tolanguage} : ${translation}`);
      res.status(200).json({ translation });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Translation failed' });
    });
});
// Endpoint to fetch languages
app.post('/', async (req, res) => {
  try {
    const languages = await getLanguages();
    console.log('Languages fetched successfully');
    res.status(200).json({ languages });
  } catch (error) {
    console.error('Error fetching languages:', error.message);
    res.status(500).json({ error: 'Fetching languages failed' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
