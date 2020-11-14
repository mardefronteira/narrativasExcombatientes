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

function showVideo () {
  $('.modal').show()

  video.bind('ended', function () {
    console.log('SE TERMINO EL VIDEO');
    hideVideo();
  })
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

// start video unmuted from a specific time in seconds
function playVideoWithSound(timeToStart) {
  $('.modal').show()
  videoElement.currentTime = timeToStart;
  playVideo();
}

function init() {
  //document.addEventListener('mousemove', mouseUpdate);
  showVideo();
  btnInfo.on('click', () => playVideoWithSound(0));
  btnClose.on('click', hideVideo);
  menuTitle.on('click', showContentInfo);
  btnActiveSound.on('click', playVideo);
  btnCloseMenu.on('click', showContentInfo);
}
