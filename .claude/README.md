# Claude Code MCP Configuration

Ez a projekt több MCP szervert használ, amelyek különböző funkciókat biztosítanak a Claude Code számára.

## Konfigurált MCP Szerverek

### 1. Playwright MCP Server

A Playwright MCP lehetővé teszi a Claude Code számára, hogy automatizált böngésző teszteket futtasson.

#### Funkciók

- **Böngésző automatizálás**: Weboldal megnyitása, navigálás, kattintás, űrlap kitöltés
- **Screenshot készítés**: Képernyőképek készítése teszteléshez
- **Elem keresés**: DOM elemek keresése és interakció velük
- **Tesztelés**: Automatizált tesztek futtatása a webalkalmazáson

#### Követelmények

- Node.js telepítve
- Playwright telepítve (dev dependency a projektben)

### 2. Supabase MCP Server

A Supabase MCP lehetővé teszi az adatbázis-kezelést és backend műveleteket.

#### Funkciók

- **Adatbázis műveletek**: Táblák lekérdezése, beszúrás, frissítés, törlés
- **Authentication**: Felhasználók kezelése
- **Storage**: Fájlok tárolása és kezelése
- **Real-time**: Valós idejű adatok figyelése

#### Beállítás

1. Hozz létre egy Supabase projektet: https://supabase.com
2. Másold ki a Project URL-t és az anon key-t
3. Hozz létre egy `.env` fájlt a projekt gyökérkönyvtárában:

```bash
cp .env.example .env
```

4. Add meg a Supabase credentialeket a `.env` fájlban:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

**FONTOS**: A `.env` fájl ne kerüljön be a git-be! (már benne van a `.gitignore`-ban)

## MCP Konfiguráció

A teljes MCP konfiguráció a `.claude/mcp.json` fájlban található.

## Aktiválás

A Claude Code Web automatikusan felismeri és betölti az MCP szervereket, amikor megnyitod a projektet.

## További Információk

- [Playwright Documentation](https://playwright.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io/)
