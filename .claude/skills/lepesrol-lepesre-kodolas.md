# Lépésről-Lépésre Kódolás Skill

## Leírás
Ez a skill biztosítja, hogy a kódolás lépésről lépésre történjen, minden lépés után megvárva a felhasználó "kész" megerősítését, mielőtt a következő lépéssel folytatnánk.

## Működés

Amikor ezt a skillt aktiválod, a következő folyamatot követem:

### 1. Feladat Elemzése és Tervezés
- Elemzem a kért feladatot
- Felépítem a lépések listáját TodoWrite tool használatával
- Részletesen bemutatom a teljes tervet
- **VÁROK a felhasználó megerősítésére** ("kész", "ok", "folytasd", stb.)

### 2. Lépések Végrehajtása Egyesével

Minden egyes lépésnél:

#### A) Lépés Bejelentése
- Egyértelműen jelzem, hogy melyik lépésen dolgozom
- Elmagyarázom, mit fogok csinálni
- TodoWrite: lépés "in_progress"-re állítása

#### B) Lépés Végrehajtása
- Egy és csakis egy lépést hajtok végre
- Használom a szükséges tool-okat (Read, Write, Edit, Bash, stb.)
- Részletes visszajelzés a végrehajtásról

#### C) Ellenőrzés és Visszajelzés
- Ellenőrzöm a lépés sikerességét
- Bemutatom az eredményt
- TodoWrite: lépés "completed"-re állítása
- **MEGÁLLOK és VÁROK a felhasználó megerősítésére**

#### D) Megerősítés Várakozás
**KRITIKUS: NE FOLYTASSAM AUTOMATIKUSAN!**
- Várom a felhasználó explicit megerősítését:
  - ✅ "kész"
  - ✅ "ok"
  - ✅ "folytasd"
  - ✅ "next"
  - ✅ "tovább"
  - ❌ NE menjek tovább automatikusan!

#### E) Csak Megerősítés Után
- Csak akkor lépek a következő lépésre, ha a felhasználó jelezte
- Ha módosítást kér, azt végzem el először
- Ha elégedett, folytatom a következő lépéssel

### 3. Befejezés
- Minden lépés befejezése után összegzést készítek
- Ellenőrzöm, hogy minden lépés completed státuszban van-e
- Megkérdezem, hogy van-e még valami

## Példa Munkafolyamat

```
Felhasználó: "Készíts egy új komponenst X funkcióval"

Claude:
"Rendben! Lépésről-lépésre fogom elkészíteni. A terv:
1. Komponens fájl létrehozása
2. Alapstruktúra megírása
3. Props interface definiálása
4. Logika implementálása
5. Styling hozzáadása
6. Teszt írása
7. Export beállítása

Kezdhetem az első lépéssel?"

Felhasználó: "kész"

Claude:
"1. lépés: Komponens fájl létrehozása
Létrehozom a /path/to/Component.tsx fájlt..."
[végrehajtás]
"✅ Fájl létrehozva. Készen állok a következő lépésre?"

Felhasználó: "folytasd"

Claude:
"2. lépés: Alapstruktúra megírása..."
[stb.]
```

## Szabályok

1. **SOHA ne ugorj át lépéseket**
2. **SOHA ne hajtsd végre egyszerre több lépést**
3. **MINDIG várj megerősítésre** lépések között
4. **MINDIG használd a TodoWrite tool-t** a haladás követéséhez
5. **MINDIG adj részletes visszajelzést** minden lépésről
6. **Ha hiba történik**, jelezd azonnal és NE menj tovább
7. **Ha a felhasználó változtatást kér**, először azt végezd el

## Mikor Használd

- Komplex funkciók implementálásakor
- Több fájlt érintő változtatásoknál
- Amikor a felhasználó kéri
- Nagy refactoringoknál
- Új projektek indításakor
- Kritikus bugfixeknél

## Mikor NE Használd

- Egyszerű, egylépéses feladatoknál (pl. "olvasd el ezt a fájlt")
- Amikor a felhasználó gyors választ vár
- Információkérő kérdéseknél
- Triviális módosításoknál

---

**Emlékeztető magamnak:** Ez a skill a TÜRELEM és KONTROLL. Minden lépés után ÁLLJ MEG és VÁRJ!
