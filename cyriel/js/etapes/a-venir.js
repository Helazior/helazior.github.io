// Écran provisoire pour une étape pas encore codée.
// À retirer de la liste ETAPES (js/jeu.js) quand l'étape existera.

export default function bientot(message = 'La suite arrive bientôt') {
  return {
    fond: 'clair',
    ambiance: null,

    demarrer({ scene, aller, suivante, derniere }) {
      const bloc = document.createElement('div');
      bloc.className = 'a-venir';
      const texte = document.createElement('p');
      texte.textContent = message;
      bloc.append(texte);

      const bouton = (libelle, action) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = libelle;
        b.addEventListener('click', action);
        bloc.append(b);
      };
      if (!derniere) bouton('Passer à la suite', suivante);
      bouton('Rejouer depuis le début', () => aller(1));

      scene.append(bloc);
      return () => {};
    },
  };
}
