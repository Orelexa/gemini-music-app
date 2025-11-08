# Claude Code MCP Configuration

## Playwright MCP Server

Ez a projekt a Playwright MCP-t használja, amely lehetővé teszi a Claude Code számára, hogy automatizált böngésző teszteket futtasson.

### Beállítások

A `mcp.json` fájl tartalmazza a Playwright MCP szerver konfigurációját:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"],
      "env": {}
    }
  }
}
```

### Használat

A Playwright MCP szerver a következő funkciókat biztosítja:

- **Böngésző automatizálás**: Weboldal megnyitása, navigálás, kattintás, űrlap kitöltés
- **Screenshot készítés**: Képernyőképek készítése teszteléshez
- **Elem keresés**: DOM elemek keresése és interakció velük
- **Tesztelés**: Automatizált tesztek futtatása a webalkalmazáson

### Követelmények

- Node.js telepítve
- Playwright telepítve (dev dependency a projektben)

### Aktiválás

A Claude Code Web automatikusan felismeri és betölti az MCP szervert, amikor megnyitod a projektet.

### Továbbiak

További információk a Playwright MCP-ről:
- [Playwright Documentation](https://playwright.dev/)
- [MCP Protocol](https://modelcontextprotocol.io/)
