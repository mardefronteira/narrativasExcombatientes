let firstTime = [true, true, true, true, true, true];
/*
  o problema aqui é que você cria um player novo a cada vez que abre, e assim cria dois event listeners o que resulta em dar play e pause ao mesmo tempo.
*/

class TooltipPlayer {
  constructor(id) {
    this.id = id.slice(0, 4);
    this.jsId = this.id.replace("-", "");
    this.playerId = `tooltip-player`;
    this.frame = data["frames"].find((frame) => frame.id === this.id);
    this.clickable = {};
    this.iFirst = this.id.slice(-1) - 1;
  }

  display() {
    if (firstTime[this.iFirst]) {
      document
        .querySelector(`#${this.id}-button`)
        .addEventListener("click", (e) => {
          this.playPause(e);
        });

      firstTime[this.iFirst] = false;
    }
    // create clickable area
    this.clickable = this.getClickableArea();

    let clickableArea = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    clickableArea.setAttribute("id", `tooltip-clickable`);
    clickableArea.setAttribute("x", this.clickable.x);
    clickableArea.setAttribute("y", this.clickable.y);
    clickableArea.setAttribute("width", this.clickable.w);
    clickableArea.setAttribute("height", this.clickable.h);
    clickableArea.classList.add("clickable");
    clickableArea.addEventListener("mousemove", (e) => {
      mouseIsPressed ? this.setTime(e) : "";
    });
    clickableArea.addEventListener("click", (e) => {
      this.setTime(e);
    });
    document.querySelector(`#${this.id}-tooltip`).appendChild(clickableArea);

    let audioElement = document.createElement("AUDIO");
    audioElement.id = `tooltip-audio`;
    audioElement.preload = "auto";
    audioElement.currentTime = 0;
    audioElement.src = `../audios/${this.id}.mp3`;
    audioElement.addEventListener("timeupdate", (e) =>
      this.updatePlayer(e.target)
    );
    audioElement.addEventListener("ended", () => {
      this.hideTooltip(this.id);
    });
    document.body.appendChild(audioElement);
    this.playPause();
    // update time
    let timeString = document.getElementById(`${this.id}-time`);
    timeString.innerHTML = `– 00:00 / ${this.frame.duration}`;
  }

  playPause(e) {
    // get audio info
    let audioElement = document.getElementById(`tooltip-audio`);

    // pause all other players
    Array.from(document.querySelectorAll("audio")).map((audio) =>
      audio.id !== audioElement.id ? audio.pause() : ``
    );

    // play or pause audio
    audioElement.paused ? audioElement.play() : audioElement.pause();

    // show corresponding button
    let buttonToShow = audioElement.paused ? "play" : "pause";
    let buttonToHide = audioElement.paused ? "pause" : "play";
    document
      .getElementById(`${this.id}-${buttonToShow}-button`)
      .classList.remove("hidden");
    document
      .getElementById(`${this.id}-${buttonToHide}-button`)
      .classList.add("hidden");
  }

  getClickableArea() {
    let targetElement = document.querySelector(`#${this.id}-timeline`);
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
    return clickable;
  }

  setTime(e) {
    e = e || window.event;
    const target = e.target || e.srcElement,
      clickBox = target.getBoundingClientRect(),
      offsetX = e.clientX - clickBox.left;

    // update audio time based on where the timebar was clicked
    let audioElement = document.getElementById(`tooltip-audio`);
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
    let currentTime = audioElement.currentTime;

    // get marker and timebar, and scale them to the current audio time
    let marker = document.getElementById(`${this.id}-marker`);
    let timebar = document.getElementById(`${this.id}-timebar`);
    let markerPos = mapValue(
      currentTime,
      0,
      audioElement.duration,
      this.clickable.x,
      this.clickable.x + this.clickable.w
    );
    if (isNaN(markerPos)) {
      markerPos = this.clickable.x;
    }
    marker.setAttribute("x1", parseInt(markerPos));
    marker.setAttribute("x2", parseInt(markerPos));
    timebar.setAttribute("x2", parseInt(markerPos));

    // update time
    let timeString = document.getElementById(`${this.id}-time`);
    timeString.innerHTML = `– ${getFormattedTime(currentTime)} / ${
      this.frame.duration
    }`;
  }

  hideTooltip(id) {
    // hide tooltip
    document
      .querySelector(`#${id}-tooltip`)
      .classList.remove("visible-tooltip");
  }

  removeElements() {
    // hide tooltip
    document
      .querySelector(`#${this.id}-tooltip`)
      .classList.remove("visible-tooltip");

    // delete SVG clickable
    if (document.querySelector(`#tooltip-clickable`)) {
      document.querySelector(`#tooltip-clickable`).remove();
    }
    // delete audio element
    document.querySelector(`#tooltip-audio`).remove();
  }
}
