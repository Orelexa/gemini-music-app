# 🔴 KRITIKUS BIZTONSÁGI FIGYELMEZTETÉS

## ⚠️ AZONNALI TEENDŐK

A GitHub detektálta, hogy API kulcsok kerültek a Git history-ba! **AZONNAL** cselekedned kell:

---

## 1️⃣ API Kulcsok AZONNALI Revoke-olása

### Lépések:

1. Menj a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)-ba
2. Keresd meg és TÖRÖLD az alábbi API kulcsokat:
   - `AIzaSyBm80gknYyUgzztIdjJpu8RRy1zLfgYXWM`
   - `AIzaSyBWU7bSbpUMPm6-Ovc6wsfaksfndvNK2fk`
3. Generálj **ÚJ** API kulcsokat
4. Az új kulcsot add meg a `.env` fájlban:
   ```
   GEMINI_API_KEY_NEW=az_uj_api_kulcsod_ide
   ```

---

## 2️⃣ Git History Tisztítása

Az API kulcsok több commitban is szerepelnek. A history-t ki KELL tisztítani!

### Opcio A: BFG Repo-Cleaner (AJÁNLOTT - egyszerűbb)

```bash
# 1. Töltsd le a BFG-t
# https://rtyley.github.io/bfg-repo-cleaner/

# 2. Készíts egy fájlt a régi API kulcsokkal (secrets.txt):
echo "AIzaSyBm80gknYyUgzztIdjJpu8RRy1zLfgYXWM" > secrets.txt
echo "AIzaSyBWU7bSbpUMPm6-Ovc6wsfaksfndvNK2fk" >> secrets.txt

# 3. Futtasd a BFG-t
java -jar bfg.jar --replace-text secrets.txt T:\gemini-music-app

# 4. Git cleanup
cd T:\gemini-music-app
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Opcio B: git filter-repo (Fejlettebb)

```bash
# 1. Telepítsd a git-filter-repo-t
pip install git-filter-repo

# 2. Készíts egy expressions.txt fájlt:
echo "AIzaSyBm80gknYyUgzztIdjJpu8RRy1zLfgYXWM==>REMOVED_SECRET" > expressions.txt
echo "AIzaSyBWU7bSbpUMPm6-Ovc6wsfaksfndvNK2fk==>REMOVED_SECRET" >> expressions.txt

# 3. Futtasd a filter-repo-t
cd T:\gemini-music-app
git filter-repo --replace-text expressions.txt --force
```

---

## 3️⃣ Force Push a GitHub-ra

⚠️ **VIGYÁZAT**: Ez átírja a Git history-t! Minden kollaborátornak újra kell klónoznia!

```bash
cd T:\gemini-music-app
git push origin --force --all
git push origin --force --tags
```

---

## 4️⃣ Minden Klón Újraklónozása

Ha más gépen is van klónozva ez a repository, TÖRÖLD és klónozd újra:

```bash
# Régi klón törlése
rm -rf gemini-music-app

# Új klónozás
git clone <repository-url>
```

---

## 5️⃣ GitHub Security Alert Bezárása

1. Menj a GitHub repository-dba
2. Kattints a **Security** fülre
3. Nézd meg a **Secret scanning alerts**-et
4. Miután revoke-oltad a kulcsokat és tisztítottad a history-t, zárd be az alertet

---

## ✅ Mit Csináltam Én (Claude)

1. ✅ Eltávolítottam a hardcoded API kulcsokat az összes PHP fájlból
2. ✅ Létrehoztam egy `.env` fájlt a kulcsok biztonságos tárolására
3. ✅ Létrehoztam egy `.gitignore` fájlt, hogy a `.env` NE kerüljön Git-be
4. ✅ Létrehoztam egy `.env.example` fájlt dokumentációnak
5. ✅ Módosítottam a kódot, hogy csak környezeti változóból olvassa az API kulcsot

---

## 📋 Ellenőrző Lista

- [ ] API kulcsok revoke-olva a Google Cloud Console-ban
- [ ] Új API kulcsok generálva
- [ ] Új kulcsok beállítva a `.env` fájlban
- [ ] Git history megtisztítva (BFG vagy git-filter-repo)
- [ ] Force push végrehajtva
- [ ] Minden klón újraklónozva
- [ ] GitHub Security Alert bezárva
- [ ] `.env` fájl SOHA nem kerül commitolásra

---

## 🔒 Jövőbeli Védelem

### Mindig használj Pre-commit Hook-okat:

```bash
# Telepítsd a git-secrets-et vagy használj pre-commit framework-öt
pip install pre-commit

# Vagy használj egyszerű script-et:
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
if git diff --cached | grep -E "AIza|sk-[a-zA-Z0-9]{48}|password|secret"; then
    echo "HIBA: Érzékeny adat detektálva!"
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

---

## ⚠️ FONTOS

- **NE** commitold soha a `.env` fájlt!
- **NE** írd be API kulcsokat a kódba!
- **MINDIG** használj környezeti változókat!
- **RENDSZERESEN** ellenőrizd a GitHub Security Alerts-et!

---

## 📚 Hasznos Linkek

- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

**Készítette:** Claude Code
**Dátum:** 2025-11-18
