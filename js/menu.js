// let hoverMenu = document.querySelector( '#hidden-menu' );
let contentInfo = $("#info-top-bar");
let btnInfo = document.querySelector("#btn-info");
let btnClose = document.querySelector("#btn-close");
let videoElement = document.getElementById("video");
let btnCloseMenu = document.querySelector("#btn-close-menu");
let menuTitle = document.querySelector("#menu-title");

let btnSound = document.querySelector("#btn-sound");
let soundIsOn = true;

// document.querySelector(document).ready(function () {
//   init();
// });

let infoIsVisible = false;

function showContentInfo() {
  if (infoIsVisible) {
    contentInfo.fadeOut("slow");
    infoIsVisible = false;
  } else {
    contentInfo.fadeIn();
    infoIsVisible = true;
  }
}

function handleSound() {
  let homeAudio = document.querySelector("#home-audio");
  let guideAudio = document.querySelector("#guide-audio");
  let playButton = document.querySelector("#btn-sound-on");
  let pauseButton = document.querySelector("#btn-sound-off");

  if (soundIsOn) {
    guideAudio.pause();
    homeAudio.pause();
    playButton.classList.add("invisible");
    pauseButton.classList.remove("invisible");
  } else {
    pauseButton.classList.add("invisible");
    playButton.classList.remove("invisible");

    if (!d3.select("#guide-modal").classed("modal-hidden")) {
      guideAudio.currentTime = 0;
      guideAudio.play();
    } else if (lastClick.type == "restart") {
      homeAudio.currentTime = 0;
      homeAudio.play();
    }
  }
  soundIsOn = !soundIsOn;
}

function showVideo() {
  Array.from(document.querySelectorAll("audio")).map((audio) =>
    audio.id !== this.audioId ? audio.pause() : ``
  );
  videoElement.currentTime = 0;
  playVideo();
  document.querySelector("#video-modal").classList.remove("modal-hidden");
  // document.querySelector('#video-modal').show()
}

function hideVideo() {
  videoElement.pause();
  videoElement.currentTime = 0;
  videoElement.muted = true;
  document.querySelector("#video-modal").classList.add("modal-hidden");
  d3.selectAll(".hidden-first").classed("hidden-first", false);
}

function playVideo() {
  if (videoElement.muted === true) {
    videoElement.muted = false;
    videoElement.play();
  } else {
    videoElement.muted = true;
    videoElement.pause();
  }
}

let organizersAreSet = false;

function showNarratives() {
  organizersAreSet ? "" : setOrganizerInfo();

  // prepare homepage
  getAllNames();
  restart();

  d3.select("#body").classed("black-bg", false);
  d3.select("#body").classed("gradient-bg", true);
  d3.selectAll(".menu-button").classed("hidden-intro-page", false);
  d3.select("#intro-page").classed("hidden-intro-page", true);
  setMenuColor("white");

  // hide intro video, if visible
  hideVideo();

  // start sound
  if (soundIsOn) {
    let homeAudio = document.querySelector("#home-audio");
    homeAudio.play();
    homeAudio.currentTime = 0;
  }
  // homeAudio.currentTime === 0 ? homeAudio.play() : '';
}

function setMenuColor(colorToSet) {
  let color = colorToSet === "black" ? true : false;
  d3.select("#menu-title").classed("in-intro", color);
  d3.select("#info-menu-content").classed("in-intro", color);
  d3.selectAll(".info-button").classed("in-intro", color);
}

function showIntroPage() {
  if (d3.select("#intro-page").classed("hidden-intro-page")) {
    d3.select("#body").classed("black-bg", true);
    d3.select("#body").classed("gradient-bg", false);
    d3.selectAll(".menu-button").classed("hidden-intro-page", true);
    d3.select("#intro-page").classed("hidden-intro-page", false);
    setMenuColor("black");
    restart();
    closeGuide();
    document.querySelector("#home-audio").pause();
  } else {
    infoIsVisible ? showContentInfo() : "";
  }
}

function showCredits() {
  let credits = d3.select("#intro-credits");
  document.querySelector("#intro-credits").innerHTML = creditsContent;
  let visibility = credits.classed("hidden-intro-page") ? false : true;
  credits.classed("hidden-intro-page", visibility);
}

function infoTooltip() {
  const tooltip = document.querySelector("#info-tooltip");
  if (tooltip.classList.contains("visible-tooltip")) {
    tooltip.classList.remove("visible-tooltip");
  } else {
    tooltip.classList.add("visible-tooltip");
  }
}

function init() {
  document
    .querySelector("#credits-node")
    .addEventListener("click", showCredits);
  document.querySelector("#guide-node").addEventListener("click", () => {
    showNarratives();
    openGuide("guide-01");
  });
  document.querySelector("#intro-node").addEventListener("click", showVideo);
  document.querySelector("#intro-label").addEventListener("click", showVideo);
  document.querySelector("#menu-logo").addEventListener("click", showIntroPage);
  document
    .querySelector("#narratives-node")
    .addEventListener("click", showNarratives);
  document
    .querySelector("#narratives-label")
    .addEventListener("click", showNarratives);

  btnInfo.addEventListener("click", showVideo);
  btnInfo.addEventListener("mouseover", infoTooltip);
  btnInfo.addEventListener("mouseout", infoTooltip);
  btnClose.addEventListener("click", hideVideo);
  menuTitle.addEventListener("click", showContentInfo);
  btnSound.addEventListener("click", handleSound);
  btnCloseMenu.addEventListener("click", showContentInfo);

  videoElement.addEventListener("ended", hideVideo);

  // create home audio
  let audioElement = document.createElement("AUDIO");
  audioElement.id = "home-audio";
  audioElement.preload = "auto";
  videoElement.controls = "controls";
  audioElement.src = `./audios/HOME.wav`;
  document.body.appendChild(audioElement);

  showIntroPage();

  // set guide buttons
  for (let i = 1; i < 9; i++) {
    document.querySelector(`#guide-0${i}`).addEventListener("click", () => {
      showGuideContent(`guide-0${i}`);
    });
  }

  // show hidden menu
  setTimeout(showContentInfo, 3000);

  // show video
  // showVideo();
}

function setOrganizerInfo() {
  // ABC PAZ
  G11.audios = [
    data["characters"].find((char) => char.id == "P-18"),
    data["scenes"].find((scene) => scene.id == "O-10"),
    data["scenes"].find((scene) => scene.id == "O-12"),
    data["scenes"].find((scene) => scene.id == "O-13"),
    data["scenes"].find((scene) => scene.id == "O-14"),
    data["scenes"].find((scene) => scene.id == "O-15"),
    data["scenes"].find((scene) => scene.id == "O-16"),
  ];

  // ICTJ
  G09.audios = [
    data["characters"].find((char) => char.id == "P-33"),
    data["scenes"].find((scene) => scene.id == "O-03"),
    data["scenes"].find((scene) => scene.id == "O-04"),
    data["scenes"].find((scene) => scene.id == "O-05"),
    data["characters"].find((char) => char.id == "P-34"),
    data["scenes"].find((scene) => scene.id == "O-01"),
    data["scenes"].find((scene) => scene.id == "O-02"),
  ];

  // CEV
  G10.audios = [
    data["characters"].find((char) => char.id == "P-36"),
    data["scenes"].find((scene) => scene.id == "O-06"),
    data["scenes"].find((scene) => scene.id == "O-07"),
    data["scenes"].find((scene) => scene.id == "O-08"),
    data["scenes"].find((scene) => scene.id == "O-09"),
  ];

  organizersAreSet = true;
}
