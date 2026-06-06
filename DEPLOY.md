# 🚀 Guide Déploiement Vercel (Pas à Pas)

**Durée totale** : 5 minutes  
**Niveau** : Débutant (pas besoin de terminal si vous utilises l'interface web)

---

## AVANT DE COMMENCER

Vous devez avoir :
- [ ] Un compte GitHub (gratuit : https://github.com/signup)
- [ ] Le code du chatbot (push sur GitHub)
- [ ] Une clé API Anthropic (obtenir ici : https://console.anthropic.com/account/keys)

---

## ✅ ÉTAPE 1 : Obtenir une clé API Anthropic

### 1.1 Créer un compte Anthropic (si pas encore fait)
- Aller sur https://console.anthropic.com
- Cliquer "Sign Up"
- Entrer email + créer mdp
- Vérifier email (lien reçu)

### 1.2 Créer la clé API
- Une fois connecté, aller sur : https://console.anthropic.com/account/keys
- Cliquer "+ Create Key"
- Donner un nom : `chatbot-fratries` (par exemple)
- Cliquer "Create"
- **COPIER LA CLÉ** (elle s'affiche une seule fois !)
- Sauvegarder quelque part en sécurité (notepad/keepass/etc)

**⚠️ Important** : Cette clé ressemble à `sk-ant-xxxxxxxx...`. À garder secrète !

---

## ✅ ÉTAPE 2 : Mettre le code sur GitHub

### 2.1 Créer un repo GitHub
- Aller sur https://github.com/new
- **Repository name** : `fratries-rlh-chatbot`
- **Description** : "Chatbot entretien RLH interactif"
- **Public** ✅ (pour Vercel)
- **Initialize with README** : ✅
- Cliquer "Create repository"

### 2.2 Uploader le code (interface web GitHub)
- Cliquer sur "Add file" → "Upload files"
- Sélectionner TOUS les fichiers du projet :
  ```
  package.json
  next.config.js
  vercel.json
  tailwind.config.js
  postcss.config.js
  .env.example
  .gitignore
  lib/systemPrompt.js
  pages/index.js
  pages/api/chat.js
  styles/globals.css
  ```
- Cliquer "Commit changes"

✅ Le code est maintenant sur GitHub

---

## ✅ ÉTAPE 3 : Déployer sur Vercel

### 3.1 Créer un compte Vercel
- Aller sur https://vercel.com/signup
- **Cliquer "Continue with GitHub"**
- Autoriser Vercel à accéder à vos repos
- ✅ Compte créé

### 3.2 Importer le projet
- Une fois connecté sur Vercel, aller sur https://vercel.com/new
- Vous devez voir votre repo `fratries-rlh-chatbot`
- **Cliquer dessus** (ou le rechercher si absent)
- Cliquer **"Import"**

### 3.3 Configurer les variables d'environnement
- Vous êtes sur la page "Configure Project"
- **Scroller jusqu'à "Environment Variables"**
- Ajouter une variable :
  - **NAME** : `ANTHROPIC_API_KEY`
  - **VALUE** : Coller votre clé API (celle copiée à l'étape 1.2)
  - Cliquer **"Add"**

### 3.4 Déployer
- Cliquer **"Deploy"**
- Vercel compile et déploie (~2 minutes)
- ✅ Quand c'est fini, vous voyez "Congratulations!"

### 3.5 Obtenir votre URL
- Cliquer sur la carte du projet
- En haut, vous voyez votre URL : `https://fratries-rlh-chatbot.vercel.app` (ou similaire)
- **C'est l'URL à partager aux participants !**

---

## 🧪 TESTER L'APP

1. Ouvrir l'URL dans votre navigateur
2. Vous devez voir le chat avec Sophie
3. Taper une réponse et cliquer "Envoyer"
4. Sophie devrait répondre (peut prendre 1-2 secondes)

### Si ça marche pas
- **"API key invalid"** : Verifier que la clé API est bien dans les variables d'env (Settings → Environment Variables)
- **Blanc/erreur** : Attendre 30 secondes et rafraîchir (la première build peut être lente)

---

## 🔄 METTRE À JOUR LE CODE

Si vous modifiez le code sur GitHub :

1. Pushez les changements sur GitHub
2. Vercel recompile **automatiquement**
3. L'app se met à jour en live

Exemple : pour changer le cas (un autre salarié au lieu d'Emma), modifiez `lib/systemPrompt.js` sur GitHub et le changement s'applique auto.

---

## 📊 MONITORING & LOGS

Pour voir les erreurs en live :

1. Sur Vercel, cliquer sur votre projet
2. Aller dans **"Deployments"**
3. Cliquer sur le déploiement actif
4. Cliquer **"Logs"** pour voir les erreurs API

---

## 🎓 CONFIGURATION POUR LA FORMATION

### Avant la formation
1. ✅ Avoir l'URL publique prête
2. ✅ Tester vous-même une simulation complète
3. ✅ Envoyer le lien aux participants 24h avant

### Pendant la formation
- Les participants ouvrent le lien
- Chacun sa session (pas de sync)
- Vous pouvez faire une démo en partageant l'écran si vous voulez

### Après la formation
- Les participants peuvent re-tester le chatbot quand ils veulent (l'URL reste active)
- Les données ne sont pas conservées (confidentialité)

---

## 💰 COÛTS

- **Vercel** : Gratuit pour votre usage (vous êtes well dans les limites)
- **Claude API** : ~$0.15 pour 12 utilisateurs (quasi nul)

**Aucun déboursement.**

---

## 🆘 SUPPORT

Si vous êtes bloqué :

### Pour Vercel
- https://vercel.com/docs
- Support email : support@vercel.com

### Pour Claude
- https://docs.anthropic.com
- https://console.anthropic.com/account/keys

### Pour les erreurs du code
- Voir les logs Vercel (étape "Monitoring")
- Chercher le message d'erreur dans le README du projet

---

## ✨ C'est parti !

Vous êtes maintenant prêt. Une fois déployé, partagez l'URL de production avec vos participants et ils peuvent commencer immédiatement.

**Besoin d'aide ?** Les instructions du README du projet sont là pour ça. 🚀
