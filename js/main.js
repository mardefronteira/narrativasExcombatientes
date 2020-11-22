var i = 0;
var data = {};
var lastClick = {
  type: 'restart',
  id: ''
};
var somethingIsActive;

let mouseIsPressed;
document.body.addEventListener('mousedown', () => { mouseIsPressed = true });
document.body.addEventListener('mouseup', () => { mouseIsPressed = false });

d3.csv( './data/scenes.csv' ).then( d => {
  d = d.map( i => {
    if ( i[ 'related' ].includes( ',' ) ) {
      i[ 'related' ] = i[ 'related' ].split( ',' );
    } else {
      if ( i[ 'related' ] !== '' ) {
        i[ 'related' ] = [ i[ 'related' ] ];
      } else {
        i[ 'related' ] = [];
      }
    }

    // i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );

    return i
  } );
  data[ 'scenes' ] = d
} );

d3.csv( './data/groups.csv' ).then( d => {
  // d = d.map( i => {
  //   // i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
  //   return i
  // } );
  data[ 'groups' ] = d
} );

d3.csv( './data/subgroups.csv' ).then( d => {
  // d = d.map( i => {
  //   i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
  //   return i
  // } );
  data[ 'subgroups' ] = d
} );

d3.csv( './data/characters.csv' ).then( d => {
  // d = d.map( i => {
  //   i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
  //   return i
  // } );
  data[ 'characters' ] = d
} );

d3.csv( './data/relationships.csv' ).then( d => data[ 'relationships' ] = d );

d3.csv( './data/frames.csv' ).then( d => data[ 'frames' ] = d );

d3.csv( './data/audio-scenes.csv' ).then( d => {
  data[ 'audios' ] = d.map( a => {
    a[ 'start_sec' ] = getTimeInSeconds( a[ 'start' ].split( ':' ).map( t => +t ) );
    a[ 'end_sec' ] = getTimeInSeconds( a[ 'end' ].split( ':' ).map( t => +t ) );
    return a
  } );
} );

d3.select( '#background' )
  .on( 'click', function() {
    restart();
    lastClick = {
      id: null,
      type: 'restart',
    }
    somethingIsActive = false;
    console.log("background click")
  } );

/* Scene interactions */
let click = {
  element: null,
  id: null,
  type: null,
}

function getClickedElement( element ){
  click.element = element;
  click.id = element.attr('id').slice(0,4);

  if ( element.classed( 'scene' ) ) {
    click.type = 'scene';
  } else if ( element.classed( 'group' ) ) {
    click.type = 'group';
  } else if ( element.classed( 'subgroup' ) ) {
    click.type = 'subgroup';
  } else if ( element.classed( 'character' ) ) {
    click.type = 'character';
  } else if ( element.classed( 'frame' ) ) {
    click.type = 'frame';
  }
}

function updateLastClick() {
  lastClick = {
    type: click.type,
    id: click.id,
  }
}

d3.selectAll( '.scene,.group,.subgroup,.character,.frame' )
  .on( 'click', function() {
    // get element
    getClickedElement(d3.select( this ))

    console.log(`last click: ${lastClick.type}(${lastClick.id}), current click: ${click.type}(${click.id})`)

    switch (lastClick.type) {

      case 'restart':
        restart();
        show_elements();
        updateLastClick();
        break;

      case 'scene':
        if (click.type === 'character'){
          player.displayCharacter(click.id);
        } else {
          restart();
          show_elements();
          updateLastClick();
        }
        break;

      case 'group':
        if (click.type === 'character'){
          player.displayCharacter(click.id);
        }
        break;

      case 'subgroup':
        if (click.type === 'group'){
          restart();
          show_elements();
          updateLastClick();
        } else if (click.type === 'character'){
          player.displayCharacter(click.id);
        }
        break;

      case 'character':
        restart();
        show_elements();
        updateLastClick();
        break;

      case 'frame':
        restart();
        show_elements();
        updateLastClick();
    }
    somethingIsActive = true;
    console.log(`is something active? ${somethingIsActive}`);
  } )
  .on( 'mouseover', function() {
    // get hovered element
    getClickedElement(d3.select( this ));

    // node behavior in home page, when nothing is active
    if (!somethingIsActive) {

      // hide all character names
      d3.selectAll( '.character-name' )
        .classed( 'visible-text', false );

      // set all scene nodes to minor
      setAllScenesAs('minor');

      // set all groups to minor
      d3.selectAll('.group')
        .classed( 'active-group', false );

      // set all groups to minor
      d3.selectAll('.subgroup')
        .classed( 'active-group', false );

      // hovered element behavior
      switch (click.type) {

        case 'frame':
          // show tooltip
          d3.select(`#${click.id}-tooltip`)
            .classed( 'visible-tooltip', true );
          // activate frame button
          d3.select( `#${click.id}` )
            .classed( 'selected-menu-icon', true );

          // show scenes, hide links
          showFrame(click.id, false);
          break;

        case 'scene':
          if (!click.element.classed('active')){
              // Show hover node and related scenes
            showSceneAs(click.id, 'hover');
            showRelatedScenes(click.id, 'hover');
          }
          break;

        default:
        ''
      }
    } else {
      switch ( click.type ){

        case 'scene':
          console.log('alo')
          d3.select(`#${click.id}.scene-name`)
          .classed( 'visible-text', true );
          break;

        case 'frame':
          // show tooltip
          d3.select(`#${click.id}-tooltip`)
            .classed( 'visible-tooltip', true );
          // activate frame button
          d3.select( `#${click.id}` )
            .classed( 'selected-menu-icon', true );
          break;

        default:

      }
    }


    if ( ( click.element.classed( 'active' ) === false ) && ( click.element.classed( 'minor' ) === false ) ) {

      // Show the elements
      if ( [ 'scene', 'character' ].includes( click.type ) && lastClick.type === 'restart' ) {
        data[ 'relationships' ]
          .filter( d => d[ click.type ] === click.id )
          .map( r => {
            if ( r[ 'character' ] !== '' ) {
              var character = data[ 'characters' ].filter( c => c[ 'id' ] === r[ 'character' ] )[ 0 ];
              r[ 'group' ] = character[ 'group' ];
              r[ 'subgroup' ] = character[ 'subgroup' ];
            }
            return r;
          } )
          .map( r => {
            // show hover node of scenes related to character
            d3.select( `#${r[ 'scene' ]}-node-hover` )
              .classed( 'hidden', false );

            d3.select( '#' + r[ 'scene' ] + '.scene-link' )
              .classed( 'visible-link', true );

            d3.select( '#' + r[ 'scene' ] + '.scene-name' )
              .classed( 'visible-text', true );

            if ( r[ 'character' ] !== '' ) {
              // this happens whenever a character is hovered or activated by hovering its scenes

              if ( r[ 'subgroup' ] !== '' ) {
                d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                  .classed( 'active-group', true );
              }

              d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'active-group', true );

              d3.select( '#' + r[ 'group' ] + '.group-link' )
                .classed( 'visible-link', true );

              d3.select( '#' + r[ 'group' ] + '-name' )
                .classed( 'visible-text', true );

              d3.select( '#' + r[ 'character' ] + '.character' )
                .classed( 'active', true )
                .classed( 'hidden', false )
                .classed( 'active-character', true );

              d3.select( '#' + r[ 'character' ] + '.character-link' )
                .classed( 'visible-link', true );

              d3.select( `#${r['character']}-name` )
                .classed( 'visible-text', true );

            }

          } );
      } else if( click.type == 'group' ) {
        // this happens when you hover over a group that is not selected or active by scene
        data[ 'characters' ]
          .filter( d => d[ click.type ] === click.id )
          .map( r => {

            d3.select( '#' + r[ 'group' ] + '.group' )
              .classed( 'hover', true )
              .classed( 'active-group', true );

            var group = data[ 'groups' ].filter( g => g[ 'id' ] === click.id )[ 0 ];

              if ( lastClick.type !== 'subgroup' ) {

                d3.select( '#' + r[ 'group' ] + '-name' )
                  .classed( 'visible-text', true );

              }

              d3.select( '#' + r[ 'id' ] + '.character' )
                .classed( 'hover', true )
                .classed( 'active-character', true );;

              d3.select( '#' + r[ 'id' ] + '.character-link' )
                .classed( 'visible-link', true );

                // tarefa 01
              d3.select( `#${r[ 'id' ]}-name` )
                .classed( 'visible-text', true );

          } );


          var group_characters = data[ 'characters' ].filter( c => c[ 'group' ] === click.id ).map( c => c[ 'id' ] );
          d3.selectAll( group_characters.map( c => '#' + c + '.character' ).join( ',' ) )
            .classed( 'hidden', false );

      } else if( click.type == 'subgroup' ) {
        data[ 'characters' ]
          .filter( d => d[ click.type ] === click.id )
          .map( r => {

            d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                .classed( 'active-group', true );

            d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'active-group', true );

            d3.select( '#' + r[ 'subgroup' ] + '-name' )
              .classed( 'visible-text', true );

            d3.select( '#' + r[ 'group' ] + '-name' )
              .classed( 'visible-text', true );

            d3.select( '#' + r[ 'id' ] + '.character' )
              .classed( 'hidden', false )
              .classed( 'active-character', true );


            d3.select( '#' + r[ 'id' ] + '.character-link' )
              .classed( 'visible-link', true );

            d3.select( `#${r[ 'id' ]}-name` )
              .classed( 'visible-text', true );

          } );
      }
    }

  } );


d3.selectAll( '.scene,.group,.subgroup,.character' )
  .on( 'mouseout', function() {

    getClickedElement(d3.select( this ));

    if (!somethingIsActive) {

      restart();

    } else {

      if (click.type === 'subgroup') {
        d3.selectAll('.subgroup-name')
         .classed('visible-text', false);
         if (lastClick.type === 'subgroup' && click.id !== lastClick.id) {
          d3.selectAll(`#${click.id}`)
           .classed('active-group', false);
         }
      }

      if (click.type === 'scene') {
        d3.selectAll('.scene-name')
        .classed('visible-text', false);
      }

    }

    // Show all character names if no characters are active
    let activeTexts = d3.selectAll( '.active-text' )["_groups"][0]; // select all active texts
    let activeOrganizer = d3.selectAll( '.visible-organizer' )["_groups"][0]; // select all active organizers
    if (activeTexts.length === 0 && activeOrganizer.length === 0) {
      d3.selectAll( '.character-name' )
        .classed('visible-text', true);
    } else {
      Array.from(d3.selectAll('.character:not(.active)')._groups[0])
        .map(character => {
          d3.select( character )
            .classed( 'hidden' , true );

          d3.select( `#${character.id}-name` )
            .classed( 'visible-text', false)
            .classed( 'hidden', true );

          d3.select( `#${character.id}`+'.character-link' )
            .classed( 'visible-link', false)
            .classed( 'hidden', true );
        })
    }

  } );

  d3.selectAll('.frame').on( 'mouseout', function() {

    getClickedElement(d3.select( this ));

    // if button wasn't clicked
    if (lastClick.id !== click.id){
      // deactivate frame button
      d3.selectAll( '.frame' )
        .classed( 'selected-menu-icon', false );

      // hide tooltips
      d3.selectAll( '.visible-tooltip' )
        .classed( 'visible-tooltip', false );

      if (!somethingIsActive) {
        restart();
      }
    }
  });

function restart() {

  d3.selectAll( '.hidden' )
    .classed( 'hidden', false );

  // reset scene nodes to initial
  d3.selectAll( '.scene-node' )
    .classed( 'hidden', true );

  d3.selectAll( '.initial-node' )
    .classed( 'hidden', false );

  d3.selectAll('.in-frame')
    .classed( 'in-frame', false );

  // reset all group nodes to minor
  d3.selectAll( '.group,.subgroup' )
    .classed( 'active-group', false )
    .classed( 'minor-group', true );

  // reset all character nodes to minor
  d3.selectAll( '.character' )
    .classed('minor-character', true)
    .classed( 'active-character', false );;

  // hide all links
  d3.selectAll( '.active-link' )
    .classed( 'active-link', false );
  d3.selectAll( '.visible-link' )
    .classed( 'visible-link', false );

  // hide all organizer screens
  d3.selectAll( '.organizer-screen' )
    .classed( 'visible-organizer', false );

  // set all elements as not active
  d3.selectAll( '.active' )
    .classed( 'active', false );

  d3.selectAll( '.active-text' )
    .classed( 'active-text', false );

  // hide all text
  d3.selectAll( '.visible-text' )
    .classed ( 'visible-text', false );

  d3.selectAll( '.minor-text' )
    .classed( 'minor-text', false );

  d3.selectAll( '.minor' )
    .classed( 'minor', false );

  // show all character names
  d3.selectAll( '.character-name' )
    .classed( 'visible-text', true );

  // hide all players
  d3.selectAll('.temp-player' )
    .classed( 'hidden-player', true )
    .classed( 'visible-player', false );

  // deselect frame buttons
  d3.selectAll( '.frame' )
    .classed( 'selected-menu-icon', false );

  // hide tooltip pause buttons
  d3.selectAll( '.tooltip-pause-button')
    .classed( 'hidden', true );

  // hide tooltip
  d3.selectAll( '.tooltip')
    .classed( 'visible-tooltip', false );

    if (player) {
      clearAllPlayers();
    }
}

function clearAllPlayers() {
  player.removeElements();
  player = null;
}

function getTimeInSeconds( formattedTime ) {
  let hoursInSeconds = 0;
  let minutesInSeconds = 0;
  let seconds = 0;
  let fractionOfSecond = 0;

  if (formattedTime.length === 4) {
    // if there are four elements in the time list, calculate hours, minutes, seconds and second fraction
    hoursInSeconds = formattedTime[0] * 60 * 60;
    minutesInSeconds = formattedTime[1] * 60;
    seconds = formattedTime[2];
    fractionOfSecond = formattedTime[3] / 60;
  } else if (formattedTime.length === 2) {
    // if there are only two, set them as minutes and seconds
    minutesInSeconds = formattedTime[0] * 60;
    seconds = formattedTime[1];
  }

  return hoursInSeconds + minutesInSeconds + seconds + fractionOfSecond;
}

function getFormattedTime( timeInSeconds ) {
  let hours, minutes, seconds;

  // calculate time in minutes
  timeInMinutes = timeInSeconds / 60;

  // calculate formatted time
  hours = Math.floor(timeInMinutes / 60);
  minutes = Math.floor(timeInMinutes % 60);
  seconds = Math.floor((timeInMinutes - Math.floor(timeInMinutes)) * 60);

  // add a zero before the value if it's less than 10
  hours < 10 ? hours = `0${hours}` : '';
  minutes < 10 ? minutes = `0${minutes}` : '';
  seconds < 10 ? seconds = `0${seconds}` : '';

  return `${hours}:${minutes}:${seconds}`;
}

function showFrame(frameId, showLinks = true) {

  sceneList = data[ 'frames' ].filter( frame => frame[ 'id' ] === frameId )[ 0 ]['scenes'].split(',');
  sceneList.map(sceneId => {
  data[ 'relationships' ]
    .filter( linked => linked['scene'] === sceneId )
    .map( r => {
      if ( r[ 'character' ] !== '' ) {
        var character = data[ 'characters' ].filter( c => c[ 'id' ] === r[ 'character' ] )[ 0 ];
        r[ 'group' ] = character[ 'group' ];
        r[ 'subgroup' ] = character[ 'subgroup' ];
      }
      return r;
    } )
    .map( r => {

      d3.select( '#' + r[ 'scene' ] + '.scene' )
        .classed( 'hidden', false )
        .classed( 'in-frame', true )

      showSceneAs(r['scene'], 'hover');

      if (showLinks) {
        d3.select( '#' + r[ 'scene' ] + '.scene-link' )
          .classed( 'active-link', true );
      }

      d3.select( '#' + r[ 'scene' ] + '.scene-name' )
        .classed( 'active-text', true );

      if ( r[ 'character' ] !== '' ) {

        if ( r[ 'subgroup' ] !== '' ) {
          d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
            .classed( 'hidden', false )
            .classed('active-group', true)
            .classed( 'visited', true );


          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed('active-group', true)

            .classed( 'visited', true );
        } else {
          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed('active-group', true)
            .classed( 'visited', true );

        }
        if (showLinks) {
          d3.select( '#' + r[ 'group' ] + '.group-link' )
            .classed( 'active-link', true );
        }

        d3.select( '#' + r[ 'group' ] + '-name' )
          .classed( 'active-text', true );

        d3.select( '#' + r[ 'character' ] + '.character' )
          .classed( 'hidden', false )
          .classed( 'visited', true )
          .classed( 'active', true );

        if (showLinks) {
          d3.select( '#' + r[ 'character' ] + '.character-link' )
            .classed( 'active-link', true );
        }

        d3.select( `#${r['character']}-name` )
          .classed( 'active-text', true );
      }

    } );
    });
}

let player;
function addPlayer(id, type) {
  switch (type){
    case 'scene':
      player = new ScenePlayer (id, type);
      player.display();
      break;
    case 'group':
      player = new GroupPlayer(id);
      player.display();
      break;
    case 'subgroup':
      player = new GroupPlayer(id);
      player.display();
      break;
    case 'character':
      player = new CharacterPlayer(id);
      player.display();
      break;
    case 'frame':
      player = new TooltipPlayer(id);
      player.display();
      break;
  }
  // console.log(players);
}

function loaded() {
  // create scene nodes dinamically
  let scenes = document.querySelectorAll('.scene');
  let nodeTypes = ['minor','initial','hover'];

  // for every scene, get its jsId
  for (let scene of scenes) {
    let jsId = scene.id.slice(0,4).replace('-','');

    // for every node type, create a g element and assign it the node SVG
    for (let i = 0; i < nodeTypes.length; i++) {

      let thisNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      thisNode.id = `${scene.id}-${nodeTypes[i]}`;
      thisNode.classList.add('scene-node');
      thisNode.classList.add(`${scene.id.slice(0,4)}-node`);
      thisNode.classList.add(`${nodeTypes[i]}-node`);
      thisNode.innerHTML = eval(`${jsId}.${nodeTypes[i]}Node`);

      scene.appendChild(thisNode);
    }
  }

  restart ();
}

function resetScenes() {
  setAllScenesAs('initial');

  d3.selectAll( '.scene-name' )
    .classed( 'active-text', false );

  d3.selectAll( '.character' )
    .classed( 'active-character', false );
}

function clearNodes() {
  d3.selectAll( '.character-name' )
    .classed ( 'visible-text', false );

  d3.selectAll('.node')
    .classed( 'hidden', true );

  d3.selectAll('.scene')
    .classed('hidden', false)

  d3.selectAll( '.scene-node' )
    .classed( 'hidden', true );

  d3.selectAll( '.link' )
    .classed( 'visible-link', false );
}

function show_elements() {

  clearNodes();

    // Show elements
    switch (click.type) {
      case 'scene':

        // activate link of clicked scene
        d3.select( '#' + click.id + '.scene-link' )
            .classed( 'active-link', true );

        showRelatedScenes( click.id, 'minor' );

        // show hover node
        d3.select(`#${click.id}-node-hover`)
          .classed( 'hidden' , false );

        // get related characters
        data[ 'relationships' ]
          .filter( d => d[ click.type ] === click.id )
          .map( r => {
            if ( r[ 'character' ] !== '' ) {
              var character = data[ 'characters' ].filter( c => c[ 'id' ] === r[ 'character' ] )[ 0 ];
              r[ 'group' ] = character[ 'group' ];
              r[ 'subgroup' ] = character[ 'subgroup' ];
            }
            return r;
          } )
          .map( r => {

            if ( r[ 'character' ] !== '' ) {

              if ( r[ 'subgroup' ] !== '' ) {
                d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                  .classed( 'hidden', false )
                  .classed( 'active-group', true )
                  .classed( 'visited', true );

                d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'hidden', false )
                  .classed( 'active-group', true )
                  .classed( 'visited', true );
              } else {
                d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'hidden', false )
                  .classed( 'active-group', true )
                  .classed( 'visited', true );
              }

              d3.select( '#' + r[ 'group' ] + '.group-link' )
                .classed( 'active-link', true );

              d3.select( '#' + r[ 'group' ] + '-name' )
                .classed( 'active-text', true );

              d3.select( '#' + r[ 'character' ] + '.character' )
                .classed( 'hidden', false )
                .classed( 'visited', true )
                .classed( 'active', true )
                .classed( 'active-character', true );

              d3.select( '#' + r[ 'character' ] + '.character-link' )
                .classed( 'active-link', true );

              d3.select( `#${r['character']}-name` )
                .classed( 'active-text', true );
            }

          } );
        break;

      // show elements of character
      case 'character':

      data[ 'relationships' ]
        .filter( d => d[ click.type ] === click.id )
        .map( r => {
          if ( r[ 'character' ] !== '' ) {
            var character = data[ 'characters' ].filter( c => c[ 'id' ] === r[ 'character' ] )[ 0 ];
            r[ 'group' ] = character[ 'group' ];
            r[ 'subgroup' ] = character[ 'subgroup' ];
          }
          return r;
        } )
        .map( r => {
          d3.select( '#' + r[ 'scene' ] + '-node' )
          .classed( 'hidden', false )
          .classed( 'in-frame', true );

          // show related scene node and link
          showSceneAs(r['scene'], 'initial');

          d3.select( '#' + r[ 'scene' ] + '.scene-link' )
            .classed( 'active-link', true );

          // d3.select( '#' + r[ 'scene' ] + '.scene-name' )
          //   .classed( 'active-text', true );

          if ( r[ 'character' ] !== '' ) {

            if ( r[ 'subgroup' ] !== '' ) {
              d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                .classed( 'hidden', false )
                .classed( 'active-group', true )
                .classed( 'visited', true );


              d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hidden', false )
                .classed( 'active-group', true )
                .classed( 'visited', true );
            } else {
              d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hidden', false )
                .classed( 'active-group', true )
                .classed( 'visited', true );
            }

            d3.select( '#' + r[ 'group' ] + '.group-link' )
              .classed( 'active-link', true );

            d3.select( '#' + r[ 'group' ] + '-name' )
              .classed( 'active-text', true );

            d3.select( '#' + r[ 'character' ] + '.character' )
              .classed( 'hidden', false )
              .classed( 'visited', true )
              .classed( 'active', true );

            d3.select( '#' + r[ 'character' ] + '.character-link' )
              .classed( 'active-link', true );

            d3.select( `#${r['character']}-name` )
              .classed( 'active-text', true );
          }

        } );
        break;

     case 'group':
      d3.selectAll(`#${click.id}.group`)
        .classed( 'active-group', true );

      data[ 'characters' ]
        .filter( d => d[ click.type ] === click.id )
        .map( r => {

          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed( 'visited', true );


          var group = data[ 'groups' ].filter( g => g[ 'id' ] === click.id )[ 0 ];
          if ( group[ 'organizer' ] === 'false' ) {

            d3.select( '#' + r[ 'group' ] + '-name' )
              .classed( 'active-text', true );

            d3.select( '#' + r[ 'id' ] + '.character' )
              .classed( 'hidden', false )
              .classed( 'visited', true )
              .classed( 'active', true )
              .classed( 'active-character', true );

            d3.select( '#' + r[ 'id' ] + '.character-link' )
              .classed( 'active-link', true );

            d3.select( `#${r[ 'id' ]}-name` )
              .classed( 'active-text', true );

          } else {
            d3.select( `#${click.id}-player` )
              .classed( 'visible-organizer', true );
          }

        } );
        break;

    case 'subgroup':
    d3.selectAll( `.subgroup` )
      .classed( 'hidden', false );

    d3.selectAll(`#G-02.group, #${click.id}.subgroup`)
      .classed( 'active-group', true )
      .classed( 'hidden', false )
      .classed( 'visited', true );

    d3.selectAll(`#G-02-name`)
      .classed( 'active-text', true );


      data[ 'characters' ]
        .filter( d => d[ click.type ] === click.id )
        .map( r => {

          // d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
          //   .classed( 'hidden', false )
          //   .classed( 'visited', true );
          //
          // d3.select( '#' + r[ 'group' ] + '.group' )
          //   .classed( 'hidden', false )
          //   .classed( 'visited', true );

          // d3.select( '#' + r[ 'group' ] + '-name' )
          //   .classed( 'active-text', true );
          //
          // d3.select( '#' + r[ 'subgroup' ] + '-name' )
          //   .classed( 'active-text', true );

          d3.select( '#' + r[ 'id' ] + '.character' )
            .classed( 'hidden', false )
            .classed( 'visited', true )
            .classed( 'active', true )
            .classed( 'active-character', true );;

          d3.select( '#' + r[ 'id' ] + '.character-link' )
            .classed( 'active-link', true );

          d3.select( `#${r[ 'id' ]}-name` )
            .classed( 'active-text', true );

        } );
        break;

      case 'frame':
        showFrame(click.id);
        d3.select(`#${click.id}`)
          .classed( 'selected-menu-icon', true );
        d3.select(`#${click.id}-tooltip`)
          .classed( 'visible-tooltip', true );
        break;

      default:
        click.element
          .classed( 'hidden', false )
          .classed( 'visited', true )
          .classed( 'active', true );
    }

  if (click.type !== 'frame' || click.id === 'M-01') {
    // show player
    addPlayer(click.id, click.type);

    // stop home audio
    document.querySelector('#home-audio').pause();
  }
}

function mapValue(baseVal, minInput, maxInput, minOutput, maxOutput) {
  return Math.floor((baseVal - minInput) * (maxOutput - minOutput) / (maxInput - minInput) + minOutput);
}

function constrain(baseVal, min, max) {
  if (baseVal < min){
    return min;
  } else if (baseVal > max){
    return max;
  } else {
    return baseVal;
  }
}

function getGroupName(character){
  let groupName;

  if (character.group !== 'G-02') {
    groupName = data['groups'].filter( group => group['id'] === character.group)[0].group;
  } else {
    let subgroupName;
    subgroupName = data['subgroups'].filter( subgroup => subgroup['id'] === character.subgroup)[0].subgroup;
    groupName = `AUC - ${subgroupName}`
  }

  return groupName;
}

function showRelatedScenes(sceneId, nodeType) {
  // get all related scenes
  let relatedScenes = data[ 'scenes' ].filter( d => d[ 'id' ] === sceneId )[ 0 ][ 'related' ];

  // show related scenes as passed down on fuction arguments
  for (let scene of relatedScenes) {
    showSceneAs(scene, nodeType)
  }
}

function showSceneAs(scene, nodeType) {
  let nodeTypes = ['initial', 'minor', 'hover'];

  d3.select(`#${scene}-node`)
    .classed( 'hidden', false );
    // loop through nodeTypes
    nodeTypes.map( type => {
      // if type matches nodeType, the node is visible. else, it's hidden.
      let hidden = type === nodeType ? false : true;

      d3.selectAll(`#${scene}-node-${type}`)
        .classed( 'hidden', hidden );
    })
}

function setAllScenesAs(nodeType) {
  let nodeTypes = ['initial', 'minor', 'hover'];

  nodeTypes.map( type => {
    // if type matches nodeType, the node is visible. else, it's hidden.
    let hidden = type === nodeType ? false : true;

    d3.selectAll(`.${type}-node`)
      .classed( 'hidden', hidden );
    })
}


function getAllNames() {
  // get scene and character names from csv files
  let characterNames = Array.from(document.querySelectorAll('.character-name'));
  characterNames.map( nameElement => {
    let character = data[ 'characters' ].find(character => character.id === nameElement.id.slice(0,4));
    nameElement.innerHTML = character.character;
  });

  let sceneNames = Array.from(document.querySelectorAll('.scene-name'));
  sceneNames.map( nameElement => {
    let scene = data[ 'scenes' ].find(scene => scene.id === nameElement.id.slice(0,4));
    nameElement.innerHTML = scene.scene;
  });
}
