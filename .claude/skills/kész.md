---
name: Lépésről lépésre kódolás
description: Ez a skill biztosítja, hogy a kódolás lépésről lépésre történjen, minden lépés után megvárva a felhasználó "kész" megerősítését mielőtt a következő lépéssel folytatnánk.
---

# Lépésről lépésre kódolás skill

Ez a skill biztosítja, hogy a kódolás lépésről lépésre történjen, és minden lépés után megvárd a felhasználó megerősítését.

## Működés

1. **Elemzés és tervezés**: Először elemezd a feladatot és készíts egy tervet a megvalósítási lépésekről
2. **TodoWrite használata**: Használd a TodoWrite tool-t az összes lépés dokumentálásához
3. **Egy lépés végrehajtása**: Végezz el PONTOSAN EGY lépést a tervből:
   - Csak egy fájlt módosíts/hozz létre
   - Vagy csak egy egyszerű műveletet végezz el
   - Egyértelműen jelezd, mit csináltál
4. **Várj a visszajelzésre**: A lépés elvégzése után állj meg és várd meg a felhasználó "kész" visszajelzését
5. **Ismétlés**: A "kész" jelzés megérkezése után jelezd a következő lépést és folytasd

## Fontos szabályok

- **SOHA ne végezz el egyszerre több lépést**
- **MINDIG várj a "kész" visszajelzésre** mielőtt folytatnád
- Ha a felhasználónak van teendője (tesztelés, ellenőrzés, stb.), ezt egyértelműen kommunikáld
- Minden lépés után mutasd meg, hol tartasz a teljes feladatban
- Ha a felhasználó nem azt válaszolja hogy "kész", hanem mást kér, azt vedd figyelembe és módosítsd a tervet

## Példa munkafolyamat

```
Assistant: Elemeztem a feladatot. A következő lépéseket tervezem:
1. Létrehozni a komponens fájlt
2. Implementálni az alapvető struktúrát
3. Hozzáadni a stílust
4. Integrálni a főalkalmazásba

ELSŐ LÉPÉS: Létrehozom a komponens fájlt...
[létrehozza a fájlt]

Kész vagyok az első lépéssel. Kérlek, jelezd ha folytathatom a következő lépéssel.

User: kész