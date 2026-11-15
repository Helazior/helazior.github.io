# Musiques d'ambiance

Une musique par étape, jouée en boucle, avec un fondu enchaîné au changement
d'étape. Il suffit de déposer ici un fichier portant le bon nom :

| Étape | Fichier attendu |
| --- | --- |
| 1 — les deux boutons | `etape-1.mp3` |
| 2 — la grotte | `etape-2.mp3` (déjà là) |
| 4 — la zone humide | `etape-4.mp3` (déjà là) |

Tant qu'un fichier manque, l'étape se joue simplement sans musique de fond
(les bruitages, eux, sont fabriqués par le navigateur et marchent déjà).

Conseils :

- format MP3, c'est celui qui passe partout ;
- une boucle de 1 à 3 minutes suffit, à 128 kbit/s environ pour rester léger
  sur téléphone ;
- choisir une fin qui se raccorde bien au début, la boucle est sans pause ;
- noter ici la source et la licence de chaque enregistrement.

Le volume général de l'ambiance se règle dans `js/son.js`
(`busAmbiance.gain.value`).

## Sources

- `etape-4.mp3` : « Forêt de nuit après la pluie » (AMBForst, ID 0555), La Sonothèque
  (lasonotheque.fr). Original coupé 6 s avant la fin (29,4 s → 23,4 s), puis
  fin et début fondus l'un dans l'autre sur 1,5 s pour que la boucle ne
  s'entende pas (durée finale : 21,9 s). Licence à vérifier avant toute mise en
  ligne publique.
- `etape-2.mp3` : « Grotte 2 » (AMBUndr, ID 2136), La Sonothèque. Original de
  71,4 s recoupé à 43 s, fin et début fondus sur 1,5 s, ré-encodé en
  128 kbit/s (durée finale : 41,5 s, 650 Ko au lieu de 2,8 Mo).
