# 🎵 PocketBase Beállítások - Gemini Music App

## 📦 PocketBase Collection Létrehozása

### 1. Admin UI Megnyitása
Nyisd meg a PocketBase Admin felületet:
```
http://192.168.1.122:8090/_/
```

### 2. Collection Létrehozása

1. Kattints a **Collections** menüpontra
2. Kattints a **New collection** gombra
3. Válaszd a **Base collection** típust
4. Add meg a collection nevét: `lyrics`

### 3. Mezők Hozzáadása

Adj hozzá a következő mezőket:

#### 📝 `title` mező
- **Type:** Text
- **Name:** `title`
- **Required:** ✅ Yes
- **Max length:** 200

#### 📄 `lyrics` mező
- **Type:** Text
- **Name:** `lyrics`
- **Required:** ✅ Yes
- **Max length:** 10000

### 4. API Rules Beállítása

A következő szabályokat állítsd be (Public hozzáférés):

#### 🔓 List/Search Rule
```
Hagyd üresen (publikus hozzáférés)
```

#### 🔓 View Rule
```
Hagyd üresen (publikus hozzáférés)
```

#### 🔓 Create Rule
```
Hagyd üresen (publikus hozzáférés)
```

#### 🔓 Update Rule
```
Hagyd üresen (publikus hozzáférés)
```

#### 🔓 Delete Rule
```
Hagyd üresen (publikus hozzáférés)
```

> **Megjegyzés:** Ha később autentikációt szeretnél, használd ezt a szabályt:
> ```
> @request.auth.id != ""
> ```

### 5. Mentés

Kattints a **Create** gombra.

## ✅ Ellenőrzés

### API tesztelés böngészőből

Nyisd meg a böngészőben:
```
http://192.168.1.122:8090/api/collections/lyrics/records
```

Ha üres listát látsz (`{"items":[],...}`), akkor minden rendben van!

## 🔧 Példa Adatok Beszúrása (Opcionális)

Ha szeretnél tesztadatokat, menj a **Records** fülre és kattints a **New record** gombra:

**1. Példa:**
- title: `Első Dalom`
- lyrics: `Ez az első sorunk\nEz a második sorunk\nRímek mindenütt\nDallam mindenhol`

**2. Példa:**
- title: `Szerelmes Dal`
- lyrics: `Ragyog a nap felettem\nSzívemben dal fakad\nVeled minden pillanat\nÖrök boldogság`

## 🎯 Következő Lépés

Most már fut a PocketBase collection! Az alkalmazás automatikusan használni fogja.

## 📚 További Információ

PocketBase Dokumentáció: https://pocketbase.io/docs/
