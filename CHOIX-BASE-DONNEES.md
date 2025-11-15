# 🔄 Choisir votre base de données

Votre projet Viviworks supporte maintenant **2 systèmes de base de données** :

---

## 📊 Comparaison

| Critère | Upstash Redis | MongoDB Atlas |
|---------|---------------|---------------|
| **Configuration** | ⚡ 5 minutes | ⏱️ 10 minutes |
| **Stockage gratuit** | 256 MB | 512 MB (2x plus) |
| **Vitesse** | ⚡⚡⚡ Très rapide | ⚡⚡ Rapide |
| **Interface graphique** | Basique | 🎨 Excellente |
| **Recherches avancées** | Limitées | 🔍 Puissantes |
| **Backup automatique** | ❌ Non | ✅ Oui |
| **Évolutivité** | Moyenne | ⭐ Excellente |
| **Adapté pour** | Petits projets | Projets évolutifs |

---

## 🎯 Quelle solution choisir ?

### ✅ **Choisissez Upstash Redis si :**
- Vous voulez la **configuration la plus rapide** (5 min)
- Vous avez moins de 50 000 devis à gérer
- Vous voulez la **performance maximale**
- Votre projet est simple

### ✅ **Choisissez MongoDB Atlas si :**
- Vous voulez **2x plus de stockage gratuit**
- Vous prévoyez beaucoup de devis (100 000+)
- Vous voulez une **interface graphique puissante**
- Vous voulez des **backups automatiques**
- Vous voulez pouvoir **évoluer facilement** vers l'illimité

---

## 🚀 Configuration

### Option 1 : Upstash Redis (actuel)

**Fichiers utilisés :**
- `lib/redis.ts`
- `app/api/devis/route.ts`
- `app/api/devis/[id]/route.ts`

**Configuration :** Voir `DEMARRAGE-RAPIDE-UPSTASH.md`

**API endpoint :** `/api/devis`

---

### Option 2 : MongoDB Atlas (nouveau - recommandé)

**Fichiers utilisés :**
- `lib/mongodb.ts` ✨ NOUVEAU
- `app/api/devis-mongodb/route.ts` ✨ NOUVEAU
- `app/api/devis-mongodb/[id]/route.ts` ✨ NOUVEAU

**Configuration :** Voir `GUIDE-MONGODB-ILLIMITE.md`

**API endpoint :** `/api/devis-mongodb`

---

## 🔧 Comment basculer vers MongoDB ?

### Étape 1 : Installer MongoDB driver

```bash
npm install mongodb
```

### Étape 2 : Configurer `.env.local`

```env
# MongoDB Atlas (NOUVEAU)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/viviworks

# Upstash Redis (garder ou supprimer)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxxxxxxxxxxxxx
```

### Étape 3 : Modifier le code des composants

Dans `components/devis-content.tsx`, changez :

```typescript
// AVANT (Upstash)
const response = await fetch('/api/devis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(devisInfo),
})

// APRÈS (MongoDB)
const response = await fetch('/api/devis-mongodb', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(devisInfo),
})
```

Dans `components/liste-devis-content.tsx`, changez :

```typescript
// AVANT (Upstash)
const response = await fetch('/api/devis')

// APRÈS (MongoDB)
const response = await fetch('/api/devis-mongodb')
```

### Étape 4 : Redémarrer le serveur

```bash
npm run dev
```

---

## 📝 Les deux API coexistent !

Vous pouvez garder les deux systèmes en parallèle :
- `/api/devis` → Upstash Redis
- `/api/devis-mongodb` → MongoDB Atlas

Cela vous permet de tester les deux avant de choisir ! 😊

---

## 🎨 Migration de données

Si vous avez déjà des devis dans Upstash et voulez les migrer vers MongoDB :

1. Exportez depuis Upstash (via l'interface "Liste des devis")
2. Importez dans MongoDB (via le bouton "Sauvegarder" après avoir basculé)

Ou créez un script de migration (contactez-nous si besoin).

---

## 💰 Coûts

### Upstash Redis
- **Gratuit** : 256 MB, 10K requêtes/jour
- **Payant** : À partir de 0,20$/GB/mois

### MongoDB Atlas
- **M0 (Gratuit)** : 512 MB
- **M2** : 2 GB → 9€/mois
- **M5** : 5 GB → 25€/mois
- **M10+** : Illimité → Sur mesure

---

## 🎯 Recommandation

Pour Viviworks, nous recommandons **MongoDB Atlas** car :

✅ **2x plus de stockage gratuit**
✅ **Interface graphique pour explorer vos données**
✅ **Backups automatiques** (sécurité)
✅ **Évolutif** : Vous pourrez passer à l'illimité facilement
✅ **Puissant** : Recherches et filtres avancés

---

## 📞 Besoin d'aide ?

- 📖 **Upstash** : Voir `DEMARRAGE-RAPIDE-UPSTASH.md`
- 📖 **MongoDB** : Voir `GUIDE-MONGODB-ILLIMITE.md`
- ✉️ **Support** : info@viviworks.fr

---

**Fait votre choix et profitez de votre système de devis ! 🚀**

