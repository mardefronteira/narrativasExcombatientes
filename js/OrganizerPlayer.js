class OrganizerPlayer {
  constructor(id) {
    this.id = id.slice(0, 4);
    this.playerId = `organizer-player`;
    this.jsId = this.id.replace("-", "");
    this.playerSVG = eval(`${this.jsId}.player`); // player SVG in ./svg/players.js
    this.audios = eval(`${this.jsId}.audios`);
    this.timecodes = [];
    this.characters = [];
    this.clickables = [];
    this.numPlayers = 0;
  }

  display() {
    // hide original node
    document.querySelector(`#${this.id}`).classList.add("hidden");

    // create SVG player object
    let gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElement.id = this.playerId;
    gElement.innerHTML = this.playerSVG;
    document.querySelector("#organizers").appendChild(gElement);

    // get the number of players in SVG
    this.numPlayers = Array.from(document.querySelectorAll(".timeline")).length;

    // create clickable area for players
    this.getClickableAreas();

    this.clickables.map((clickable, i) => {
      let clickableArea = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      clickableArea.setAttribute("id", `organizer-clickable-${i}`);
      clickableArea.setAttribute("x", clickable.x);
      clickableArea.setAttribute("y", clickable.y);
      clickableArea.setAttribute("width", clickable.w);
      clickableArea.setAttribute("height", clickable.h);
      clickableArea.classList.add("clickable");
      clickableArea.addEventListener("mousemove", (e) => {
        mouseIsPressed ? this.setTime(e) : "";
      });
      clickableArea.addEventListener("mousedown", (e) => {
        this.setTime(e);
      });
      this.id === "G-11"
        ? document
            .querySelector(`#organizer-player-${i}`)
            .appendChild(clickableArea)
        : document
            .querySelector(`#organizer-g-${i}`)
            .appendChild(clickableArea);

      let audioElement = document.createElement("AUDIO");
      audioElement.id = `organizer-audio-${i}`;
      audioElement.classList.add("organizer-audio");
      audioElement.preload = "none";
      audioElement.dataSize = 45;
      audioElement.currentTime = 0;
      audioElement.src = `./audios/${this.audios[i].audio}`;
      audioElement.addEventListener("timeupdate", (e) =>
        this.updatePlayer(e.target)
      );
      document.body.appendChild(audioElement);

      document
        .querySelector(`#organizer-button-${i}`)
        .addEventListener("click", (e) => {
          this.playPause(e.target.id);
        });

      // if the group is not ABC PAZ, and the player index is one of the interactive ones
      if (
        (this.id === "G-09" && ![0, 4].includes(i)) ||
        (this.id === "G-10" && i !== 0)
      ) {
        // set clear characters, set initial time
        document.querySelector(`#character-name-${i}`).innerHTML = "";
        document.querySelector(`#character-alias-${i}`).innerHTML = "";
        document.querySelector(`#character-group-${i}`).innerHTML = "";
        document.querySelector(`#character-overflow-${i}`).innerHTML = "";
      }

      let timeString = document.getElementById(`organizer-time-${i}`);
      timeString.innerHTML = `– 00:00 / ${this.audios[i].duration}`;
    });

    if (eval(`${this.jsId}.frameList`) !== undefined) {
      const frameList = eval(`${this.jsId}.frameList`);
      for (let i = 0; i < frameList.length; i++) {
        let thisFrame = `#${frameList[i][1]}`;
        document
          .querySelector(`#organizer-frame-${frameList[i][0]}`)
          .addEventListener("click", () => {
            getClickedElement(d3.select(`#${frameList[i][1]}`));
            restart();
            show_elements();
            updateLastClick();
          });
      }
    } else {
      const themes = Array.from(document.querySelectorAll(".abc-node"));
      for (let theme of themes) {
        theme.addEventListener("click", (e) => {
          this.setAudioSource(e);
        });
      }
    }

    if (this.id !== "G11") {
      for (let audio of this.audios) {
        // get audio times
        this.timecodes.push(
          data["audios"].filter((relation) => relation["scene"] === audio.id)
        );
      }
      // populate this.characters array with their info
      this.characters = this.getCharacters();
    }
  }

  getCharacters() {
    let characterIds = [];
    let characterInfos = [];
    this.timecodes.map((scene) => {
      scene.map((timecode) => {
        if (!characterIds.includes(timecode.character)) {
          characterIds.push(timecode.character);
        }
      });
    });

    // map characterIds, push its data to characterInfos
    characterIds.map((characterId) => {
      characterInfos.push(
        data["characters"].filter((info) => info["id"] === characterId)[0]
      );
    });

    // get group and subgroup names
    characterInfos.map((char) => {
      char.groupName = getGroupName(char);
    });

    return characterInfos;
  }

  playPause(id) {
    // get audio info
    let targetId = id.slice(-1);
    let audioElement = document.getElementById(`organizer-audio-${targetId}`);

    // pause all other players
    Array.from(document.querySelectorAll("audio")).map((audio) =>
      audio.id !== audioElement.id ? audio.pause() : ``
    );
    d3.selectAll(".play-button").classed("hidden", false);
    d3.selectAll(".pause-button").classed("hidden", true);

    // play or pause audio
    audioElement.paused ? audioElement.play() : audioElement.pause();

    // show corresponding button
    let buttonToShow = audioElement.paused ? "play" : "pause";
    let buttonToHide = audioElement.paused ? "pause" : "play";
    document
      .getElementById(`organizer-${buttonToShow}-${targetId}`)
      .classList.remove("hidden");
    document
      .getElementById(`organizer-${buttonToHide}-${targetId}`)
      .classList.add("hidden");
  }

  getClickableAreas() {
    for (let i = 0; i < this.numPlayers; i++) {
      let targetElement = document.querySelector(`#organizer-timeline-${i}`);
      let timeline = {
        x1: targetElement.getAttribute("x1"),
        x2: targetElement.getAttribute("x2"),
        y1: targetElement.getAttribute("y1"),
      };
      let clickable = {
        x: parseInt(timeline.x1),
        y: timeline.y1 - 15,
        w: timeline.x2 - timeline.x1,
        h: 30,
      };
      this.clickables.push(clickable);
    }
  }

  setAudioSource(e) {
    const targetId = e.target.parentElement.id.slice(-1);

    // get audio source and time from js objects
    const thisAudio = this.audios[targetId].audio;
    const thisTime = this.audios[targetId].duration;

    // set audio source and total time
    let audioElement = document.querySelector(`#organizer-audio-1`);
    audioElement.src = `../audios/${thisAudio}`;

    let timeElement = document.querySelector(`#organizer-time-1`);
    timeElement.innerHTML = `– 00:00 / ${thisTime}`;

    // get theme description from html element
    const thisTheme = document.querySelector(`#abc-theme-${targetId}`)
      .innerHTML;

    // set audio description from theme
    let textElement = document.querySelector(`#organizer-text-1`);
    textElement.innerHTML = thisTheme;

    // pause all other players
    Array.from(document.querySelectorAll("audio")).map((audio) =>
      audio.id !== audioElement.id ? audio.pause() : ``
    );
    d3.selectAll(".play-button").classed("hidden", false);
    d3.selectAll(".pause-button").classed("hidden", true);

    // Display element with the play button
    document.querySelector("#organizer-play-1").classList.add("hidden");
    document.querySelector("#organizer-pause-1").classList.remove("hidden");

    audioElement.play();
  }

  setTime(e) {
    e = e || window.event;
    const target = e.target || e.srcElement,
      clickBox = target.getBoundingClientRect(),
      offsetX = e.clientX - clickBox.left;

    // update audio time based on where the timebar was clicked
    let targetId = e.target.id.slice(-1);
    let audioElement = document.getElementById(`organizer-audio-${targetId}`);
    audioElement.currentTime = mapValue(
      offsetX,
      0,
      clickBox.width,
      0,
      audioElement.duration
    );
  }

  updatePlayer(target) {
    let audioElement = target;
    let targetId = target.id.slice(-1);
    let duration =
      document.querySelector(`#organizer-time-${targetId}`) != null
        ? document
            .querySelector(`#organizer-time-${targetId}`)
            .innerHTML.slice(-5)
        : "";
    let clickable = this.clickables[targetId];
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker = document.getElementById(`organizer-marker-${targetId}`);
    if (marker !== null) {
      // make sure player still exists
      let timebar = document.getElementById(`organizer-timebar-${targetId}`);
      let markerPos = mapValue(
        currentTime,
        0,
        audioElement.duration,
        clickable.x,
        clickable.x + clickable.w
      );
      if (isNaN(markerPos)) {
        markerPos = clickable.x;
      }

      marker.setAttribute("x1", parseInt(markerPos));
      marker.setAttribute("x2", parseInt(markerPos));
      timebar.setAttribute("x2", parseInt(markerPos));

      // update time
      let timeString = document.getElementById(`organizer-time-${targetId}`);
      timeString.innerHTML = `– ${getFormattedTime(currentTime)} / ${duration}`;

      if (this.id !== "G-11") {
        // check for character info fields, if none, return.
        const character = document.querySelector(`#character-name-${targetId}`);
        if (!character) return;

        const alias = document.querySelector(`#character-alias-${targetId}`);
        const group = document.querySelector(`#character-group-${targetId}`);
        const groupOverflow = document.querySelector(
          `#character-overflow-${targetId}`
        );

        // get character that corresponds to timecode
        let currentCharacter = this.timecodes[targetId].find(
          (slice) =>
            slice.start_sec < currentTime && slice.end_sec > currentTime
        );
        if (currentCharacter) {
          currentCharacter = this.characters.find(
            (char) => char.id === currentCharacter.character
          );
        } else {
          currentCharacter = {
            character: "",
            groupName: "",
            alias: "",
          };
        }

        character.innerHTML = currentCharacter.character;
        alias.innerHTML = currentCharacter.alias
          ? `${currentCharacter.alias}`
          : "";

        switch (currentCharacter.group) {
          case "G-03":
            group.innerHTML = "EJÉRCITO DE LIBERACIÓN NACIONAL";
            groupOverflow.innerHTML = "- REPLANTEAMIENTO";
            break;
          case "G-08":
            group.innerHTML = "FUERZAS ARMADAS REVOLUCIONARIAS DE ";
            groupOverflow.innerHTML = "COLOMBIA - EJÉRCITO DEL PUEBLO";
            break;
          case "G-09":
            group.innerHTML = "CENTRO INTERNACIONAL PARA LA";
            groupOverflow.innerHTML = "JUSTICIA TRANSICIONAL";
            break;
          case "G-10":
            group.innerHTML = "COMISIÓN PARA EL ESCLARECIMIENTO DE LA VERDAD,";
            groupOverflow.innerHTML = "LA CONVICENCIA Y LA NO REPETICIÓN";
            break;
          default:
            group.innerHTML = currentCharacter.groupName;
            groupOverflow.innerHTML = "";
        }
      }
    }
  }

  removeElements() {
    // delete SVG element
    document.querySelector(`#organizer-player`)
      ? document.querySelector(`#organizer-player`).remove()
      : "";

    // delete audio elements
    Array.from(document.querySelectorAll(`.organizer-audio`)).map((audio) =>
      audio.remove()
    );
  }
}
