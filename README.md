# Chatbot Entretien RLH - Fratries

Simulation interactive d'entretien RLH avec Claude IA pour la formation Fratries.

---

## 🎯 Cas pédagogique

**Salarié** : Emma Rousseau, 26 ans  
**Entreprise** : École Notre-Dame des Anges (20 salariés, OGEC)  
**Situation** : Agent cantine scolaire, 14h/semaine, RQTH, handicap cognitif (attention)  
**Objectif** : Compléter un dossier RLH auprès de l'Agefiph

---

## 🚀 Déploiement en 5 minutes sur Vercel

### Étape 1 : Préparer le code (sur votre machine)

```bash
# Cloner ou créer le dossier du projet
git clone https://github.com/VotreRepo/fratries-rlh-chatbot.git
cd fratries-rlh-chatbot

# Installer les dépendances
npm install
```

### Étape 2 : Obtenir une clé API Anthropic

1. Aller sur https://console.anthropic.com/account/keys
2. Créer une clé API (gratuit, générez la première clé)
3. Copier la clé quelque part en sécurité

### Étape 3 : Déployer sur Vercel

**Option A : Interface Vercel (plus simple)**

1. Aller sur https://vercel.com/new
2. Connecter avec GitHub (ou créer un compte)
3. Importer le repo (ou coller le lien Git)
4. Ajouter la variable d'environnement :
   - **Clé** : `ANTHROPIC_API_KEY`
   - **Valeur** : Votre clé API Anthropic
5. Cliquer **Deploy**
6. ✅ En ~2min, votre URL publique est prête

**Option B : CLI Vercel (terminal)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer (vous serrez guidé)
vercel

# Ajouter la variable d'env
vercel env add ANTHROPIC_API_KEY

# Redéployer pour appliquer
vercel --prod
```

### Étape 4 : Partager avec les participants

- **URL** : `https://votre-app.vercel.app` (fournie par Vercel)
- Envoyer ce lien à chaque participant
- Pas besoin de login, chacun a sa session isolée
- Fonctionne sur téléphone + desktop

---

## 💻 Développement local

```bash
# Lancer le serveur de dev
npm run dev

# Ouvrir http://localhost:3000
# Les modifications se rechargent automatiquement
```

**Attention** : Pour tester localement, créer un fichier `.env.local` :

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxx
```

---

## 📁 Structure du projet

```
.
├── pages/
│   ├── index.js           # Page principale (UI chatbot)
│   └── api/
│       └── chat.js        # Endpoint Claude API
├── lib/
│   └── systemPrompt.js    # Prompt système pour Sophie
├── package.json           # Dépendances
├── next.config.js         # Config Next.js
├── vercel.json            # Config Vercel
├── .env.example           # Variables d'env (exemple)
└── .gitignore
```

---

## 🎮 Comment fonctionne le chatbot

### Pour les participants

1. Ouvrir le lien → chatbot se charge
2. Lire la question de Sophie (directrice école)
3. **Taper librement** une réponse dans le champ texte
4. Cliquer "Envoyer"
5. Claude génère la réponse naturelle de Sophie
6. Continue jusqu'à fin de l'entretien (~5-10 min)

### Chaque session

- ✅ Complètement isolée (pas de sync entre utilisateurs)
- ✅ Historique sauvegardé dans le navigateur
- ✅ Peut télécharger la transcription
- ✅ Peut recommencer quand veut

---

## 🔧 Coûts & Limites

### Coût Claude API

- **12 utilisateurs** = ~$0.15-0.25 (quasi nul)
- **100 utilisateurs** = ~$2-3
- **1000 utilisateurs** = ~$20-30

Vercel gratuit jusqu'à 1,000 requêtes/mois (vous en avez ~60 pour 12 users).

### Limitations

- Pas de dashboard de suivi (qui a fini, où en est chacun)
- Pas de stockage des réponses (à titre pédagogique, c'est OK)
- Rate limit API Claude : ~3500 requêtes/min (suffit amplement)

---

## 📊 Données collectées

Le chatbot collecte automatiquement dans le dialogue :

- Effectif école
- RQTH et nature du handicap
- Horaires et salaire
- Aménagements mis en place
- Surcoûts (tutrice, perte productivité)
- Valeur apportée par le salarié

Ces infos peuvent être sauvegardées manuellement (copier-coller ou télécharger la transcription).

---

## 🔒 Sécurité

- ✅ Clé API **jamais exposée** en frontend
- ✅ Clé stockée dans variables Vercel (chiffrées)
- ✅ Sessions isolées (pas de DB partagée)
- ✅ Pas de tracking/analytics (données confidentielles)

---

## 🆘 Dépannage

### "API key invalid"
→ Vérifier que `ANTHROPIC_API_KEY` est définie dans Vercel (`Settings` → `Environment Variables`)

### "Rate limited"
→ Trop de requêtes simultanées. Attendre quelques secondes et réessayer.

### "Something went wrong"
→ Vérifier la console (F12) pour plus de détails. Contacter support Claude si persistant.

### L'app est lente
→ Normal les 2-3 premières requêtes. Claude met ~1s pour répondre.

---

## 📝 Personnalisation

Pour adapter à un autre cas :

1. Ouvrir `lib/systemPrompt.js`
2. Modifier les sections `DONNÉES RÉELLES`
3. Changer le nom/école/poste selon le cas
4. **Garder la structure** et les consignes de tone
5. Redéployer

---

## 📞 Support

**Questions ?**
- Docs Claude : https://docs.anthropic.com
- Docs Vercel : https://vercel.com/docs
- Docs Next.js : https://nextjs.org/docs

---

**Version** : 1.0.0  
**Créé pour** : Fratries  
**Cas** : Emma Rousseau (anonymisé)
