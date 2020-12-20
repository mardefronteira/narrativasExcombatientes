class ScenePlayer {
  constructor(id, entity) {
    this.id = id.slice(0,4);
    this.jsId = this.id.replace('-','');
    this.type = entity;
    this.frame = '';
    this.scene = data[ `scenes` ].find( target => target[ 'id' ] === this.id );
    this.playerId = `scene-player`;
    this.audioId = `${this.id}-audio`;
    this.playerSVG = eval(`${this.jsId}.player`); // player SVG in ./svg/scenes.js
    this.timecodes;
    this.characters;
    this.clickable;
    this.hasBegun = false;
  }

  display() {
    // get details of the element that was clicked
    let target = data[ `${this.type}s` ].find( target => target[ 'id' ] === this.id );
    // console.log(this.scene);
    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    gElement.classList.add('player');
    document.querySelector('#players').appendChild(gElement);

    if (this.id !== "E-01") {
      // create audio elements
      let audioElement = document.createElement('AUDIO');
      audioElement.id = this.audioId;
      audioElement.preload = 'auto';
      audioElement.currentTime = 0;
      if ( target[ 'audio' ] !== undefined && target[ 'audio' ] !== '' ) {
        audioElement.src = `./audios/${target['audio']}`;
      }

      // add elements to DOM
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

      // if player was translated, add clickable to translated g, otherwise add to main player g
      if (document.querySelector('#translate-g')) {
        document.querySelector('#translate-g').appendChild(clickableArea);
      } else {
        document.getElementById(`${this.playerId}`).appendChild(clickableArea);
      }

      this.timecodes = data['audios'].filter( relation => relation['scene'] === this.id);

      // populate this.characters array with their info
      this.characters = this.getCharacters();

      // set scene name, clear characters, set initial time
      let name = document.getElementById('scene-name')
      name.innerHTML = data['scenes'].filter(scene => scene['id'] === this.id)[0].scene;
      document.getElementById('scene-character').innerHTML = '';
      document.getElementById('scene-group').innerHTML = '';
      document.getElementById('scene-alias').innerHTML = '';

      document.getElementById(`${this.id}-time`).innerHTML = `– 00:00 / ${this.scene.duration}`

      // set background color
      document.getElementById('player-background').setAttribute("fill", this.playerColor);

      // hide pause button
      document.getElementById('scene-pause-button').classList.add('hidden');

      audioElement.addEventListener('timeupdate', (e) => this.updatePlayer(e.target));
      // audioElement.addEventListener('ended', () => {this.showFrame(this.id)});

      this.frame = data['frames'].find(frame => frame.scenes.includes(this.id));
      if (this.frame.id === 'M-06'){
        document.querySelector(`#${this.id}-guide-button`).addEventListener('click', () => {openGuide("guide-02")});
      }
    }
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
    this.hasBegun = this.hasBegun === false ? true : false;
  }

  removeElements() {
    let targetPlayer = document.querySelector(`#scene-player`);
    targetPlayer.remove();
    if (this.id !== "E-01"){
      let targetAudio = document.querySelector(`#${this.audioId}`);
      targetAudio.currentTime = 0;
      targetAudio.remove();
    }
  }

  setTime(e) {
    e = e || window.event;
    const target = e.target || e.srcElement,
    clickBox = target.getBoundingClientRect(),
    offsetX = e.clientX - clickBox.left;
    // console.log(offsetX);

    // update audio time based on where the marker was dragged
    let targetType = e.target.id.split('-')[0];
    let audioElement = document.getElementById(this.audioId);
    audioElement.currentTime = mapValue(offsetX, 0, clickBox.width, 0, audioElement.duration);
  }

  // showFrame(id){
  //   let thisFrame = data['frames'].find(frame => frame.scenes.includes(id));
  //
  //   showFrame(thisFrame.id);
  //   d3.select(`#${thisFrame.id}`)
  //     .classed( 'selected-menu-icon', true );
  //   d3.select(`#${thisFrame.id}-tooltip`)
  //     .classed( 'visible-tooltip', true );
  //
  //   document.querySelector(`#scene-player`).classList.add('hidden');
  // }

  updatePlayer(target) {
    if (this.hasBegun) {
      let audioElement = target;
      let clickable = this.clickable;
      let currentTime = audioElement.currentTime;

      // console.log(currentTime);

      // get marker and timebar, and scale them to the current audio time
      let marker =  document.getElementById(`${this.id}-marker`);
      let timebar =  document.getElementById(`${this.id}-timebar`);
      let markerPos = mapValue(currentTime, 0, audioElement.duration, clickable.x, clickable.x + clickable.w);
      if (isNaN(markerPos)) {
        markerPos = clickable.x;
      }
      if (marker){
        marker.setAttribute("x1", parseInt(markerPos));
        marker.setAttribute("x2", parseInt(markerPos));
        timebar.setAttribute("x2", parseInt(markerPos));
      }
      // update time
      let timeString = document.getElementById(`${this.id}-time`);

      timeString.innerHTML = `– ${getFormattedTime(currentTime)} / ${this.scene.duration}`
        // update text
        let character = document.getElementById(`scene-character`);
        let group = document.getElementById(`scene-group`);
        let groupOverflow = document.getElementById(`scene-group-overflow`);
        let alias = document.getElementById(`scene-alias`);

        // get character that corresponds to timecode
        let currentCharacter = this.timecodes.find(slice => (slice.start_sec < currentTime) && (slice.end_sec > currentTime));
        if (currentCharacter) {
          currentCharacter = this.characters.find(char => char.id === currentCharacter.character);
        } else {
          currentCharacter = {
            character: '',
            groupName: '',
            alias: '',
          }
        }

        // // get its info
        // currentCharacter = this.characters.filter(char => char.id === currentCharacter)[0];

        character.innerHTML = currentCharacter.character;
        alias.innerHTML = currentCharacter.alias ? `${currentCharacter.alias}` : '';

        switch (currentCharacter.group) {
          case "G-03":
            group.innerHTML = "EJÉRCITO DE LIBERACIÓN NACIONAL";
            groupOverflow.innerHTML = "- REPLANTEAMIENTO";
            break;
          case "G-08":
            group.innerHTML = "FUERZAS ARMADAS REVOLUCIONARIAS DE ";
            groupOverflow.innerHTML = "COLOMBIA - EJÉRCITO DEL PUEBLO";
            break;
          case "G-10":
            group.innerHTML = "COMISIÓN PARA EL ESCLARECIMIENTO DE LA VERDAD,";
            groupOverflow.innerHTML = "LA CONVICENCIA Y LA NO REPETICIÓN";
            break;
          default:
            group.innerHTML = currentCharacter.groupName;
            groupOverflow.innerHTML = '';
        }
      } // ends if hasBegun
  } // ends updatePlayer()
}
