# Installer Estgaming sur Windows ou Android

Estgaming est un refuge de détente personnalisable en 3D. Il propose 300 ambiances avec recherche et pagination, une palette de couleurs sur mesure, six décors 3D, une respiration guidée, des sons d’animaux synthétisés localement et un minuteur de pause. Son atelier permet de créer un compagnon, d’assembler vidéos et images sur une timeline avec découpe, ordre, fondus, filtres, vitesse, titres et pistes musicales, puis d’exporter le montage au format WebM si le navigateur le prend en charge. Le nouvel onglet IA génère des scripts, storyboards et images par l’intermédiaire d’une API compatible OpenAI configurée par l’utilisateur.

Le mode édition permet de modifier les textes, déplacer les éléments et régler 400 paramètres visuels (20 réglages sur 20 zones). Ces réglages, les textes modifiés et les positions sont enregistrés localement. Les fichiers audio et vidéo ne quittent pas l’appareil pendant le montage. Pour l’IA, l’URL du fournisseur, le modèle et la clé API sont saisis par l’utilisateur ; la clé n’est pas enregistrée par le site et n’est envoyée qu’au fournisseur choisi lors d’une génération. Un fournisseur configuré doit autoriser les requêtes navigateur (CORS) et prendre en charge les points d’API compatibles.

## Ouvrir le site

Ouvre `index.html` dans un navigateur, ou lance un serveur web local depuis le dossier du projet. Pour préparer une version web, lance :

```powershell
npm run build:web
```

La version web prête à publier se trouve dans `www`.

## Créer les fichiers installables

Installe d’abord **Node.js LTS**. Pour Android, installe aussi **Android Studio**, le SDK Android et **JDK 21**, puis accepte les licences du SDK.

Dans PowerShell, ouvre le dossier du projet et lance :

```powershell
npm install
npm run build:windows
npm run build:android
```

Les paquets seront créés ici :

- Windows : `dist/windows/Estgaming-Setup-1.3.0.exe` (installateur) et `dist/windows/Estgaming-Portable-1.3.0.exe` (version portable).
- Android : `dist/android/Estgaming-Android.apk`.

L’inclinaison du téléphone pour explorer la scène nécessite l’autorisation du capteur et une connexion sécurisée (HTTPS) dans un navigateur compatible. La scène reste consultable sans activer le mouvement.

## Installer

- **Windows** : lance l’installateur `Estgaming-Setup-1.3.0.exe`, ou ouvre directement la version portable.
- **Android** : transfère `Estgaming-Android.apk` sur le téléphone, ouvre le fichier et confirme l’installation.

Les fichiers `.exe` de cette démo ne sont pas signés avec un certificat d’éditeur ; Windows peut donc afficher un avertissement SmartScreen. Les installateurs ne sont disponibles qu’après la compilation sur une machine équipée des outils requis.
