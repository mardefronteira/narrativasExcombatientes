// let hoverMenu = $( '#hidden-menu' );
let contentInfo = $( '#info-top-bar' );
let btnInfo = $( '#btn-info' );
let btnClose = $( '#btn-close' );
let video = $( '#video' );
let videoElement = document.getElementById('video');
let btnCloseMenu = $( '#btn-close-menu' );
let menuTitle = $( '#menu-title' );

let btnSound = $( '#btn-sound' );
let soundIsOn = true;

$(document).ready(function(){
  init();
})

let infoIsVisible = false;

function showContentInfo(){
  if (infoIsVisible) {
    contentInfo.fadeOut('slow');
    infoIsVisible = false;
  } else {
    contentInfo.fadeIn();
    infoIsVisible = true;
  }
}

function handleSound() {
  let homeAudio = document.querySelector('#home-audio');
  let guideAudio = document.querySelector('#guide-audio');
  let playButton = document.querySelector('#btn-sound-on');
  let pauseButton = document.querySelector('#btn-sound-off');

  if (soundIsOn) {
    guideAudio.pause();
    homeAudio.pause();
    playButton.classList.add('invisible');
    pauseButton.classList.remove('invisible');
  } else {
    pauseButton.classList.add('invisible');
    playButton.classList.remove('invisible');

    if (!d3.select('#guide-modal').classed('modal-hidden')) {
      console.log('foi aqi')
      guideAudio.currentTime = 0;
      guideAudio.play();
    } else if (lastClick.type == 'restart') {
      console.log('foi aqiuuu')
      homeAudio.currentTime = 0;
      homeAudio.play();
    }
  }
    soundIsOn = !soundIsOn
}

function showVideo() {
  Array.from(document.querySelectorAll('audio')).map(audio => audio.id !==  this.audioId ? audio.pause() : ``);
  videoElement.currentTime = 0;
  playVideo();
  document.querySelector('#video-modal').classList.remove('modal-hidden');
  // $('#video-modal').show()
}

function hideVideo () {
  videoElement.pause();
  videoElement.currentTime = 0;
  videoElement.muted = true;
  document.querySelector('#video-modal').classList.add('modal-hidden');
  // $('#video-modal').hide();

}

function playVideo(){
  if (videoElement.muted === true) {
    videoElement.muted = false;
    videoElement.play();
  } else {
    videoElement.muted = true;
    videoElement.pause();
  }
}

function showNarratives() {
  // prepare homepage
  getAllNames();
  restart();

  d3.select('#body').classed( 'black-bg', false );
  d3.select('#body').classed( 'gradient-bg', true );
  d3.selectAll('.menu-button').classed('hidden-intro-page',false);
  d3.select('#intro-page').classed( 'hidden-intro-page', true );
  setMenuColor('white');

  // hide intro video, if visible
  hideVideo();

  // start sound
  if (soundIsOn) {
    let homeAudio = document.querySelector('#home-audio');
    homeAudio.play();
    homeAudio.currentTime = 0;
  }
  // homeAudio.currentTime === 0 ? homeAudio.play() : '';
}

function setMenuColor(colorToSet) {
  let color = colorToSet === 'black' ? true : false;
  d3.select('#menu-title').classed( 'in-intro', color );
  d3.select('#info-menu-content').classed( 'in-intro', color );
  d3.selectAll('.info-button').classed( 'in-intro', color );
}

function showIntroPage() {
  d3.select('#body').classed( 'black-bg', true );
  d3.select('#body').classed( 'gradient-bg', false );
  d3.selectAll('.menu-button').classed('hidden-intro-page',true);
  d3.select('#intro-page').classed( 'hidden-intro-page', false );
  setMenuColor('black');

  closeGuide();
  document.querySelector('#home-audio').pause();
}

function showCredits() {
  // let credits = d3.select('#intro-credits');
  // let visibility = credits.classed('hidden-intro-page') ? false : true;
  // credits.classed('hidden-intro-page', visibility);
}

function init() {
  document.querySelector('#credits-node').addEventListener('click', showCredits)
  document.querySelector('#guide-node').addEventListener('click', () => {showNarratives(); openGuide("guide-01");});
  document.querySelector('#intro-node').addEventListener('click', showVideo);
  document.querySelector('#intro-label').addEventListener('click', showVideo);
  document.querySelector('#menu-logo').addEventListener('click', showIntroPage);
  document.querySelector('#narratives-node').addEventListener('click', showNarratives);
  document.querySelector('#narratives-label').addEventListener('click', showNarratives);

  btnInfo.on('click', showVideo);
  btnClose.on('click', hideVideo);
  menuTitle.on('click', showContentInfo);
  btnSound.on('click', handleSound);
  btnCloseMenu.on('click', showContentInfo);

  video.bind('ended', hideVideo);

  // create home audio
  let audioElement = document.createElement('AUDIO');
  audioElement.id = 'home-audio';
  audioElement.preload = 'auto';
  audioElement.currentTime = 0;
  audioElement.src = `./audios/HOME.wav`;
  document.body.appendChild(audioElement);

  showIntroPage();

  // set guide buttons
  for (let i = 1; i < 9; i++) {
    document.querySelector(`#guide-0${i}`).addEventListener('click', () => {showGuideContent(`guide-0${i}`)});
  }

  setTimeout(showContentInfo, 3000);
}
