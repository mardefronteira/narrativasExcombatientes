function openGuide(guideId) {
  Array.from(document.querySelectorAll("audio")).map((audio) =>
    audio.id !== this.audioId ? audio.pause() : ``
  );

  // get audio element
  if (soundIsOn) {
    let audioElement = document.querySelector("#guide-audio");
    audioElement.currentTime = 0;
    audioElement.play();
  }

  // create guide
  if (!document.querySelector("#guide-content-div")) {
    let content = document.createElement("DIV");
    content.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    content.id = "guide-content-div";
    content.innerHTML = "";
    document.querySelector("#guide-content").appendChild(content);
  }

  // show guide modal
  document.querySelector("#guide-modal").classList.remove("modal-hidden");

  showGuideContent(guideId);
}

function suggestGuide(guideId) {
  // activate this tab
  d3.select(`#${guideId}`).classed("guide-tab-suggested", true);
}

function showGuideContent(guideId) {
  // get content variable
  let jsId = eval(guideId.replace("-", ""));

  // deselect all tabs
  d3.selectAll(".guide-tab-active").classed("guide-tab-active", false);
  d3.selectAll(".guide-tab-suggested").classed("guide-tab-suggested", false);

  // switch content
  const guide = document.getElementById("guide-content-div");
  guide.innerHTML = jsId;
  guide.scrollTo(0, 0);

  // activate this tab
  d3.select(`#${guideId}`).classed("guide-tab-active", true);
}

function closeGuide() {
  Array.from(document.querySelectorAll("audio")).map((audio) => audio.pause());
  document.querySelector("#guide-modal").classList.add("modal-hidden");
}
