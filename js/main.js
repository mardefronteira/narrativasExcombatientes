var i = 0;
var data = {};
var lastClick = {
  type: 'restart',
  id: ''
};
var somethingIsActive;

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

    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );

    return i
  } );
  data[ 'scenes' ] = d
} );

d3.csv( './data/groups.csv' ).then( d => {
  d = d.map( i => {
    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
    return i
  } );
  data[ 'groups' ] = d
} );

d3.csv( './data/subgroups.csv' ).then( d => {
  d = d.map( i => {
    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
    return i
  } );
  data[ 'subgroups' ] = d
} );

d3.csv( './data/characters.csv' ).then( d => {
  d = d.map( i => {
    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
    return i
  } );
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
    console.log(somethingIsActive)

    switch (lastClick.type) {

      case 'restart':
        restart();
        show_elements();
        updateLastClick();
        break;

      case 'scene':
        if (click.type === 'character'){
          player.displayCharacter(click.id);
        } else{
          restart();
          show_elements();
          updateLastClick();
        }
        break;

      case 'group':
        if (click.type === 'character'){
          restart();
          show_elements();
          updateLastClick();
        }
        break;

      case 'subgroup':
        if (['character','group'].includes(click.type)){
          restart();
          show_elements();
          updateLastClick();
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
  } )
  .on( 'mouseover', function() {

    getClickedElement(d3.select( this ));

    if (click.type !== 'frame'){
      d3.selectAll( '.character-name' )
        .classed( 'visible-text', false );
    } else {
      d3.select(`#${click.id}-tooltip`)
        .classed( 'visible-tooltip', true );

      // activate frame button
      d3.select( `#${click.id}` )
        .classed( 'selected-menu-icon', true );
    }

    if ( ( click.element.classed( 'active' ) === false ) && ( click.element.classed( 'minor' ) === false ) ) {

      if (click.type === 'scene') {

        d3.selectAll(`.${click.id}`)
          .classed( 'hidden', true );
        d3.select(`#${click.id}-hover`)
          .classed('hidden', false);

        if (lastClick.type === 'restart'){
        // Highlight related scenes
        var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === click.id )[ 0 ][ 'related' ];

        // show related scenes as hover
        for (let scene of related_scenes) {

              d3.select(`#${scene}-node`)
                .classed( 'hover', false );

              d3.selectAll(`#${scene}-node-initial`)
                .classed( 'hidden', true );

              d3.selectAll(`#${scene}-node-hover`)
                .classed( 'hidden', false );
            }
          }
        }

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
                  .classed( 'hover', true );
              }

              d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'hover', true );

              d3.select( '#' + r[ 'group' ] + '.group-link' )
                .classed( 'visible-link', true );

              d3.select( '#' + r[ 'group' ] + '.group-name' )
                .classed( 'visible-text', true );

              d3.select( '#' + r[ 'character' ] + '.character' )
                .classed( 'hover', true );

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
                .classed( 'hover', true );

            var group = data[ 'groups' ].filter( g => g[ 'id' ] === click.id )[ 0 ];

              if ( lastClick.type !== 'subgroup' ) {

                d3.select( '#' + r[ 'group' ] + '.group-name' )
                  .classed( 'visible-text', true );

              }

              d3.select( '#' + r[ 'id' ] + '.character' )
                .classed( 'hover', true );

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
                .classed( 'hover', true );

            d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hover', true );

            d3.select( '#' + r[ 'subgroup' ] + '.subgroup-name' )
              .classed( 'visible-text', true );

            d3.select( '#' + r[ 'group' ] + '.group-name' )
              .classed( 'visible-text', true );

            d3.select( '#' + r[ 'id' ] + '.character' )
              .classed( 'hover', true );

            d3.select( '#' + r[ 'id' ] + '.character-link' )
              .classed( 'visible-link', true );

            d3.select( `#${r[ 'id' ]}-name` )
              .classed( 'visible-text', true );

          } );
      } else {
        click.element
          .classed( 'hover', true );
      }

      // Highlight related scenes
      if ( click.type === 'scene' ) {
        var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === click.id )[ 0 ][ 'related' ];
        if ( related_scenes.length > 0 ) {
          d3.selectAll( related_scenes.map( s => '#' + s + '.scene' ).join( ',' ) )
            .classed( 'hover', true );

          d3.selectAll( related_scenes.map( s => '#' + s + '.scene-name' ).join( ',' ) )
            .classed( 'visible-text', true );
        }
      }
    }

  } )
  .on( 'mouseout', function() {

    if (!somethingIsActive) {
      resetScenes();
    }

    getClickedElement(d3.select( this ));

    // Hide all visible elements (no actives)
    d3.selectAll( '.hover' )
      .classed( 'hover', false );

    d3.selectAll( '.visible-text' )
      .classed( 'visible-text', false );

    d3.selectAll( '.visible-link' )
      .classed( 'visible-link', false );

    // hide tooltips
    d3.selectAll( '.visible-tooltip' )
    .classed( 'visible-tooltip', false );

    // deactivate frame button
    d3.selectAll( '.frame' )
      .classed( 'selected-menu-icon', false );

    if ( lastClick.type !== 'restart' ) {
      d3.selectAll( '.character:not(.active)' )
          .classed( 'hidden', true );
    }

    // Show all character names if no characters are active
    let activeTexts = d3.selectAll( '.active-text' )["_groups"][0]; // select all active texts
    let activeOrganizer = d3.selectAll( '.visible-organizer' )["_groups"][0]; // select all active organizers
    if (activeTexts.length === 0 && activeOrganizer.length === 0) {
      d3.selectAll( '.character-name' )
        .classed('visible-text', true);
    }

  } );

function restart() {

  d3.selectAll( '.hidden' )
    .classed( 'hidden', false );

  // reset scene nodes to initial
  d3.selectAll( '.scene-node' )
    .classed( 'hidden', true );
  d3.selectAll( '.initial-node' )
    .classed( 'hidden', false );

  d3.selectAll( '.active-node')
    .classed( 'hidden', true );

  d3.selectAll('.in-frame')
    .classed( 'in-frame', false );

  d3.selectAll( '.active-link' )
    .classed( 'active-link', false );

  d3.selectAll( '.organizer-screen' )
    .classed( 'visible-organizer', false );

  d3.selectAll( '.active' )
    .classed( 'active', false );

  d3.selectAll( '.active-text' )
    .classed( 'active-text', false );

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

function showFrame(sceneId) {
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

      d3.select( `#${r['scene']}-active-node`)
        .classed( 'hidden', true );

      d3.select( '#' + r[ 'scene' ] + '.scene' )
        .classed( 'hidden', false )
        .classed( 'in-frame', true );


      d3.select( '#' + r[ 'scene' ] + '.scene-link' )
        .classed( 'active-link', true );

      d3.select( '#' + r[ 'scene' ] + '.scene-name' )
        .classed( 'active-text', true );

      if ( r[ 'character' ] !== '' ) {

        if ( r[ 'subgroup' ] !== '' ) {
          d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
            .classed( 'hidden', false )
            .classed( 'visited', true );


          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed( 'visited', true );
        } else {
          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed( 'visited', true );

        }

        d3.select( '#' + r[ 'group' ] + '.group-link' )
          .classed( 'active-link', true );

        d3.select( '#' + r[ 'group' ] + '.group-name' )
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
}

let player;
function addPlayer(id, type) {
  switch (type){
    case 'scene':
      player = new ScenePlayer (id, type);
      player.display();
      break;
    case 'group':
      console.log('open group player')
      break;
    case 'subgroup':
      console.log('open subgroup player')
      break;
    case 'character':
      console.log('open character player')
      break;
  }
  // console.log(players);
}

function loaded() {
  // create scene nodes dinamically
  let scenes = document.querySelectorAll('.scene');
  let nodeTypes = ['active','initial','hover'];

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
      thisNode.innerHTML = eval(`${jsId}.${nodeTypes[i]}`);

      scene.appendChild(thisNode);
    }
  }

  restart ();
}

function resetScenes() {
  d3.selectAll('.scene-node')
    .classed('hidden', true);
  d3.selectAll('.initial-node')
    .classed('hidden', false);
}

function show_elements() {

    d3.selectAll( '.character-name' )
      .classed ( 'visible-text', false );

    d3.selectAll('.node')
      .classed( 'hidden', true );

    d3.selectAll('.scene')
      .classed('hidden', false)

    d3.selectAll( '.scene-node' )
      .classed( 'hidden', true );

    // Show the elements
    if(click.type === 'scene') {

      let sceneId = click.id;
      // console.log('sceneId: '+sceneId);

      // why???
      // d3.selectAll( `${sceneId}-node-active` )
      //   .classed( 'hidden', false );

      // activate name and link of clicked scene
      d3.select( '#' + sceneId + '.scene-link' )
          .classed( 'active-link', true );

      d3.select( '#' + sceneId + '.scene-name' )
          .classed( 'active-text', true );

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
                .classed( 'visited', true );

              d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hidden', false )
                .classed( 'visited', true );
            } else {
              d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hidden', false )
                .classed( 'visited', true );
            }

            d3.select( '#' + r[ 'group' ] + '.group-link' )
              .classed( 'active-link', true );

            d3.select( '#' + r[ 'group' ] + '.group-name' )
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
    } else if (click.type === 'character') {
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
          //
          d3.select( `#${r['scene']}-node-initial`)
            .classed( 'hidden', false );

          d3.select( '#' + r[ 'scene' ] + '-node' )
            .classed( 'hidden', false )
            .classed( 'in-frame', true );

          d3.select( '#' + r[ 'scene' ] + '.scene-link' )
            .classed( 'active-link', true );

          d3.select( '#' + r[ 'scene' ] + '.scene-name' )
            .classed( 'active-text', true );

          if ( r[ 'character' ] !== '' ) {

            if ( r[ 'subgroup' ] !== '' ) {
              d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                .classed( 'hidden', false )
                .classed( 'visited', true );


              d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hidden', false )
                .classed( 'visited', true );
            } else {
              d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hidden', false )
                .classed( 'visited', true );
            }

            d3.select( '#' + r[ 'group' ] + '.group-link' )
              .classed( 'active-link', true );

            d3.select( '#' + r[ 'group' ] + '.group-name' )
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
    } else if( click.type == 'group' ) {
      data[ 'characters' ]
        .filter( d => d[ click.type ] === click.id )
        .map( r => {

          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed( 'visited', true );


          var group = data[ 'groups' ].filter( g => g[ 'id' ] === click.id )[ 0 ];
          if ( group[ 'organizer' ] === 'false' ) {

            d3.select( '#' + r[ 'group' ] + '.group-name' )
              .classed( 'active-text', true );

            d3.select( '#' + r[ 'id' ] + '.character' )
              .classed( 'hidden', false )
              .classed( 'visited', true )
              .classed( 'active', true );

            d3.select( '#' + r[ 'id' ] + '.character-link' )
              .classed( 'active-link', true );

            d3.select( `#${r[ 'id' ]}-name` )
              .classed( 'active-text', true );

          } else {
            d3.select( `#${click.id}-player` )
              .classed( 'visible-organizer', true );
          }

        } );
    } else if( click.type == 'subgroup' ) {
      data[ 'characters' ]
        .filter( d => d[ click.type ] === click.id )
        .map( r => {

          d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
            .classed( 'hidden', false )
            .classed( 'visited', true );


          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed( 'visited', true );

          d3.select( '#' + r[ 'group' ] + '.group-name' )
            .classed( 'active-text', true );

          d3.select( '#' + r[ 'subgroup' ] + '.subgroup-name' )
            .classed( 'active-text', true );

          d3.select( '#' + r[ 'id' ] + '.character' )
            .classed( 'hidden', false )
            .classed( 'visited', true )
            .classed( 'active', true );

          d3.select( '#' + r[ 'id' ] + '.character-link' )
            .classed( 'active-link', true );

            // tarefa 01
          d3.select( `#${r[ 'id' ]}-name` )
            .classed( 'active-text', true );

        } );
    } else if (click.type === 'frame') {
        // get scene list in frames.csv
        sceneList = data[ 'frames' ].filter( frame => frame[ 'id' ] === click.id )[ 0 ]['scenes'].split(',');
        sceneList.map(sceneId => { showFrame(sceneId) });
    } else {
      click.element
        .classed( 'hidden', false )
        .classed( 'visited', true )
        .classed( 'active', true );
    }


    // Highlight related scenes >> in show_elements (click)
    if ( click.type === 'scene' ) {

      // switch scene node to active
      // d3.selectAll(`.${click.id}`)
      //   .classed( 'hidden', true );
      d3.selectAll(`#${click.id}-node-active`)
        .classed( 'hidden', false );

      // Highlight related scenes
      var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === click.id )[ 0 ][ 'related' ];
      if ( related_scenes.length > 0 ) {

        // switch related scene node to minor
        for (let sceneId of related_scenes) {

          d3.select(`#${sceneId}-node`)
            .classed( 'hover', false );

          d3.selectAll(`#${sceneId}-node-initial`)
            .classed( 'hidden', true );

          d3.selectAll(`#${sceneId}-node-hover`)
            .classed( 'hidden', false );

          d3.selectAll(`${sceneId}`+'.scene-name')
          .classed( 'hidden', false )
          .classed( 'visible-text', false )
          .classed( 'minor-text', true );
        }

    }

    // Hiding the phantoms
    d3.select( '.phantoms' )
      .style( 'visibility', 'hidden' );


  }
  if (click.type !== 'frame'){
    // show player
    addPlayer(click.id, click.type);
  }
}

function mapValue(baseVal, minInput, maxInput, minOutput, maxOutput) {
  // let mappedVal = constrain(baseVal, minInput, maxInput);
  // console.log(baseVal, minInput, maxInput, minOutput, maxOutput)
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
