
function openGuide() {
  // console.log('abriu!')
  Array.from(document.querySelectorAll('audio')).map(audio => audio.id !==  this.audioId ? audio.pause() : ``);

  // create audio elements
  let audioElement = document.querySelector('#guide-audio');
  audioElement.currentTime = 0;
  audioElement.play();

  let content = document.createElement('DIV');
  content.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  content.id="guide-content-div";
  content.innerHTML = guide1;
  document.querySelector('#guide-content').appendChild(content);
  document.querySelector('#guide-modal').classList.remove('modal-hidden');
}

function closeGuide() {
  Array.from(document.querySelectorAll('audio')).map(audio => audio.pause());
  // document.querySelector('#home-audio').play();
  document.querySelector('#guide-modal').classList.add('modal-hidden');
}
