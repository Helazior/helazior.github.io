// Écran provisoire, affiché après la dernière étape déjà codée.
// À retirer de la liste ETAPES (js/jeu.js) quand le jeu sera complet.

export default {
  fond: 'clair',
  ambiance: null,

  demarrer({ scene, aller }) {
    const bloc = document.createElement('div');
    bloc.className = 'a-venir';

    const texte = document.createElement('p');
    texte.textContent = 'La suite arrive bientôt';

    const rejouer = document.createElement('button');
    rejouer.type = 'button';
    rejouer.textContent = 'Rejouer depuis le début';
    rejouer.addEventListener('click', () => aller(1));

    bloc.append(texte, rejouer);
    scene.append(bloc);
    return () => {};
  },
};
