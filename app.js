// app.js
document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-lyrics-button');
  const promptInput = document.getElementById('lyrics-prompt');
  const outputDiv = document.getElementById('lyrics-output');

  generateButton.addEventListener('click', async () => {
    const prompt = promptInput.value;
    if (!prompt) {
      alert('Kérlek, adj meg egy témát!');
      return;
    }

    // Hívás a Netlify Functionre
    try {
      outputDiv.innerText = "Generálás folyamatban...";
      const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (response.ok) {
        outputDiv.innerText = data.message;
      } else {
        outputDiv.innerText = `Hiba: ${data.error}`;
      }
    } catch (error) {
      outputDiv.innerText = `Hiba: ${error.message}`;
    }
  });
});