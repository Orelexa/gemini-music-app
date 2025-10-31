# PDF Dokumentum Készítő Skill

Ez a skill PDF dokumentumok készítésére szolgál, meghatározott formázással és DejaVu Sans betűcsaláddal.

## Formázási Szabályok

Amikor PDF dokumentumot készítesz, **MINDIG** kövesd ezeket a szabályokat:

### 1. Betűcsalád
- **Betűtípus**: DejaVu Sans (minden szöveghez)
- Normál súly: DejaVu Sans Regular
- Félkövér: DejaVu Sans Bold
- Dőlt: DejaVu Sans Oblique
- Félkövér dőlt: DejaVu Sans Bold Oblique

### 2. Alapértelmezett Formázás
- **Címsor (H1)**: 24pt, félkövér, 20px margó alul
- **Alcím (H2)**: 18pt, félkövér, 15px margó alul
- **Harmadlagos cím (H3)**: 14pt, félkövér, 10px margó alul
- **Normál szöveg**: 12pt, normál súly
- **Bekezdés köz**: 10px
- **Sor magasság**: 1.5x (18pt 12pt-os szövegeknél)

### 3. Oldal beállítások
- **Formátum**: A4 (210mm × 297mm)
- **Margók**:
  - Felül: 25mm
  - Alul: 25mm
  - Bal: 25mm
  - Jobb: 25mm
- **Orientáció**: Álló (portrait), ha nincs másként megadva

### 4. Színek
- **Fekete szöveg**: #000000 vagy RGB(0, 0, 0)
- **Címsorok**: #1a1a1a vagy RGB(26, 26, 26)
- **Link színek**: #0066cc vagy RGB(0, 102, 204)

### 5. Egyéb Elemek
- **Táblázatok**:
  - Fejléc: félkövér, 12pt
  - Cellák: 10pt, 5px padding
  - Keret: 1px, #cccccc
- **Listák**:
  - Behúzás: 20px
  - Listajelek: körök vagy számok
  - Sor köz: 8px

## Használandó Könyvtárak

### Node.js környezetben:
- **Elsődleges**: `pdfkit` - natív PDF generálás DejaVu Sans támogatással
- **Alternatív**: `jsPDF` - böngésző és Node.js támogatás

### Böngésző környezetben:
- **jsPDF** - DejaVu Sans betűtípus beágyazással

## Implementációs Lépések

1. **Betűtípus beszerzése**:
   - Töltsd le a DejaVu Sans betűcsaládot (TTF formátumban)
   - Helyezd el a projekt megfelelő könyvtárába (pl. `fonts/` vagy `assets/fonts/`)

2. **Könyvtár telepítése**:
   ```bash
   npm install pdfkit
   # vagy
   npm install jspdf
   ```

3. **Betűtípus beágyazása**:
   - PDFKit esetén: `.font('path/to/DejaVuSans.ttf')`
   - jsPDF esetén: Base64 kódolt betűtípus használata

4. **PDF generálás**:
   - Alkalmazd a fenti formázási szabályokat
   - Ügyelj a margókra és sortörésekre
   - Unicode támogatás engedélyezése (magyar karakterekhez: á, é, í, ó, ö, ő, ú, ü, ű)

## Példa Kód Váz (PDFKit)

```javascript
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Új PDF dokumentum
const doc = new PDFDocument({
  size: 'A4',
  margins: {
    top: 25 * 2.83465,    // 25mm = ~71px
    bottom: 25 * 2.83465,
    left: 25 * 2.83465,
    right: 25 * 2.83465
  }
});

// Kimenet
doc.pipe(fs.createWriteStream('output.pdf'));

// DejaVu Sans betűtípus
doc.font('path/to/DejaVuSans.ttf');

// Címsor (H1)
doc.fontSize(24)
   .font('path/to/DejaVuSans-Bold.ttf')
   .text('Főcím', { lineGap: 20 });

// Normál szöveg
doc.fontSize(12)
   .font('path/to/DejaVuSans.ttf')
   .text('Ez egy normál bekezdés DejaVu Sans betűtípussal.', {
     lineGap: 10,
     align: 'left'
   });

// PDF lezárása
doc.end();
```

## Példa Kód Váz (jsPDF)

```javascript
import { jsPDF } from 'jspdf';

// DejaVu Sans betűtípus beágyazása (Base64)
// const dejaVuSansFont = 'AAEAAAATAQAABAAwRFNJRw...'; // Base64 string

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

// Betűtípus hozzáadása
// doc.addFileToVFS('DejaVuSans.ttf', dejaVuSansFont);
// doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
doc.setFont('DejaVuSans');

// Címsor
doc.setFontSize(24);
doc.setFont('DejaVuSans', 'bold');
doc.text('Főcím', 25, 35);

// Normál szöveg
doc.setFontSize(12);
doc.setFont('DejaVuSans', 'normal');
doc.text('Ez egy normál bekezdés DejaVu Sans betűtípussal.', 25, 55);

// PDF mentése
doc.save('output.pdf');
```

## Fontos Megjegyzések

- **Mindig** ellenőrizd, hogy a DejaVu Sans betűtípus elérhető-e a rendszeren
- **Unicode támogatás**: DejaVu Sans kiválóan támogatja a magyar karaktereket
- **Fájl méret**: A beágyazott betűtípusok növelik a PDF méretét
- **Teljesítmény**: Nagy dokumentumok esetén ügyelj a memória kezelésre
- **Tesztelés**: Mindig teszteld a generált PDF-et különböző PDF megjelenítőkben

## Skill Aktiválás

Amikor ezt a skillt használod, automatikusan alkalmazd a fenti formázási szabályokat minden PDF dokumentum készítésekor, hacsak a felhasználó kifejezetten másként nem kéri.
