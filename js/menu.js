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
  $('.modal').show()

  videoElement.currentTime = 0;
  playVideo();
}

function hideVideo () {
  videoElement.pause();
  videoElement.currentTime = 0;
  videoElement.muted = true;
  $('.modal').hide();

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
  getAllNames();
  d3.select('#body').classed( 'black-bg', false );
  d3.select('#body').classed( 'gradient-bg', true );
  d3.selectAll('.menu-button').classed('hidden-intro-page',false);
  d3.select('#intro-page').classed( 'hidden-intro-page', true );
}

function showIntroPage() {
  d3.select('#body').classed( 'black-bg', true );
  d3.select('#body').classed( 'gradient-bg', false );
  d3.selectAll('.menu-button').classed('hidden-intro-page',true);
  d3.select('#intro-page').classed( 'hidden-intro-page', false );
}

function init() {
  showIntroPage();

  document.querySelector('#intro-node').addEventListener('click', showVideo);
  document.querySelector('#intro-label').addEventListener('click', showVideo);
  document.querySelector('#menu-logo').addEventListener('click', showIntroPage);
  document.querySelector('#narratives-node').addEventListener('click', showNarratives);
  document.querySelector('#narratives-label').addEventListener('click', showNarratives);

  btnInfo.on('click', () => playVideoWithSound(0));
  btnClose.on('click', hideVideo);
  menuTitle.on('click', showContentInfo);
  btnActiveSound.on('click', playVideo);
  btnCloseMenu.on('click', showContentInfo);

  video.bind('ended', hideVideo);
}
