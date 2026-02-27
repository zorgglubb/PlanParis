# Plans Anciens de Paris — PWA

## Structure des fichiers

```
/
├── index.html          ← Application principale
├── manifest.json       ← Config PWA (icône, nom, thème)
├── sw.js               ← Service Worker (cache offline)
├── plans.json          ← Liste des plans (MODIFIABLE sans republier l'app ✓)
├── icons/
│   ├── icon-192.png    ← Icône app 192×192
│   └── icon-512.png    ← Icône app 512×512
├── denominations-emprises-voies-actuelles.geojson
└── lieux.geojson
```

---

## Déploiement

### Option 1 — Serveur web simple (HTTPS requis pour PWA)
- Déposer tous les fichiers sur votre serveur
- Vérifier que `plans.json` est accessible depuis l'URL de l'app
- L'app sera installable depuis Chrome/Safari mobile

### Option 2 — Hébergement GitHub Pages (gratuit)
1. Créer un dépôt GitHub
2. Uploader les fichiers
3. Activer GitHub Pages → l'URL sera `https://votrecompte.github.io/nom-repo/`

### Option 3 — Capacitor (App Store / Google Play)
```bash
npm install -g @ionic/cli
npm init @capacitor/app
npx cap add ios
npx cap add android
# Copier index.html dans www/
npx cap sync
npx cap open ios      # Ouvre Xcode
npx cap open android  # Ouvre Android Studio
```

---

## Ajouter un plan sans republier l'app

Il suffit de modifier `plans.json` sur le serveur. Au prochain lancement, l'app chargera automatiquement le nouveau plan.

Format d'une entrée :
```json
{
  "annee": 1885,
  "titre": "Hachette",
  "auteur": "Hachette",
  "source": "BnF",
  "url": "https://votreserveur.fr/tuiles/1885_Hachette/{z}/{x}/{y}.png",
  "attribution": "BnF – Hachette 1885"
}
```

→ Ajouter l'objet dans le tableau JSON, trier par année croissante, sauvegarder.
L'app affichera le nouveau plan dans la timeline sans aucune mise à jour.

---

## Fonds cartographiques libres (usage commercial OK)

| Fond | Licence | Clé |
|------|---------|-----|
| IGN Orthophoto | © IGN (libre depuis 2021) | `essentiels` |
| IGN Plan v2 | © IGN | `essentiels` |
| IGN Scan 25 | © IGN | `essentiels` |
| OpenStreetMap | ODbL | aucune |
| OpenTopoMap | CC-BY-SA | aucune |

Pour l'IGN en production avec gros volumes, envisager la clé "payante" via https://geoservices.ign.fr

---

## Icônes app

Créer des icônes PNG aux dimensions suivantes :
- `icons/icon-192.png` — 192×192 px
- `icons/icon-512.png` — 512×512 px

Suggestion : une fleur de lys dorée sur fond sépia, ou la silhouette de Paris.

---

## Ergonomie — Gestes supportés

| Geste | Action |
|-------|--------|
| Swipe gauche | Plan suivant |
| Swipe droit | Plan précédent |
| ← → clavier | Navigation plans |
| Tap année | Charger le plan |
| Slider | Transparence 0–100% |
| Clic droit | Coordonnées GPS + L93 |
| Bouton 📍 | Localisation temps réel |
| Bouton 🗺 | Changer fond cartographique |
| Bouton 📅 | Afficher/masquer la timeline |
