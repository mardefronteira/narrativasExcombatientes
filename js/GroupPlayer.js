class GroupPlayer {
  constructor(id) {
    this.id = id.slice(0,4);
    this.playerId = `group-player`;
    this.jsId = this.id.replace("-","");
    this.playerSVG = eval(`${this.jsId}.player`); // player SVG in ./svg/players.js
    this.characters = [];
    this.clickable;
  }

  display() {
    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    gElement.classList.add('player');
    document.querySelector('#players').appendChild(gElement);

    // get character data
    this.getCharacters();

    // create players and audios for characters
    this.getClickableAreas();

    let clickableArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    clickableArea.setAttribute("id", `character-clickable`);
    clickableArea.setAttribute("x", this.clickable.x);
    clickableArea.setAttribute("y", this.clickable.y);
    clickableArea.setAttribute("width", this.clickable.w);
    clickableArea.setAttribute("height", this.clickable.h);
    clickableArea.classList.add('clickable');
    clickableArea.addEventListener('mousemove', e => {mouseIsPressed ? this.setTime(e) : ''});
    clickableArea.addEventListener('click', e => {this.setTime(e)});
    document.querySelector(`#character-player`).appendChild(clickableArea);

    let audioElement = document.createElement('AUDIO');
    audioElement.id = `character-audio`;
    audioElement.preload = 'none';
    audioElement.dataSize = 45;
    audioElement.currentTime = 0;
    audioElement.addEventListener('timeupdate', (e) => this.updatePlayer(e.target));
    document.body.appendChild(audioElement);

    document.querySelector(`#character-button`).addEventListener('click', (e) => {this.playPause(e)});

    let randomCharacter = this.characters[Math.floor(Math.random() * this.characters.length)].id;
    this.displayCharacter(randomCharacter);
  }

  playPause(e) {
    // get audio info
    let targetId = e.target.id.slice(-1);
    let audioElement = document.getElementById(`character-audio`);

    // pause all other players
    Array.from(document.querySelectorAll('audio')).map(audio => audio.id !== audioElement.id ? audio.pause() : ``);

    // play or pause audio
    audioElement.paused ? audioElement.play() : audioElement.pause();

    // show corresponding button
    let buttonToShow = audioElement.paused ? 'play' : 'pause';
    let buttonToHide = audioElement.paused ? 'pause' : 'play';
    document.getElementById(`character-${buttonToShow}-button`).classList.remove('hidden');
    document.getElementById(`character-${buttonToHide}-button`).classList.add('hidden');
  }

  getClickableAreas() {
      let targetElement = document.querySelector(`#character-timeline`);
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
      this.clickable = clickable;
  }

  displayCharacter (id) {
    // get character character info
    let thisCharacter = this.characters.find( char => char.id === id);

    // set audio source
    let audioElement = document.querySelector(`#character-audio`);
    audioElement.src = `../audios/${thisCharacter.audio}`;

    // set character name
    let characterName = document.querySelector(`#character-name`);
    characterName.innerHTML = thisCharacter.character;

    // Display element with the play button
    document.querySelector('#character-player').classList.remove('hidden');
    document.querySelector('#character-play-button').classList.remove('hidden');
    document.querySelector('#character-pause-button').classList.add('hidden');
  }

  getCharacters() {
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
    e = e || window.event;
    const target = e.target || e.srcElement,
    clickBox = target.getBoundingClientRect(),
    offsetX = e.clientX - clickBox.left;

    // update audio time based on where the timebar was clicked
    let targetId = e.target.id.slice(-1);
    let audioElement = document.getElementById(`character-audio`);
    audioElement.currentTime = mapValue(offsetX, 0, clickBox.width, 0, audioElement.duration);
  }

  updatePlayer(target) {
    let audioElement = target;
    let targetId = target.id.slice(-1);
    let clickable = this.clickable;
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker =  document.getElementById(`character-marker`);
    if (marker !== null){ // make sure player still exists
      let timebar =  document.getElementById(`character-timebar`);
      let markerPos = mapValue(currentTime, 0, audioElement.duration, clickable.x, clickable.x + clickable.w);
      if (isNaN(markerPos)) {
        markerPos = clickable.x;
      }

      marker.setAttribute("x1", parseInt(markerPos));
      marker.setAttribute("x2", parseInt(markerPos));
      timebar.setAttribute("x2", parseInt(markerPos));

      // update time
      let timeString = document.getElementById(`character-time`);
      timeString.innerHTML = `– ${getFormattedTime(currentTime)}`
    }
  }

  removeElements() {
    // delete SVG element
    document.querySelector(`#group-player`).remove();

    // delete audio elements
    document.querySelector(`#character-audio`).remove();
  }
}
