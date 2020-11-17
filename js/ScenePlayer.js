class ScenePlayer {
  constructor(id, entity) {
    this.id = id.slice(0,4);
    this.jsId = this.id.replace('-','');
    this.type = entity;
    this.playerId = `scene-player`;
    // this.playerPosition = eval(`${this.jsId}.playerPosition`);
    this.playerColor = eval(`${this.jsId}.playerColor`);
    this.audioId = `scene-audio`;
    this.playerSVG = eval(`${this.jsId}.player`); // player SVG in ./svg/scenes.js
    this.timecodes;
    this.characters;
    this.clickable;
  }

  display() {
    // get details of the element that was clicked
    let target = data[ `${this.type}s` ].find( target => target[ 'id' ] === this.id );

    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    gElement.classList.add('player');

    // set matrix to player position
    // gElement.setAttribute( "transform", `translate(${this.playerPosition-680.3453},0)`);

    // create audio elements
    let audioElement = document.createElement('AUDIO');
    audioElement.id = this.audioId;
    audioElement.preload = 'auto';
    // audioElement.dataSize = 45;
    audioElement.currentTime = 0;
    if ( target[ 'audio' ] !== undefined && target[ 'audio' ] !== '' ) {
      audioElement.src = `./audios/${target['audio']}`;
    }
    audioElement.addEventListener('timeupdate', (e) => this.updatePlayer(e.target));

    // add elements to DOM
    document.querySelector('#players').appendChild(gElement);
    document.body.appendChild(audioElement);

    // get play buttons and set click event
    document.getElementById(`scene-button`)
      .addEventListener('click', (e) => {this.playPause(e)});

    // create timeline clickable area
    this.clickable = this.getClickableArea(this.type); // get coordinates

    let clickableArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    clickableArea.setAttribute("id", `${this.type}-clickable`)
    clickableArea.setAttribute("x", this.clickable.x);
    clickableArea.setAttribute("y", this.clickable.y);
    clickableArea.setAttribute("width", this.clickable.w);
    clickableArea.setAttribute("height", this.clickable.h);
    clickableArea.classList.add('clickable');
    clickableArea.addEventListener('mousemove', e => {mouseIsPressed ? this.setTime(e) : ''});
    clickableArea.addEventListener('click', e => {this.setTime(e)});
    gElement.appendChild(clickableArea);

    this.timecodes = data['audios'].filter( relation => relation['scene'] === this.id);

    // populate this.characters array with their info
    this.characters = this.getCharacters();

    // set scene name, clear characters
    let name = document.getElementById('scene-name')
    name.innerHTML = data['scenes'].filter(scene => scene['id'] === this.id)[0].scene;
    document.getElementById('scene-character').innerHTML = '';
    document.getElementById('scene-group').innerHTML = '';

    // set background color
    document.getElementById('player-background').setAttribute("fill", this.playerColor);

    // hide pause button
    document.getElementById('scene-pause-button').classList.add('hidden');
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

  getClickableArea(entity) {
    let targetElement = document.getElementById(`${entity}-timeline`);
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

  playPause(e) {
    // get audio info
    let targetType = e.target.id.split('-')[0];
    let audioElement = document.getElementById(this.audioId);

    // pause all other players
    Array.from(document.querySelectorAll('audio')).map(audio => audio.id !==  this.audioId ? audio.pause() : ``);

    // play or pause audio
    audioElement.paused ? audioElement.play() : audioElement.pause();

    // show corresponding button
    let buttonToShow = audioElement.paused ? 'play' : 'pause';
    let buttonToHide = audioElement.paused ? 'pause' : 'play';
    document.getElementById(`scene-${buttonToShow}-button`).classList.remove('hidden');
    document.getElementById(`scene-${buttonToHide}-button`).classList.add('hidden');
  }

  removeElements() {
    let targetPlayer = document.querySelector(`#scene-player`);
    let targetAudio = document.querySelector(`#${this.audioId}`);

    targetPlayer.remove();
    targetAudio.remove();
  }

  setTime(e) {
      // update audio time based on where the marker was dragged
      let targetType = e.target.id.split('-')[0];
      let audioElement = document.getElementById(`${targetType}-audio`);
      audioElement.currentTime = mapValue(e.offsetX, 0, this.clickable.w, 0, audioElement.duration);
  }

  updatePlayer(target) {
    let audioElement = target;
    let targetType = target.id.split('-')[0];
    let clickable = this.clickable;
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker =  document.getElementById(`${targetType}-marker`);
    let timebar =  document.getElementById(`${targetType}-timebar`);
    let markerPos = mapValue(currentTime, 0, audioElement.duration, clickable.x, clickable.x + clickable.w);
    if (isNaN(markerPos)) {
      markerPos = clickable.x;
    }
    marker.setAttribute("x1", parseInt(markerPos));
    marker.setAttribute("x2", parseInt(markerPos));
    timebar.setAttribute("x2", parseInt(markerPos));

    // update time
    let timeString = document.getElementById(`${targetType}-time`);
    timeString.innerHTML = `– ${getFormattedTime(currentTime)}`

    if(targetType === 'scene') {
      // update text
      let character = document.getElementById(`${targetType}-character`);
      let group = document.getElementById(`${targetType}-group`);

      // get character that corresponds to timecode
      let currentCharacter = this.timecodes.filter(slice => (slice.start_sec < currentTime) && (slice.end_sec > currentTime))[0].character;

      // get its info
      currentCharacter = this.characters.filter(char => char.id === currentCharacter)[0];

      character.innerHTML = currentCharacter.character;
      group.innerHTML = currentCharacter.groupName;
    }
  }
}