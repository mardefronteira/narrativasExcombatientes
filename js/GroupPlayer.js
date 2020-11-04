class GroupPlayer {
  constructor(id, entity) {
    this.id = id.slice(0,4);
    this.type = entity;
    this.playerId = `group-player`;
    this.playerSVG = groupPlayer; // player SVG in ./svg/players.js
    this.characterAudios = [];
    this.characters = [];
    this.clickables = [];
    this.activeCharacters = [];
    this.playerIndex = 0;
  }

  display() {
    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    gElement.classList.add('player');
    document.querySelector('#players').appendChild(gElement);

    // set group name and description
    let groupInfo;
    if (this.id[0] === 'G') {
      groupInfo = data['groups'].filter(group => group['id'] === this.id)[0];
    } else {
      groupInfo = data['subgroups'].filter(subgroup => subgroup['id'] === this.id)[0];
    }
    document.querySelector('#group-name').innerHTML = groupInfo.group;
    document.querySelector('#group-description').innerHTML = groupInfo.description;

    // get character data
    this.getCharacters();

    // create players and audios for characters
    this.getClickableAreas();

    this.clickables.map((clickable, i) => {
      let clickableArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      clickableArea.setAttribute("id", `character-clickable-${i}`)
      clickableArea.setAttribute("x", clickable.x);
      clickableArea.setAttribute("y", clickable.y);
      clickableArea.setAttribute("width", clickable.w);
      clickableArea.setAttribute("height", clickable.h);
      clickableArea.classList.add('clickable');
      clickableArea.addEventListener('mousedown', e => {this.setTime(e)});
      document.querySelector(`#character-player-${i}`).appendChild(clickableArea);

      let audioElement = document.createElement('AUDIO');
      audioElement.id = `character-audio-${i}`;
      audioElement.preload = 'none';
      audioElement.dataSize = 45;
      audioElement.currentTime = 0;
      audioElement.addEventListener('timeupdate', (e) => this.updatePlayer(e.target));
      document.body.appendChild(audioElement);

      document.querySelector(`#character-button-${i}`).addEventListener('click', (e) => {this.playPause(e)});

      if (i < this.characters.length) this.displayCharacter(this.characters[i].id);
    });
  }

  playPause(e) {
    // get audio info
    let targetId = e.target.id.slice(-1);
    let audioElement = document.getElementById(`character-audio-${targetId}`);

    // pause all other players
    Array.from(document.querySelectorAll('audio')).map(audio => audio.id !== audioElement.id ? audio.pause() : ``);

    // play or pause audio
    audioElement.paused ? audioElement.play() : audioElement.pause();
  }

  getClickableAreas() {
    for (let i = 0; i < 4 ; i++) {
      let targetElement = document.querySelector(`#character-timeline-${i}`);
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
      this.clickables.push(clickable);
    }
  }

  displayCharacter (id) {
    if (!this.activeCharacters.includes(id)){
      // get character character info
      let thisCharacter = this.characters.filter( char => char.id === id)[0];

      // get all players that are not visible
      let hiddenPlayers = Array.from(document.querySelectorAll('.character-player.hidden'));

      // if there are hidden players, select the first of them, else select the last player to be changed
      let thisPlayer;
      if (hiddenPlayers.length > 0) {
        thisPlayer = hiddenPlayers[0];
      } else {
        thisPlayer = document.querySelector(`#character-player-${this.playerIndex}`);
        this.playerIndex >= 3 ? this.playerIndex = 0 : this.playerIndex++;
      }

      // get player index from id
      let thisIndex = thisPlayer.id.slice(-1);

      // make player visible
      thisPlayer.classList.remove('hidden');

      // set audio source
      let audioElement = document.querySelector(`#character-audio-${thisIndex}`);
      audioElement.src = `../audios/${thisCharacter.audio}`;

      // set character name
      let characterName = document.querySelector(`#character-name-${thisIndex}`);
      characterName.innerHTML = thisCharacter.character;

      this.activeCharacters[thisIndex] = id;
    }
  }

  getCharacters() {
    // console.log(`this group id: ${this.id}`)
    if (this.id[0] === 'G'){
      this.characters = data['characters'].filter(
        info => info[`group`] === this.id
      )
    } else {
      this.characters = data['characters'].filter(
        info => info[`subgroup`] === this.id
      )
    }
  }

  setTime(e) {
    // update audio time based on where the timebar was clicked
    let targetId = e.target.id.slice(-1);
    let audioElement = document.getElementById(`character-audio-${targetId}`);
    audioElement.currentTime = mapValue(e.offsetX, 0, this.clickables[targetId].w, 0, audioElement.duration);
  }

  updatePlayer(target) {
    let audioElement = target;
    let targetId = target.id.slice(-1);
    let clickable = this.clickables[targetId];
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker =  document.getElementById(`character-marker-${targetId}`);
    let timebar =  document.getElementById(`character-timebar-${targetId}`);
    let markerPos = mapValue(currentTime, 0, audioElement.duration, clickable.x, clickable.x + clickable.w);
    if (isNaN(markerPos)) {
      markerPos = clickable.x;
    }
    marker.setAttribute("x1", parseInt(markerPos));
    marker.setAttribute("x2", parseInt(markerPos));
    timebar.setAttribute("x2", parseInt(markerPos));

    // update time
    let timeString = document.getElementById(`character-time-${targetId}`);
    timeString.innerHTML = `– ${getFormattedTime(currentTime)}`
  }

  removeElements() {
    // delete SVG element
    document.querySelector(`#group-player`).remove();

    // delete audio elements
    Array.from(document.querySelectorAll('audio')).map(audio => audio.remove());
  }
}
