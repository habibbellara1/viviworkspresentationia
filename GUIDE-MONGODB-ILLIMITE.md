# 🚀 Configuration MongoDB Atlas - Sans limitation

## Pourquoi MongoDB ?

✅ **Plan gratuit : 512 MB** (2x plus qu'Upstash)
✅ **Évolutif** : Peut passer en illimité facilement
✅ **Puissant** : Recherches avancées, agrégations
✅ **Interface graphique** : Visualiser facilement vos données
✅ **Backup automatique** : Vos données sont sécurisées

---

## 📋 Configuration en 10 minutes

### Étape 1 : Créer un compte MongoDB Atlas (2 min)

1. Allez sur : https://www.mongodb.com/cloud/atlas/register
2. Inscrivez-vous gratuitement (email + mot de passe)
3. Confirmez votre email

### Étape 2 : Créer un cluster gratuit (3 min)

1. Cliquez sur **"Build a Database"**
2. Choisissez **"M0 FREE"** (512 MB)
3. Sélectionnez :
   - **Provider** : AWS
   - **Region** : Europe (Paris) ou (Frankfurt)
4. **Cluster Name** : `viviworks-devis`
5. Cliquez sur **"Create"**

### Étape 3 : Configurer l'accès (2 min)

1. **Créer un utilisateur :**
   - Username : `viviworks`
   - Password : Générez un mot de passe fort (copiez-le !)
   - Cliquez sur **"Create User"**

2. **Autoriser l'accès depuis partout :**
   - IP Address : `0.0.0.0/0` (accès depuis n'importe où)
   - Description : `Allow all`
   - Cliquez sur **"Add Entry"**

3. Cliquez sur **"Finish and Close"**

### Étape 4 : Obtenir la connection string (1 min)

1. Cliquez sur **"Connect"** sur votre cluster
2. Choisissez **"Drivers"**
3. Copiez la **Connection String** :
   ```
   mongodb+srv://viviworks:<password>@viviworks-devis.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Remplacez `<password>` par votre mot de passe

### Étape 5 : Créer `.env.local` (1 min)

Créez le fichier `.env.local` à la racine :

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://viviworks:VOTRE_MOT_DE_PASSE@viviworks-devis.xxxxx.mongodb.net/viviworks?retryWrites=true&w=majority
```

⚠️ **Important :** Remplacez par votre vraie connection string !

### Étape 6 : Installer la dépendance (1 min)

```bash
npm install mongodb
```

---

## 📁 Fichiers à créer

Je vais créer les fichiers nécessaires pour remplacer Upstash par MongoDB.

---

## 🎨 Avantages vs Upstash

| Fonctionnalité | Upstash Redis | MongoDB Atlas |
|----------------|---------------|---------------|
| Stockage gratuit | 256 MB | 512 MB |
| Évolutif | Moyen | Excellent |
| Recherches avancées | Limité | Puissant |
| Interface graphique | Basique | Excellente |
| Backup automatique | Non | Oui |
| Requêtes complexes | Non | Oui |

---

## 📊 Évolution vers l'illimité

Si vous avez besoin de plus, MongoDB propose :

| Plan | Stockage | Prix/mois |
|------|----------|-----------|
| M0 (Gratuit) | 512 MB | 0 € |
| M2 | 2 GB | 9 € |
| M5 | 5 GB | 25 € |
| M10 | 10 GB | 57 € |
| M20+ | Illimité | Sur devis |

---

## ✅ Prêt ?

Une fois configuré, vos devis seront stockés dans MongoDB au lieu d'Upstash !


