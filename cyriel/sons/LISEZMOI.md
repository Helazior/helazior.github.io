# Musiques d'ambiance

Une musique par étape, jouée en boucle, avec un fondu enchaîné au changement
d'étape. Il suffit de déposer ici un fichier portant le bon nom :

| Étape | Fichier attendu |
| --- | --- |
| 1 — les deux boutons | `etape-1.mp3` |
| 2 — la grotte | `etape-2.mp3` (déjà là) |
| 3 — la peinture | `etape-3.mp3` |
| 4 — la zone humide | `etape-4.mp3` (déjà là) |
| 5 — le café (la salle) | `cafe-salle.mp3` (déjà là) |
| 5 — le café (le marché) | `cafe-marche.mp3` (déjà là) |

Tant qu'un fichier manque, l'étape se joue simplement sans musique de fond
(les bruitages, eux, sont fabriqués par le navigateur et marchent déjà).

Conseils :

- format MP3, c'est celui qui passe partout ;
- une boucle de 1 à 3 minutes suffit, à 128 kbit/s environ pour rester léger
  sur téléphone ;
- choisir une fin qui se raccorde bien au début, la boucle est sans pause ;
- noter ici la source et la licence de chaque enregistrement.

Le volume général de l'ambiance se règle dans `js/son.js`
(`busAmbiance.gain.value`). Pour le café, le volume de chaque son de fond
(la salle, le marché) se règle en tête de `js/etapes/cafe.js` (`SONS`).

## Sources

- `etape-4.mp3` : « Forêt de nuit après la pluie » (AMBForst, ID 0555), La Sonothèque
  (lasonotheque.fr). Original coupé 6 s avant la fin (29,4 s → 23,4 s), puis
  fin et début fondus l'un dans l'autre sur 1,5 s pour que la boucle ne
  s'entende pas (durée finale : 21,9 s). Licence à vérifier avant toute mise en
  ligne publique.
- `etape-2.mp3` : « Grotte 2 » (AMBUndr, ID 2136), La Sonothèque. Original de
  71,4 s recoupé à 43 s, fin et début fondus sur 1,5 s, ré-encodé en
  128 kbit/s (durée finale : 41,5 s, 650 Ko au lieu de 2,8 Mo).
- `cafe-marche.mp3` : « Forêt » (AMBForst, ID 0100) à 75 % et « Fontaine de
  temple japonais » (WATRFoun, ID 0913) à 25 %, La Sonothèque. Les fondus du
  début et de la fin des originaux retirés, les deux mélangés, puis fin et
  début fondus l'un dans l'autre sur 2,5 s pour que la boucle ne s'entende pas
  (durée finale : 49,2 s, 128 kbit/s). Joué en boucle pendant le marché.
- `cafe-salle.mp3` : « Dreaming of Sun » (piano), par leberch, Pixabay (licence
  Pixabay). Silence du début coupé, ré-encodé en 128 kbit/s (2,2 Mo au lieu de
  4,5 Mo). Joué doucement dans la salle du café (volume 0,14 dans `SONS`), il se
  tait pendant la chanson d'anniversaire et reprend où il en était au retour
  du marché.
