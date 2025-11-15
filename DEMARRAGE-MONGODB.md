# 🚀 Démarrage Rapide - MongoDB (Sans Limitation)

## ✅ Ce qui a été fait

✨ **MongoDB driver installé** (mongodb package)
✨ **API routes MongoDB créées** (`/api/devis-mongodb`)
✨ **Client MongoDB configuré** (`lib/mongodb.ts`)
✨ **Composants préparés** pour basculer facilement

---

## 🎯 Configuration en 5 étapes

### Étape 1 : Créer un compte MongoDB Atlas (2 min)

1. **Allez sur** : https://www.mongodb.com/cloud/atlas/register
2. **Inscrivez-vous** gratuitement (email + mot de passe)
3. **Confirmez** votre email

### Étape 2 : Créer un cluster gratuit (3 min)

1. Cliquez sur **"Build a Database"**
2. Choisissez **"M0 FREE"** (512 MB - 2x plus qu'Upstash !)
3. Sélectionnez :
   - **Provider** : AWS
   - **Region** : Europe (Paris) ou (Frankfurt)
4. **Cluster Name** : `viviworks-devis`
5. Cliquez sur **"Create"**

### Étape 3 : Configurer l'accès (2 min)

#### 3.1 Créer un utilisateur :
- **Username** : `viviworks`
- **Password** : Générez un mot de passe fort (COPIEZ-LE !)
- Cliquez sur **"Create User"**

#### 3.2 Autoriser l'accès :
- **IP Address** : `0.0.0.0/0` (accès depuis n'importe où)
- **Description** : `Allow all`
- Cliquez sur **"Add Entry"**
- Cliquez sur **"Finish and Close"**

### Étape 4 : Obtenir la connection string (1 min)

1. Cliquez sur **"Connect"** sur votre cluster
2. Choisissez **"Drivers"**
3. **Copiez** la Connection String :
   ```
   mongodb+srv://viviworks:<password>@viviworks-devis.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **IMPORTANT** : Remplacez `<password>` par votre mot de passe

### Étape 5 : Créer `.env.local` (1 min)

À la **racine du projet** (même niveau que `package.json`), créez le fichier `.env.local` :

```env
# MongoDB Atlas - Base de données sans limitation
MONGODB_URI=mongodb+srv://viviworks:VOTRE_MOT_DE_PASSE@viviworks-devis.xxxxx.mongodb.net/viviworks?retryWrites=true&w=majority
```

⚠️ **IMPORTANT** : 
- Remplacez `VOTRE_MOT_DE_PASSE` par votre vrai mot de passe
- Remplacez `xxxxx` par votre vrai cluster ID
- Ajoutez `/viviworks` avant le `?` (nom de la base de données)

---

## 🔄 Étape 6 : Basculer vers MongoDB

### Dans `components/devis-content.tsx` (ligne ~1577)

Changez :
```typescript
const API_ENDPOINT = '/api/devis' // Upstash
```

En :
```typescript
const API_ENDPOINT = '/api/devis-mongodb' // MongoDB
```

### Dans `components/liste-devis-content.tsx` (ligne ~80 et ~115)

Changez les 2 occurrences :
```typescript
const API_ENDPOINT = '/api/devis' // Upstash
```

En :
```typescript
const API_ENDPOINT = '/api/devis-mongodb' // MongoDB
```

---

## 🔄 Étape 7 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C dans le terminal)
# Puis redémarrez :
npm run dev
```

---

## ✅ Tester le système

### Test 1 : Vérifier la connexion

Ouvrez votre navigateur sur : http://localhost:3000

Si vous voyez un message d'erreur avec "MONGODB_URI", c'est que le fichier `.env.local` n'est pas bien configuré.

### Test 2 : Créer un devis

1. Allez dans **"Devis"**
2. Remplissez les informations
3. Cliquez sur **💾 Sauvegarder**
4. Vous devriez voir : **"✅ Devis sauvegardé dans la base de données cloud"**

### Test 3 : Voir la liste

1. Allez dans **"Liste des devis"**
2. Votre devis devrait apparaître ! 🎉

### Test 4 : Vérifier dans MongoDB

1. Allez sur https://cloud.mongodb.com
2. Cliquez sur **"Browse Collections"** sur votre cluster
3. Vous devriez voir :
   - Database : `viviworks`
   - Collection : `devis`
   - Vos documents (devis) dedans ! 🎨

---

## 🎨 Avantages de MongoDB

### ✅ Stockage
- **512 MB gratuit** (vs 256 MB Upstash)
- Soit ~**100 000 devis** sans payer

### ✅ Interface puissante
- **Data Explorer** : Voir et modifier vos données visuellement
- **Charts** : Créer des graphiques
- **Search** : Recherche full-text puissante

### ✅ Sécurité
- **Backups automatiques** tous les jours
- **Encryption** des données
- **Monitoring** en temps réel

### ✅ Évolutivité
Quand vous avez besoin de plus :
- **M2** (2 GB) → 9€/mois
- **M5** (5 GB) → 25€/mois
- **M10+** (Illimité) → Sur mesure

---

## 🔧 Dépannage

### Erreur : "MONGODB_URI is not defined"

**Solutions :**
1. Vérifiez que `.env.local` existe à la racine
2. Vérifiez l'orthographe : `MONGODB_URI` (pas mongodb_uri)
3. Redémarrez le serveur (Ctrl+C puis npm run dev)

### Erreur : "MongoServerError: bad auth"

**Solutions :**
1. Vérifiez votre mot de passe dans `.env.local`
2. Assurez-vous d'avoir remplacé `<password>` par le vrai mot de passe
3. Pas d'espace avant ou après le mot de passe

### Erreur : "Could not connect to any servers"

**Solutions :**
1. Vérifiez que vous avez autorisé l'IP `0.0.0.0/0`
2. Vérifiez votre connexion Internet
3. Attendez 2-3 minutes (le cluster peut être en cours de démarrage)

### Les devis n'apparaissent pas

**Solutions :**
1. Ouvrez la console (F12) et regardez les erreurs
2. Vérifiez que vous avez bien changé l'API_ENDPOINT dans les 3 endroits
3. Vérifiez que le serveur est redémarré
4. Testez l'API : http://localhost:3000/api/devis-mongodb

---

## 📊 Voir vos données dans MongoDB

1. **Allez sur** : https://cloud.mongodb.com
2. **Cliquez** sur "Browse Collections"
3. **Explorez** :
   - Database : `viviworks`
   - Collection : `devis`
   - Cliquez sur un document pour voir tous les détails

Vous pouvez :
- ✅ **Modifier** les données directement
- ✅ **Supprimer** des documents
- ✅ **Exporter** en JSON/CSV
- ✅ **Créer des index** pour accélérer les recherches
- ✅ **Voir les statistiques** de votre base

---

## 🎯 Prochaines étapes

Une fois que tout fonctionne :

1. ✅ **Testez** avec plusieurs devis
2. ✅ **Explorez** l'interface MongoDB Atlas
3. ✅ **Configurez** les alertes (monitoring)
4. ✅ **Planifiez** des backups automatiques
5. ✅ **Créez** des index pour optimiser les performances

---

## 📁 Structure des fichiers MongoDB

```
presentation/
├── lib/
│   └── mongodb.ts                      ✨ Client MongoDB
├── app/api/
│   ├── devis/                          📦 Upstash (ancien)
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── devis-mongodb/                  ✨ MongoDB (nouveau)
│       ├── route.ts
│       └── [id]/route.ts
├── components/
│   ├── devis-content.tsx              🔄 À modifier
│   └── liste-devis-content.tsx        🔄 À modifier
└── .env.local                         🔐 Vos credentials
```

---

## 💡 Astuce Pro

Vous pouvez garder les DEUX systèmes en parallèle :
- **Upstash** pour les tests rapides
- **MongoDB** pour la production

Il suffit de changer l'API_ENDPOINT pour basculer de l'un à l'autre ! 🎯

---

## 📞 Support

- **Email** : info@viviworks.fr
- **Téléphone** : +33 7 84 78 99 10
- **Documentation MongoDB** : https://docs.mongodb.com/

---

## ✅ Checklist

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster M0 (gratuit) créé en Europe
- [ ] Utilisateur créé avec mot de passe
- [ ] IP 0.0.0.0/0 autorisée
- [ ] Connection string copiée
- [ ] `.env.local` créé avec MONGODB_URI
- [ ] API_ENDPOINT modifié dans devis-content.tsx
- [ ] API_ENDPOINT modifié dans liste-devis-content.tsx (2 endroits)
- [ ] Serveur redémarré
- [ ] Test de sauvegarde réussi
- [ ] Devis visible dans la liste
- [ ] Devis visible dans MongoDB Atlas

---

**🎉 Félicitations ! Vous avez maintenant une base de données MongoDB sans limitation de Mo !**

Tous vos devis sont maintenant stockés dans le cloud avec :
- ✅ **512 MB gratuit** (2x plus qu'Upstash)
- ✅ **Interface graphique puissante**
- ✅ **Backups automatiques**
- ✅ **Évolutif vers l'illimité**

🚀 **Profitez de votre système de devis professionnel !**

