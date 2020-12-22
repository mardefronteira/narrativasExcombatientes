class OrganizerPlayer {
  constructor(id) {
    this.id = id.slice(0,4);
    this.playerId = `organizer-player`;
    this.jsId = this.id.replace("-","");
    this.playerSVG = eval(`${this.jsId}.player`); // player SVG in ./svg/players.js
    this.audioFiles = eval(`${this.jsId}.audioFiles`);
    this.characters = [];
    this.clickables = [];
    this.numPlayers = 0;
  }

  display() {
    // create SVG player object
    let gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    document.querySelector('#organizers').appendChild(gElement);

    // get the number of players in
    this.numPlayers = Array.from(document.querySelectorAll('.organizer-time')).length;

    // get character data
    this.getCharacters();

    // create players and audios for characters
    this.getClickableAreas();

    this.clickables.map((clickable, i) => {
      let clickableArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      clickableArea.setAttribute("id", `organizer-clickable-${i}`)
      clickableArea.setAttribute("x", clickable.x);
      clickableArea.setAttribute("y", clickable.y);
      clickableArea.setAttribute("width", clickable.w);
      clickableArea.setAttribute("height", clickable.h);
      clickableArea.classList.add('clickable');
      clickableArea.addEventListener('mousemove', e => {mouseIsPressed ? this.setTime(e) : ''});
      clickableArea.addEventListener('mousedown', e => {this.setTime(e)});
      document.querySelector(`#organizer-player-${i}`).appendChild(clickableArea);

      let audioElement = document.createElement('AUDIO');
      audioElement.id = `organizer-audio-${i}`;
      audioElement.classList.add('organizer-audio');
      audioElement.preload = 'none';
      audioElement.dataSize = 45;
      audioElement.currentTime = 0;
      audioElement.src = `./audios/${this.audioFiles[i]}`
      audioElement.addEventListener('timeupdate', (e) => this.updatePlayer(e.target));
      document.body.appendChild(audioElement);

      document.querySelector(`#organizer-button-${i}`).addEventListener('click', (e) => {this.playPause(e)});

      // if (i < this.characters.length) this.displayCharacter(this.characters[i].id);

      let timeString = document.getElementById(`organizer-time-${i}`);
      timeString.innerHTML = `– 00:00 / 02:16`;
    });

    if (this.id == 'G-10') {
      const frame = eval(`${this.jsId}.frameList`);
      for (let i = 0; i < 6; i++) {
          // let thisFrame = `#${frame[i]}`;
          // console.log(thisFrame)
          document.querySelector(`#organizer-frame-${i+1}`).addEventListener('click', () => {
          getClickedElement( d3.select(`#${frame[i]}`) );
          restart();
          show_elements();
          updateLastClick();
        });
      }
    }
  }

  playPause(e) {
    // get audio info
    let targetId = e.target.id.slice(-1);
    let audioElement = document.getElementById(`organizer-audio-${targetId}`);

    // pause all other players
    Array.from(document.querySelectorAll('audio')).map(audio => audio.id !== audioElement.id ? audio.pause() : ``);
    d3.selectAll('.play-button').classed('hidden', false);
    d3.selectAll('.pause-button').classed('hidden', true);

    // play or pause audio
    audioElement.paused ? audioElement.play() : audioElement.pause();

    // show corresponding button
    let buttonToShow = audioElement.paused ? 'play' : 'pause';
    let buttonToHide = audioElement.paused ? 'pause' : 'play';
    document.getElementById(`organizer-${buttonToShow}-${targetId}`).classList.remove('hidden');
    document.getElementById(`organizer-${buttonToHide}-${targetId}`).classList.add('hidden');
  }


  getClickableAreas() {
  for (let i = 0; i < this.numPlayers ; i++) {
    let targetElement = document.querySelector(`#organizer-timeline-${i}`);
    // console.log(`#organizer-timeline-${i}`);
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
//
//   displayCharacter (id) {
//     // get character character info
//     let thisCharacter = this.characters.find( char => char.id === id);
//
//     // set audio source
//     let audioElement = document.querySelector(`#organizer-audio`);
//     audioElement.src = `../audios/${thisCharacter.audio}`;
//
//     // set character name
//     let characterName = document.querySelector(`#organizer-name`);
//     characterName.innerHTML = thisCharacter.character;
//
//     let characterAlias = document.querySelector(`#organizer-alias`);
//     characterAlias.innerHTML = thisCharacter.alias;
//
//     // Display element with the play button
//     document.querySelector('#organizer-player').classList.remove('hidden');
//     document.querySelector('#organizer-play-button').classList.remove('hidden');
//     document.querySelector('#organizer-pause-button').classList.add('hidden');
//   }
//
  getCharacters() {
    this.characters = data['characters'].filter(
        info => info[`group`] === this.id
      );
  }

  setTime(e) {
    e = e || window.event;
    const target = e.target || e.srcElement,
    clickBox = target.getBoundingClientRect(),
    offsetX = e.clientX - clickBox.left;

    // update audio time based on where the timebar was clicked
    let targetId = e.target.id.slice(-1);
    let audioElement = document.getElementById(`organizer-audio-${targetId}`);
    audioElement.currentTime = mapValue(offsetX, 0, clickBox.width, 0, audioElement.duration);
  }

  updatePlayer(target) {
    let audioElement = target;
    let targetId = target.id.slice(-1);
    let clickable = this.clickables[targetId];
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker =  document.getElementById(`organizer-marker-${targetId}`);
    if (marker !== null){ // make sure player still exists
      let timebar =  document.getElementById(`organizer-timebar-${targetId}`);
      let markerPos = mapValue(currentTime, 0, audioElement.duration, clickable.x, clickable.x + clickable.w);
      if (isNaN(markerPos)) {
        markerPos = clickable.x;
      }

      marker.setAttribute("x1", parseInt(markerPos));
      marker.setAttribute("x2", parseInt(markerPos));
      timebar.setAttribute("x2", parseInt(markerPos));

      // update time
      let timeString = document.getElementById(`organizer-time-${targetId}`);
      timeString.innerHTML = `– ${getFormattedTime(currentTime)} / 02:16`;
    }
  }

  removeElements() {
    // delete SVG element
    document.querySelector(`#organizer-player`) ? document.querySelector(`#organizer-player`).remove() : '';

    // delete audio elements
   Array.from(document.querySelectorAll(`.organizer-audio`)).map(audio => audio.remove());
  }
}
