# 🎯 SYNTHÈSE PROJET — Chatbot RLH Fratries

**Statut** : ✅ Prêt à déployer  
**Coût** : ~$0 pour 12 utilisateurs  
**Durée setup** : ~5 minutes  

---

## 📦 LIVRABLE COMPLET

Tous les fichiers sont prêts. Voici la structure complète :

```
fratries-rlh-chatbot/
├── 📄 README.md                 # Documentation principale
├── 📄 DEPLOY.md                 # Guide déploiement Vercel (pas à pas)
├── 📄 GUIDE_PARTICIPANT.md      # À envoyer aux participants
├── 📄 .env.example              # Variables d'env (template)
├── 📄 .gitignore                # Fichiers à ignorer
├── 📄 package.json              # Dépendances NPM
├── 📄 next.config.js            # Config Next.js
├── 📄 vercel.json               # Config Vercel
├── 📄 tailwind.config.js        # Config Tailwind CSS
├── 📄 postcss.config.js         # Config PostCSS
│
├── 📁 pages/
│   ├── 📄 _document.js          # Structure HTML de base
│   ├── 📄 index.js              # UI chatbot (React) ⭐
│   └── 📁 api/
│       └── 📄 chat.js           # Endpoint Claude API ⭐
│
├── 📁 lib/
│   └── 📄 systemPrompt.js       # Prompt Sophie (directrice) ⭐
│
└── 📁 styles/
    └── 📄 globals.css           # Styles Tailwind
```

**⭐ = fichiers critiques** (ne pas toucher sauf si vraiment nécessaire)

---

## 🎮 FONCTIONNALITÉS

✅ **Champ texte libre** — Participants tapent librement (pas juste QCM)  
✅ **IA générative Claude** — Réponses naturelles et dynamiques  
✅ **Sessions isolées** — Chacun sa session, zéro sync  
✅ **Responsive** — Téléphone + tablette + desktop  
✅ **Aucune authentification** — Pas de login requis  
✅ **Confidentiel** — Pas de stockage de données  
✅ **Téléchargement transcription** — Chacun peut sauvegarder  

---

## 🚀 CHECKLIST DÉPLOIEMENT (5 min)

### ☐ Avant
- [ ] Créer compte GitHub (https://github.com/signup)
- [ ] Créer compte Anthropic (https://console.anthropic.com)
- [ ] Obtenir clé API Anthropic (https://console.anthropic.com/account/keys)

### ☐ Pendant déploiement
- [ ] Créer repo GitHub `fratries-rlh-chatbot`
- [ ] Uploader tous les fichiers du projet
- [ ] Créer compte Vercel (via GitHub)
- [ ] Importer le repo dans Vercel
- [ ] Ajouter variable d'env `ANTHROPIC_API_KEY` = votre clé
- [ ] Cliquer "Deploy"
- [ ] Attendre 2-3 minutes → URL publique générée ✅

### ☐ Après
- [ ] Tester la URL dans votre navigateur
- [ ] Faire une simulation complète (5-10 min)
- [ ] Envoyer le lien aux participants

**Total : 5-10 minutes**

---

## 💬 CE QUE FONT LES FICHIERS

| Fichier | Rôle | Modifier ? |
|---------|------|-----------|
| `pages/index.js` | UI chatbot (messages, input, boutons) | ❌ Non (sauf design) |
| `pages/api/chat.js` | Appel Claude API, gestion requêtes | ❌ Non |
| `lib/systemPrompt.js` | Prompt Sophie (directrice) + données Emma | ⚠️ Oui si autre cas |
| `package.json` | Dépendances NPM | ❌ Non |
| `next.config.js` | Config Next.js | ❌ Non |
| `vercel.json` | Config Vercel | ❌ Non |

**Important** : Si vous voulez adapter pour un autre cas (autre salarié, autre handicap), modifier **seulement** `lib/systemPrompt.js`.

---

## 📊 DONNÉES ACTUELLES (Cas Emma)

**À modifier si autre cas** (dans `lib/systemPrompt.js`) :

```javascript
// École
- Nom : École Notre-Dame des Anges → changer
- Effectif : 20 salariés → changer
- Type : OGEC → changer si besoin

// Salarié
- Nom : Emma Rousseau → changer
- Âge : 26 ans → changer
- Handicap : Cognitif (attention) → changer
- Horaires : 14h/semaine → changer
- Salaire : 12€/h SMIC → changer

// Aménagements
- Temps partiel → changer
- Tutrice 4-6h/semaine → changer
- etc.
```

---

## 🔐 SÉCURITÉ & DONNÉES

✅ **Clé API Anthropic**
- Stockée en variable d'env Vercel (chiffrée)
- N'est JAMAIS exposée au navigateur
- Seul le backend peut l'utiliser

✅ **Données utilisateurs**
- Aucun stockage en base de données
- Historique du chat = seulement dans navigateur (localStorage)
- Participants peuvent télécharger leur transcription (optionnel)
- **Zéro tracking** de qui a fini, où en est chacun

⚠️ **Attention** : Ne JAMAIS committer votre clé API dans Git. Utiliser `ANTHROPIC_API_KEY` dans les variables Vercel uniquement.

---

## 💰 COÛTS

### Vercel
- **Gratuit** pour votre usage
- Limite gratuite : 1,000 requêtes/mois
- Vous en avez : ~60 (12 users × 5 requêtes par simulation)

### Claude API
- **12 utilisateurs** → ~$0.20
- **100 utilisateurs** → ~$2-3
- **1000 utilisateurs** → ~$20-30

**Zéro risque financier pour la formation.**

---

## 🎯 WORKFLOW POUR LES PARTICIPANTS

```
1. Cliquer le lien Vercel
   ↓
2. Page se charge (chatbot visible)
   ↓
3. Sophie accueille
   ↓
4. Utilisateur tape réponse libre
   ↓
5. Claude génère réponse Sophie (~1-2 sec)
   ↓
6. Affiché dans le chat
   ↓
7. Boucle 4-6 jusqu'à fin (5-10 min)
   ↓
8. Optionnel : télécharger transcription
```

**Chaque session = complètement isolée.**

---

## 🔄 APRÈS DÉPLOIEMENT

### Si vous voulez modifier le chatbot
1. Modifier les fichiers localement
2. `git push` vers GitHub
3. Vercel redéploie automatiquement (~2 min)
4. Les participants voient la nouvelle version immédiatement

### Si vous voulez un autre cas
1. Modifier `lib/systemPrompt.js` (données du salarié)
2. Push → Vercel redéploie auto
3. Les participants voient le nouveau cas

### Si vous voulez monitorer
1. Sur Vercel.com → votre projet
2. Cliquer "Deployments" → dernier déploiement
3. Cliquer "Logs" pour voir les erreurs API en temps réel

---

## 📚 DOCUMENTATION FOURNIE

| Doc | Pour qui ? | À quand ? |
|-----|-----------|----------|
| **README.md** | Vous (responsable technique) | Avant déploiement |
| **DEPLOY.md** | Vous (ou votre IT) | Pour déployer sur Vercel |
| **GUIDE_PARTICIPANT.md** | À envoyer aux participants | Veille de la formation |
| Code + comments | Développeurs | Si modifications futures |

---

## ✨ POINTS CLÉS À RETENIR

1. **Champ libre** — Les participants écrivent ce qu'ils veulent, pas du QCM
2. **IA dynamique** — Claude génère les réponses (réaliste, pas script)
3. **Sessions isolées** — Chacun sa session indépendante
4. **Zéro coût** — Vercel + Claude API = quasi gratuit pour 12 users
5. **Déploiement facile** — 5 min sur Vercel, c'est live
6. **Aucune donnée gardée** — Confidentiel, pédagogique
7. **Adaptable** — Changer le cas en 5 minutes (modifier systemPrompt.js)

---

## 🆘 TROUBLESHOOTING RAPIDE

| Problème | Solution |
|----------|----------|
| "API key invalid" | Verifier la clé dans Vercel Settings → Env Variables |
| "Something went wrong" | Rafraîchir la page et réessayer |
| "Message appears blank" | Vérifier la console (F12) pour erreurs |
| "App is slow" | Normal les 1-2 premières fois. Claude met ~1s à répondre |
| "Lien ne fonctionne pas" | Attendre 2-3 min après déploiement (build en cours) |

---

## 📞 BESOIN D'AIDE ?

### Documentation
- Vercel docs : https://vercel.com/docs
- Next.js docs : https://nextjs.org/docs
- Claude docs : https://docs.anthropic.com

### Support
- Vercel support : support@vercel.com
- Anthropic support : https://console.anthropic.com

---

## 🎓 PROCHAINES ÉTAPES

1. **Lire DEPLOY.md** (5 min) → Suivre les étapes
2. **Tester vous-même** (5-10 min) → Vérifier que ça marche
3. **Envoyer GUIDE_PARTICIPANT.md** aux participants (24h avant)
4. **Partager le lien Vercel** → Participants ouvrent et font leur simulation
5. **Discuter résultats** → Feedback sur le dossier RLH

---

## ✅ STATUS

- ✅ Code React complet
- ✅ API Claude intégrée
- ✅ Prompt système (Emma) prêt
- ✅ Documentation complète
- ✅ Instructions déploiement
- ✅ Guide participants
- ✅ Configuration Vercel
- ✅ Zéro coûts

**Vous êtes prêt à déployer ! 🚀**

---

**Version** : 1.0.0  
**Créé pour** : Fratries  
**Cas** : Emma Rousseau (anonymisé)  
**Date** : Juin 2025
