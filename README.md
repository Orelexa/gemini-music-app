# 🎵 Dalszöveg Generáló PRO - PocketBase Verzió

## 🔄 Migráció: Firebase/Netlify → Laragon + PocketBase

Ez a verzió a **saját webszerveren** fut Laragon-nal és PocketBase adatbázissal.

## ✨ Funkciók

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
- **Suno Prompt Generátor**: Automatikus Suno AI prompt készítés

### 3. 💾 Dalszöveg Mentés/Betöltés (PocketBase)
- **PocketBase adatbázis** - perzisztens mentés
- **Dátum és idő** minden mentett dalszövegnél
- **Előnézet** a mentett dalszövegekből
- **Gyors betöltés** egy kattintással
- **Egyedi és teljes törlés** lehetőség
- **Export/Import** JSON formátumban

### 4. ✏️ Interaktív Szerkesztő
- **Versszak és sor generálás** AI-val
- **Szó variációk** generálása
- **Kijelölt részek finomítása**
- **Zenei címkék** beszúrása ([Verse], [Chorus], stb.)
- **Real-time preview**

### 5. 🌍 Fordító (Angol ⇄ Magyar)
- Kétirányú fordítás
- Természetes nyelvhasználat
- Kontextus-tudatos fordítás

## 🚀 Telepítés

### Előfeltételek
1. **Laragon** telepítve és futva
2. **PocketBase** telepítve és futva a `192.168.1.122:8090` címen
3. **PHP 7.4+** Laragon-nal
4. **Gemini API kulcs** (Google Cloud Console)

### 1. PocketBase Beállítása

Kövesd a `POCKETBASE_SETUP.md` útmutatót:
```bash
# PocketBase indítása (ha még nem fut)
cd /path/to/pocketbase
./pocketbase serve --http="192.168.1.122:8090"
```

Majd nyisd meg a PocketBase Admin UI-t:
```
http://192.168.1.122:8090/_/
```

Hozd létre a `lyrics` collection-t a `POCKETBASE_SETUP.md` szerint.

### 2. Projekt Másolása Laragon-ba

```bash
# Clone a repository-t a Laragon www mappába
cd G:\laragon\www\
git clone https://github.com/Orelexa/gemini-music-app.git
cd gemini-music-app
```

### 3. Gemini API Kulcs Beállítása

Nyisd meg az `api.php` fájlt és add meg az API kulcsot:
```php
$GEMINI_API_KEY = 'IDE_MÁSOLD_BE_A_KULCSOT';
```

Vagy használj környezeti változót:
```bash
# Windows CMD
set GEMINI_API_KEY_NEW=your_api_key_here

# PowerShell
$env:GEMINI_API_KEY_NEW="your_api_key_here"
```

### 4. PocketBase URL Beállítása

A `config.js` fájlban ellenőrizd a PocketBase URL-t:
```javascript
const POCKETBASE_URL = 'http://192.168.1.122:8090';
```

Ha más IP címet használsz, módosítsd ezt az értéket.

### 5. Indítás

Nyisd meg a böngészőben:
```
http://192.168.1.122/gemini-music-app/
```

## 📝 API Endpoints

Az `api.php` a következő módokat támogatja:

| Mód | Leírás | Model |
|-----|--------|-------|
| `lyrics-gen` | Dalszöveg generálás | gemini-2.0-flash-exp |
| `image-gen` | Borítókép generálás | gemini-2.5-flash-image |
| `music-style` | Zenei stílus ajánlás | gemini-2.0-flash-exp |
| `melody-ideas` | Dallam ötletek | gemini-2.0-flash-exp |
| `chord-progression` | Akkord progresszió | gemini-2.0-flash-exp |
| `translate-english` | Angol fordítás | gemini-2.0-flash-exp |
| `translate` | Általános fordítás | gemini-2.0-flash-exp |
| `suno-prompt` | Suno AI prompt generálás | gemini-2.0-flash-exp |
| `chat` | Chat funkció | gemini-2.0-flash-exp |

## 🗄️ PocketBase Adatstruktúra

### `lyrics` Collection
- **title** (text, required, max 200)
- **lyrics** (text, required, max 10000)
- **created** (datetime, auto)
- **updated** (datetime, auto)
- **id** (string, auto)

### API Rules
Jelenleg minden művelet publikusan elérhető. Ha autentikációt szeretnél:
```
@request.auth.id != ""
```

## 🔧 Környezeti Változók

- `GEMINI_API_KEY_NEW` - Gemini API kulcs (kötelező)

## ⚠️ Fontos Megjegyzések

### Képgenerálás
A Gemini 2.5 Flash Image modell használatával történik. Jelenleg **béta verzió**.

### PocketBase Biztonság
Az alapértelmezett beállítás **publikus hozzáférést** engedélyez. Éles használatra:
1. Állíts be autentikációt
2. Módosítsd az API Rules-t
3. Használj HTTPS-t

### Hálózati Hozzáférés
- A PocketBase a `192.168.1.122:8090` címen fut
- Az alkalmazás a `192.168.1.122/gemini-music-app/` címen érhető el
- Csak a helyi hálózaton elérhető (LAN)

## 🔄 Migrációs Útmutató (Régi Verzióról)

### LocalStorage → PocketBase
1. **Export** a régi alkalmazásból (JSON)
2. **Import** az új alkalmazásban
3. Minden adat átkerül a PocketBase-be

### Netlify Function → api.php
- Az összes fetch hívás automatikusan átirányítva
- Ugyanazok a mode-ok működnek
- PHP backend a Gemini API hívásokhoz

## 📁 Fájlstruktúra

```
gemini-music-app/
├── index.html          # Fő alkalmazás (PocketBase integrációval)
├── api.php             # PHP backend (Gemini API)
├── config.js           # PocketBase konfiguráció
├── POCKETBASE_SETUP.md # PocketBase telepítési útmutató
├── README.md           # Ez a fájl
├── CHANGELOG.md        # Változások listája
├── GYORS_UTMUTATO.md   # Gyors használati útmutató
└── netlify/            # Régi Netlify fájlok (legacy)
```

## 💡 További Fejlesztési Ötletek

1. **Felhasználói autentikáció**: PocketBase auth integráció
2. **Megosztás**: Dalszövegek megosztása linkkel
3. **Verziókövetés**: Dalszöveg változatok tárolása
4. **Kategóriák**: Műfajok, témák szerinti rendezés
5. **Együttműködés**: Közös szerkesztés (realtime)
6. **Backup**: Automatikus mentés külső helyre

## 🐛 Hibaelhárítás

### PocketBase nem elérhető
```bash
# Ellenőrizd, hogy fut-e
curl http://192.168.1.122:8090/api/health

# Indítsd el újra
./pocketbase serve --http="192.168.1.122:8090"
```

### API kulcs hiba
```
Error: API kulcs hiba - ellenőrizd a környezeti változókat
```
→ Ellenőrizd az `api.php` fájlban az API kulcsot

### CORS hiba
→ Az `api.php`-ban már be van állítva a CORS engedélyezése

## 📞 Támogatás

Ha kérdésed van vagy hibát találsz:
1. Ellenőrizd a `POCKETBASE_SETUP.md` fájlt
2. Nézd meg a böngésző konzolját (F12)
3. Nyiss egy issue-t a GitHub repositoryban

## 📄 Licenc

ISC License

---

**Készítette**: AI asszisztencia Claude-dal
**Utolsó frissítés**: 2025. november
**Verzió**: 2.1 (PocketBase Migration)
