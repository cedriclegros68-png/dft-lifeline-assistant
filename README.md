# DFT LifeLine - Assistant ACE

Calculateur de jeu pour Arma Reforger et ACE Medical : constantes, seuils de référence, voies aériennes et pneumothorax. Aucun serveur de données, aucune dépendance externe. Les saisies restent dans le navigateur. Les résultats sont des estimations selon les sources ACE consultées, pas un diagnostic réel.

## Publication GitHub Pages

1. Créer le dépôt public `dft-lifeline-assistant` sur le compte `cedriclegros68-png`.
2. Déposer le contenu de ce dossier à la racine de la branche `main`, dont `index.html`, `CNAME` et `.nojekyll`.
3. Dans Settings > Pages, choisir Deploy from a branch, branche `main`, dossier `/ (root)`, puis Save.
4. Vérifier que Custom domain contient `lifeline.mazlor.com`.
5. Chez OVH, ajouter uniquement cet enregistrement dans la zone DNS de `mazlor.com` :

| Type | Sous-domaine | Cible |
|---|---|---|
| CNAME | lifeline | cedriclegros68-png.github.io. |

Ne pas utiliser le nom du dépôt dans la cible DNS. Ne pas modifier les entrées du domaine principal ou des emails. Si une entrée existe déjà pour `lifeline`, vérifier son usage avant de la remplacer.

6. Après validation DNS et émission du certificat, activer Enforce HTTPS dans GitHub Pages.

Adresse finale prévue : https://lifeline.mazlor.com (disponible après publication et configuration DNS).

Documentation officielle : https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Hors ligne

Ouvrir le site avec Internet, attendre « Prêt hors ligne », puis l'ajouter à l'écran d'accueil ou l'installer depuis le navigateur. Tester ensuite en mode avion. Les données du navigateur doivent être conservées.

Pour une mise à jour, modifier les fichiers et changer la version du cache dans `sw.js`.
