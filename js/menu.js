// let hoverMenu = $( '#hidden-menu' );
let contentInfo = $( '#info-top-bar' );
let btnInfo = $( '#btn-info' );
let btnClose = $( '#btn-close' );
let video = $( '#video' );
let videoElement = document.getElementById('video');
let btnActiveSound = $( '#btn-play' );
let btnCloseMenu = $( '#btn-close-menu' );
let menuTitle = $( '#menu-title' );

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

function showVideo() {
  Array.from(document.querySelectorAll('audio')).map(audio => audio.id !==  this.audioId ? audio.pause() : ``);
  videoElement.currentTime = 0;
  playVideo();
  $('#video-modal').show()
}

function hideVideo () {
  videoElement.pause();
  videoElement.currentTime = 0;
  videoElement.muted = true;
  $('#video-modal').hide();

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
  let homeAudio = document.querySelector('#home-audio');
  homeAudio.currentTime = 0;
  homeAudio.play();
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
}

function showCredits() {
  let credits = d3.select('#intro-credits');
  let visibility = credits.classed('hidden-intro-page') ? false : true;
  credits.classed('hidden-intro-page', visibility);
}

function init() {
  showIntroPage();

  document.querySelector('#credits-node').addEventListener('click', showCredits)
  document.querySelector('#guide-node').addEventListener('click', openGuide);
  document.querySelector('#intro-node').addEventListener('click', showVideo);
  document.querySelector('#intro-label').addEventListener('click', showVideo);
  document.querySelector('#menu-logo').addEventListener('click', showIntroPage);
  document.querySelector('#narratives-node').addEventListener('click', showNarratives);
  document.querySelector('#narratives-label').addEventListener('click', showNarratives);

  btnInfo.on('click', showVideo);
  btnClose.on('click', showNarratives);
  menuTitle.on('click', showContentInfo);
  btnActiveSound.on('click', playVideo);
  btnCloseMenu.on('click', showContentInfo);

  video.bind('ended', hideVideo);

  // create home audio
  let audioElement = document.createElement('AUDIO');
  audioElement.id = 'home-audio';
  audioElement.preload = 'auto';
  audioElement.currentTime = 0;
  audioElement.src = `./audios/HOME.mp3`;
  document.body.appendChild(audioElement);
  audioElement.loop();
}
