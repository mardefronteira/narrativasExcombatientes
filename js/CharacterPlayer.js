class CharacterPlayer {
  constructor(id) {
    this.id = id.slice(0,4);
    this.playerId = `character-player`;
    this.playerSVG = characterPlayer; // player SVG in ./svg/players.js
    this.character = data['characters'].filter(character => character['id'] === this.id)[0];
    this.clickable = {};
  }

  display() {
    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    gElement.classList.add('player');
    document.querySelector('#players').appendChild(gElement);

    // set character info
    document.querySelector('#character-name').innerHTML = this.character.character;
    document.querySelector('#character-group').innerHTML = getGroupName(this.character);

    // create players and audios for characters
    this.clickable = this.getClickableArea();

    let clickableArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    clickableArea.setAttribute("id", `character-clickable`)
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
    audioElement.preload = 'auto';
    audioElement.dataSize = 45;
    audioElement.currentTime = 0;
    audioElement.src = `../audios/${this.character.audio}`;
    audioElement.addEventListener('timeupdate', (e) => this.updatePlayer(e.target));
    document.body.appendChild(audioElement);

    document.querySelector(`#character-button`).addEventListener('click', (e) => {this.playPause(e)});
  }

  playPause(e) {
    // get audio info
    let audioElement = document.getElementById(`character-audio`);

    // play or pause audio
    audioElement.paused ? audioElement.play() : audioElement.pause();
  }

  getClickableArea() {
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
    return clickable;
  }

  setTime(e) {
    // update audio time based on where the timebar was clicked
    let audioElement = document.getElementById(`character-audio`);
    audioElement.currentTime = mapValue(e.offsetX, 0, this.clickable.w, 0, audioElement.duration);
  }

  updatePlayer(target) {
    let audioElement = target;
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker =  document.getElementById(`character-marker`);
    let timebar =  document.getElementById(`character-timebar`);
    let markerPos = mapValue(currentTime, 0, audioElement.duration, this.clickable.x, this.clickable.x + this.clickable.w);
    if (isNaN(markerPos)) {
      markerPos = this.clickable.x;
    }
    marker.setAttribute("x1", parseInt(markerPos));
    marker.setAttribute("x2", parseInt(markerPos));
    timebar.setAttribute("x2", parseInt(markerPos));

    // update time
    let timeString = document.getElementById(`character-time`);
    timeString.innerHTML = `– ${getFormattedTime(currentTime)}`
  }

  removeElements() {
    // delete SVG element
    document.querySelector(`#character-player`).remove();

    // delete audio elements
    Array.from(document.querySelectorAll('audio')).map(audio => audio.remove());
  }
}
