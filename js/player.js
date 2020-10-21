class Player {
  constructor(id, entity){
    this.id = id.slice(0,4);
    this.type = entity;
    this.playerId = `${this.id}-player`;
    this.audioId = `${this.id}-audio`;
    this.gId = eval(`${this.id.replace('-','')}.player`); // player address in ./svg/players.js
    this.characterName = '';
  }

  display() {
    // get details of the element that was clicked
    let target = data[ `${this.type}s` ].find( target => target[ 'id' ] === this.id );

    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.gId;
    gElement.classList.add('player');

    // create audio element
    let audioElement = document.createElement('AUDIO');
    audioElement.id = this.audioId;
    audioElement.preload = 'none';
    audioElement.dataSize = 45 ;

    // console.log(target);
    if ( target[ 'audio' ] !== undefined && target[ 'audio' ] !== '' ) {
      audioElement.src = `./audios/${target['audio']}`;
    }

    // add elements to DOM
    document.querySelector('#players').appendChild(gElement);
    document.body.appendChild(audioElement);

    // get play button and set click event
    let playButton = document.getElementById(`${this.id}-play-button`);
    playButton.addEventListener('click', () => {this.playPause()});
  }

  playPause() {
    let audioElement = document.getElementById(this.audioId);
    console.log(this.audioId)
    audioElement.paused ? audioElement.play() : audioElement.pause();
  }

  update () {
    ''
  }

  remove() {
    let targetPlayer = document.querySelector(`#${this.playerId}`);
    let targetAudio = document.querySelector(`#${this.audioId}`)
    targetPlayer.remove();
    targetAudio.remove();
  }
}
