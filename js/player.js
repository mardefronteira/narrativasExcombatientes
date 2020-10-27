class Player {
  constructor(id, entity){
    this.id = id.slice(0,4);
    this.type = entity;
    this.playerId = `${this.id}-player`;
    this.audioId = `${this.id}-audio`;
    this.playerSVG; // player SVG in ./svg/players.js
    this.clickable;
    this.timecodes;
    this.characters;
  }

  display() {
    switch (this.type) {
      case 'scene':
        this.playerSVG = eval(`${this.id.replace('-','')}.player`);
        if (this.playerSVG == false) this.playerSVG = E23.player;
        this.displayScene();
        break;
      case 'character':
        // displayCharacter();
        console.log('CHARACTER')
        break;
      case 'group':
        // displayGroup();
        console.log('GROUP')
        break;
      default:
        console.log('DEFAULT')
    }
  }

  displayScene() {
    // get details of the element that was clicked
    let target = data[ `${this.type}s` ].find( target => target[ 'id' ] === this.id );

    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    gElement.classList.add('player');

    // create audio element
    let audioElement = document.createElement('AUDIO');
    audioElement.id = this.audioId;
    audioElement.preload = 'none';
    audioElement.dataSize = 45;
    if ( target[ 'audio' ] !== undefined && target[ 'audio' ] !== '' ) {
      audioElement.src = `./audios/${target['audio']}`;
    }
    audioElement.addEventListener('timeupdate', (e) => this.updatePlayer(e));

    // add elements to DOM
    document.querySelector('#players').appendChild(gElement);
    document.body.appendChild(audioElement);

    // get play button and set click event
    let playButton = document.getElementById(`${this.id}-player-button`);
    playButton.addEventListener('click', () => {this.playPause()});

    // create timeline clickable area
    this.clickable = this.getClickableArea(); // get coordinates

    let clickableArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    clickableArea.setAttribute("id", `${this.playerId}-clickable`);
    clickableArea.setAttribute("x", this.clickable.x);
    clickableArea.setAttribute("y", this.clickable.y);
    clickableArea.setAttribute("width", this.clickable.w);
    clickableArea.setAttribute("height", this.clickable.h);
    clickableArea.classList.add('clickable');
    clickableArea.addEventListener('mousedown', e => {this.setTime(e)});
    gElement.appendChild(clickableArea);

    this.timecodes = data['audios'].filter( relation => relation['scene'] === this.id);

    // populate this.characters array with their info
    this.characters = this.getCharacters();
  }

  getCharacters(){
    let characterIds = [];
    let characterInfos = [];
    this.timecodes.map(timecode => {
      if (!characterIds.includes(timecode.character)) {
        characterIds.push(timecode.character);
      }
    });

    // map characterIds, push its data to characterInfos
    characterIds.map( characterId => {
      characterInfos.push(data['characters'].filter(
        info => info['id'] === characterId
      )[0]);
    })

    // get group and subgroup names
    characterInfos.map( char => {
      char.groupName = getGroupName(char);
    })

    return characterInfos;
  }

  getClickableArea() {
    let targetElement = document.getElementById(`${this.id}-player-timeline`);
    let timeline = {
      x1: targetElement.getAttribute("x1"),
      x2: targetElement.getAttribute("x2"),
      y1: targetElement.getAttribute("y1"),
    }
    let clickable = {
      x: parseInt(timeline.x1),
      y: timeline.y1-15,
      w: timeline.x2 - timeline.x1,
      h: 30,
    }

    return clickable;
  }

  playPause() {
    let audioElement = document.getElementById(this.audioId);
    audioElement.paused ? audioElement.play() : audioElement.pause();
  }

  remove() {
    let targetPlayer = document.querySelector(`#${this.playerId}`);
    let targetAudio = document.querySelector(`#${this.audioId}`)
    targetPlayer.remove();
    targetAudio.remove();
  }

  setTime(e) {
    // update audio time based on where the timebar was clicked
    let audioElement = document.getElementById(this.audioId);
    audioElement.currentTime = mapValue(e.offsetX, 0, this.clickable.w, 0, audioElement.duration);
  }

  updatePlayer(e) {
    let audioElement = e.target;
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker =  document.getElementById(`${this.id}-player-marker`);
    let timebar =  document.getElementById(`${this.id}-player-timebar`);
    let markerPos = mapValue(currentTime, 0, audioElement.duration, this.clickable.x, this.clickable.x + this.clickable.w);
    marker.setAttribute("x", parseInt(markerPos));
    timebar.setAttribute("x2", parseInt(markerPos));

    // update time
    let timeString = document.getElementById(`${this.id}-player-timecode`);
    timeString.innerHTML = `– ${getFormattedTime(currentTime)}`

    // update text
    let character = document.getElementById(`${this.playerId}-character`);
    let group = document.getElementById(`${this.playerId}-group`);

    // get character that corresponds to timecode
    let currentCharacter = this.timecodes.filter(slice => (slice.start_sec < currentTime) && (slice.end_sec > currentTime))[0].character;

    // get its info
    currentCharacter = this.characters.filter(char => char.id === currentCharacter)[0];

    character.innerHTML = currentCharacter.character;
    group.innerHTML = currentCharacter.groupName;
  }
}
