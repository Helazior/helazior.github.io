# Musiques d'ambiance

Une musique par étape, jouée en boucle, avec un fondu enchaîné au changement
d'étape. Il suffit de déposer ici un fichier portant le bon nom :

| Étape | Fichier attendu |
| --- | --- |
| 1 — les deux boutons | pas de musique |
| 2 — la grotte | `etape-2.mp3` (déjà là) |
| 3 — la peinture | `etape-2.mp3`, la même que la grotte |
| 4 — la zone humide | `etape-4.mp3`, et en plus le piano `etape-4-piano.mp3` |
| 5 — la course | `etape-4.mp3` |
| 6 — le café (la salle) | `cafe-salle.mp3` |
| 6 — le café (le marché) | `cafe-marche.mp3` |

Tant qu'un fichier manque, l'étape se joue simplement sans musique de fond
(les bruitages, eux, sont fabriqués par le navigateur et marchent déjà).

Conseils :

- format MP3, c'est celui qui passe partout ;
- une boucle de 1 à 3 minutes suffit, à 128 kbit/s environ pour rester léger
  sur téléphone ;
- choisir une fin qui se raccorde bien au début, la boucle est sans pause ;
- noter ici la source et la licence de chaque enregistrement.

Le volume général de l'ambiance se règle dans `js/son.js`
(`busAmbiance.gain.value`). Une étape peut superposer plusieurs sons : son
`ambiance` est alors une liste (voir la fin de `js/etapes/etape4.js`, avec le
volume du piano). Pour le café, le volume de chaque son de fond (la salle, le
marché) se règle en tête de `js/etapes/cafe.js` (`SONS`).

## Sources

- `etape-4.mp3` : « Forêt de nuit après la pluie » (AMBForst, ID 0555) et
  « Forêt » (AMBForst, ID 0100), La Sonothèque (lasonotheque.fr). La pluie
  (boucle de 21,9 s : original coupé 6 s avant la fin, fin et début fondus sur
  1,5 s) est jouée deux fois ; les oiseaux sont fondus fin dans début sur 2,5 s
  pour boucler sur la même durée. Mélange : oiseaux à 90 %, pluie à 70 % (les
  oiseaux environ 7 dB au-dessus). Durée finale : 43,8 s, 128 kbit/s.
- `etape-2.mp3` : « Grotte 2 » (AMBUndr, ID 2136), La Sonothèque. Original de
  71,4 s recoupé à 43 s, fin et début fondus sur 1,5 s, ré-encodé en
  128 kbit/s (durée finale : 41,5 s, 650 Ko au lieu de 2,8 Mo).
- `cafe-marche.mp3` : « Forêt » (AMBForst, ID 0100) à 75 % et « Fontaine de
  temple japonais » (WATRFoun, ID 0913) à 25 %, La Sonothèque. Les fondus du
  début et de la fin des originaux retirés, les deux mélangés, puis fin et
  début fondus l'un dans l'autre sur 2,5 s pour que la boucle ne s'entende pas
  (durée finale : 49,2 s, 128 kbit/s). Joué en boucle pendant le marché.
- `cafe-salle.mp3` : la musique du jeu d'origine, d'après l'enregistrement
  « GoodCyriel Café » fourni par Clément (titre « Goodgame Cafe gameplay »,
  panpohroma). On garde le début : le morceau se répète toutes les 34,9 s, et
  à 1 min 44,75 s il revient exactement à son début ; la boucle s'arrête donc
  là (les deux premières minutes, sans raccord audible ; 60 ms de fondu au
  raccord). Sans l'image de pochette, ré-encodé en 112 kbit/s (1,5 Mo). Jouée
  dans la salle du café (volume 0,12 dans `SONS`) ; au marché elle continue,
  plus doucement (`auMarche` : 0,05), sous les oiseaux et la fontaine. Elle se
  tait pendant la chanson d'anniversaire.
- `etape-4-piano.mp3` : « Dreaming of Sun » (piano), par leberch, Pixabay
  (licence Pixabay). Silence du début coupé, ré-encodé en 128 kbit/s. C'était
  la musique du café ; elle accompagne maintenant la zone humide (étape 4),
  par-dessus la forêt sous la pluie (volume 0,18).
