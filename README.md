# 🎵 Dalszöveg Generáló PRO - Frissített Verzió

## ✨ Új Funkciók

### 1. 🖼️ Borítókép Generálás (Gemini 2.5 Flash)
- **2:3 arányú képgenerálás** a dalszöveghez
- **Automatikus prompt generálás** a dalszöveg alapján
- **Egyedi prompt megadása** is lehetséges
- **Újragenerálás gomb** - ha nem tetszik a kép
- **Letöltés gomb** - a kép mentése PNG formátumban

### 2. 🎹 AI Zenei Segédeszközök
- **Zenei Stílus Ajánlás**: Műfaj, hangnem, tempó, hangulat javaslatok
- **Dallam Ötletek**: Dallam íve, ritmus, karakter, hangterjedelemjavaslatok
- **Akkord Progresszió**: Konkrét akkord sorok különböző hangnemekben
- **Angol Fordítás**: Rímeket és ritmust megtartó professzionális fordítás

### 3. 💾 Dalszöveg Mentés/Betöltés
- **localStorage alapú mentés** (böngészőben, adatbázis nélkül)
- **Dátum és idő** minden mentett dalszövegnél
- **Előnézet** a mentett dalszövegekből
- **Gyors betöltés** egy kattintással
- **Egyedi és teljes törlés** lehetőség

### 4. 🎨 Felhasználói Élmény Javítások
- **Tab-alapú navigáció** az AI eszközökhöz
- **Modernebb, átláthatóbb design**
- **Responsive elrendezés**
- **Betöltés animációk**
- **Ikonok és vizuális visszajelzések**

## 📋 Meglévő Funkciók
✅ Dalszöveg generálás témák alapján
✅ Rímképlet kiválasztás (AABB, ABAB, ABCB, AAAA)
✅ Versszakok és sorok száma testreszabható
✅ Kijelölt részek újragenerálása
✅ Chat a Gemini AI-val
✅ Másolás vágólapra
✅ Teljes HTML+CSS+JS megoldás

## 🚀 Telepítés és Használat

### Netlify Deployment
1. Töltsd fel a projektet a GitHub repositorydba
2. Csatlakoztasd Netlify-hoz
3. Állítsd be a környezeti változót:
   - `GEMINI_API_KEY_NEW`: A te Gemini API kulcsod

### Helyi Fejlesztés
```bash
# Függőségek telepítése
npm install

# Netlify Dev indítása (Netlify Functions támogatással)
netlify dev
```

### Google Cloud API Beállítás
1. Menj a [Google Cloud Console](https://console.cloud.google.com/)-ra
2. Hozz létre új projektet vagy válassz meglévőt
3. Engedélyezd a **Generative Language API**-t
4. Hozz létre API kulcsot
5. Add meg a kulcsot a Netlify környezeti változókban

## ⚠️ Fontos Megjegyzések

### Képgenerálás
A Gemini API képgenerálási funkcióját az `imagen-3.0-generate-001` modell biztosítja. Ez **jelenleg béta verzió**, és működése függhet az API elérhetőségétől.

**Alternatíva**: Ha az Imagen nem elérhető, használhatod helyette:
- DALL-E API-t (OpenAI)
- Stable Diffusion API-t
- Midjourney API-t (ha van hozzáférésed)

### localStorage Korlátozások
- A mentett dalszövegek **csak a böngészőben** tárolódnak
- Ha törölöd a böngésző adatait, elvesznek
- Átlag 5-10 MB tárhely áll rendelkezésre (böngészőnként változó)

### Adatbázis Integráció (Opcionális Fejlesztés)
Ha adatbázist szeretnél használni localStorage helyett:
1. **Firebase Firestore** - egyszerű NoSQL megoldás
2. **Supabase** - PostgreSQL backend
3. **MongoDB Atlas** - felhőalapú MongoDB

## 📝 Netlify Functions Módosítások

A `netlify/functions/gemini.js` fájlban az alábbi módokat támogatja:

| Mód | Leírás | Model |
|-----|--------|-------|
| `lyrics-gen` | Dalszöveg generálás | gemini-1.5-flash |
| `image-gen` | Borítókép generálás | imagen-3.0-generate-001 |
| `music-style` | Zenei stílus ajánlás | gemini-1.5-flash |
| `melody-ideas` | Dallam ötletek | gemini-1.5-flash |
| `chord-progression` | Akkord progresszió | gemini-1.5-flash |
| `translate-english` | Angol fordítás | gemini-1.5-flash |
| `chat` | Chat funkció | gemini-1.5-flash |
| `rhyme-search` | Rímkereső | gemini-1.5-flash |

## 🔄 Frissítések és Változtatások

### v2.0 (Jelenlegi)
- ✅ Képgenerálás 2:3 arányban
- ✅ Zenei stílus, dallam, akkord javaslatok
- ✅ Angol fordítás funkció
- ✅ localStorage alapú mentés
- ✅ Modernizált UI

### v1.0 (Eredeti)
- Alap dalszöveg generálás
- Rímkereső
- Chat funkció

## 💡 További Fejlesztési Ötletek

1. **Export funkciók**: PDF, DOCX, képként exportálás
2. **Megosztás**: Social media megosztás gombok
3. **Zene integráció**: Spotify, YouTube keresés
4. **Többnyelvű támogatás**: Több nyelven való fordítás
5. **Felhasználói fiókok**: Authenticationnel és adatbázissal
6. **Együttműködés**: Közös szerkesztés más felhasználókkal
7. **Verziókövetés**: Dalszöveg változatok tárolása

## 📞 Támogatás

Ha kérdésed van vagy hibát találsz, nyiss egy issue-t a GitHub repositoryban.

## 📄 Licenc

ISC License

---

**Készítette**: AI asszisztencia Claude-dal
**Utolsó frissítés**: 2025. október
