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

    // Hívás a PHP API-ra
    try {
      outputDiv.innerText = "Generálás folyamatban...";
      const response = await fetch('api.php', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        outputDiv.innerText = `Hiba: Érvénytelen szerver válasz`;
        console.error('JSON parse hiba:', jsonError);
        return;
      }

      if (response.ok && data.message) {
        outputDiv.innerText = data.message.trim();
      } else {
        const errorMsg = data?.error || 'Ismeretlen hiba történt';
        outputDiv.innerText = `Hiba: ${errorMsg}`;
        console.error('API hiba:', data);
      }
    } catch (error) {
      outputDiv.innerText = `Hiba: ${error.message}`;
      console.error('Fetch hiba:', error);
    }
  });
});