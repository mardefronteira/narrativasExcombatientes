var i = 0;
var data = {};
var last_click = 'restart',
  panels = [];

var elem = null;
var entity = null;

let somethingIsActive = false;

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
    last_click = 'restart';
    somethingIsActive = false;
  } );

/* Scene interactions */
d3.selectAll( '.scene,.group,.subgroup,.character,.frame' )
  .on( 'click', function() {
    somethingIsActive = true;

    elem = d3.select( this );

    // Define the kind of node
    entity = get_entity( elem );

    restart();

    console.log( 'last_click: ', last_click );
    console.log( 'entity: ', entity );

    if ( [ 'group', 'subgroup' ].includes( last_click ) ) {

      if ( entity === 'character') {

        // Showing the panel
        // show_panel( elem.attr( 'id' ).slice(0,4), entity );

      } else if ( last_click === 'subgroup' && entity === 'group' ) {

        show_elements();

      }

    } else if ( last_click === 'scene' && entity === 'character' ) {

      // Show the panel when the character is activated in a scene
      // show_panel( elem.attr( 'id' ).slice(0,4), entity );

      d3.select( `#${elem.attr('id')}-name` )
        .classed( 'transparent', true );

    } else {

      if ( ![ 'group', 'subgroup' ].includes( entity ) || last_click === 'restart' ) {
        if ( !elem.classed( 'active' ) || ( last_click === 'character' && entity === 'scene' ) )
          show_elements();
      }
    }
  } )
  .on( 'mouseover', function() {

    elem = d3.select( this );

    // Define the kind of node
    entity = get_entity( elem );


    if (entity !== 'frame'){
      d3.selectAll( '.character-name' )
        .classed( 'visible-text', false );
    } else {
      d3.select(`#${elem.attr( 'id' ).slice(0,4)}-tooltip`)
        .classed( 'visible-tooltip', true );

      // activate frame button
      d3.select( `#${elem.attr( 'id' ).slice(0,4)}` )
        .classed( 'selected-menu-icon', true );
    }

    if ( ( elem.classed( 'active' ) === false ) && ( elem.classed( 'minor' ) === false ) ) {

      if (entity === 'scene') {

        d3.selectAll(`.${elem.attr('id')}`)
          .classed( 'hidden', true );
        d3.select(`#${elem.attr('id')}-hover`)
          .classed('hidden', false);

        if (last_click === 'restart'){
        // Highlight related scenes
        var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ).slice(0,4) )[ 0 ][ 'related' ];

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
      if ( [ 'scene', 'character' ].includes( entity ) && last_click === 'restart' ) {
        data[ 'relationships' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ).slice(0,4) )
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
      } else if( entity == 'group' ) {
        // this happens when you hover over a group that is not selected or active by scene
        data[ 'characters' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ).slice(0,4) )
          .map( r => {

            d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hover', true );

            var group = data[ 'groups' ].filter( g => g[ 'id' ] === elem.attr( 'id' ).slice(0,4) )[ 0 ];

              if ( last_click !== 'subgroup' ) {

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


          var group_characters = data[ 'characters' ].filter( c => c[ 'group' ] === elem.attr( 'id' ).slice(0,4) ).map( c => c[ 'id' ] );
          d3.selectAll( group_characters.map( c => '#' + c + '.character' ).join( ',' ) )
            .classed( 'hidden', false );

      } else if( entity == 'subgroup' ) {
        data[ 'characters' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ).slice(0,4) )
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
        elem
          .classed( 'hover', true );
      }

      // Highlight related scenes
      if ( entity === 'scene' ) {
        var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ).slice(0,4) )[ 0 ][ 'related' ];
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

    elem = d3.select( this );

    // Define the kind of node
    entity = get_entity( elem );

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

    if ( last_click !== 'restart' ) {
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

function get_entity( elem ) {
  entity;
  if ( elem.classed( 'scene' ) ) {
    entity = 'scene';
  } else if ( elem.classed( 'group' ) ) {
    entity = 'group';
  } else if ( elem.classed( 'subgroup' ) ) {
    entity = 'subgroup';
  } else if ( elem.classed( 'character' ) ) {
    entity = 'character';
  } else if ( elem.classed( 'frame' ) ) {
    entity = 'frame';
  }
  return entity
}


let characterPlayers = [];
let scenePlayers;

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

  // Close all panels
  clearAllPlayers();

}

function clearAllPlayers() {

  d3.selectAll('.player').remove();
  d3.selectAll('.temp-player').remove();
  characterPlayers = [];
  scenePlayers = null;

//^^^^^ marcela's reestructuring ^^^^^

  d3.selectAll( '.panel:not(.custom)' )
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 )
    .remove();

  d3.selectAll( '.custom' )
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 )
    .style( 'visibility', 'hidden' );

  d3.selectAll( '#custom_1,#custom_2,#custom_3' )
    .style( 'left', '-1000px' );

  d3.selectAll( '.transparent' )
    .classed( 'transparent', false );

  var sounds = document.getElementsByTagName('audio');
  for(i=0; i<sounds.length; i++) sounds[i].pause();

  i = 0;
  panels = []
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

let players = {};
function addPlayer(id, entity) {
  players[id] = new Player (id, entity);
  players[id].display();
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
    if(entity === 'scene') {

      let sceneId = elem.attr('id').slice(0,4);
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
        .filter( d => d[ entity ] === elem.attr( 'id' ).slice(0,4) )
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
    } else if (entity === 'character') {
      data[ 'relationships' ]
        .filter( d => d[ entity ] === elem.attr( 'id' ).slice(0,4) )
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
    } else if( entity == 'group' ) {
      data[ 'characters' ]
        .filter( d => d[ entity ] === elem.attr( 'id' ).slice(0,4) )
        .map( r => {

          d3.select( '#' + r[ 'group' ] + '.group' )
            .classed( 'hidden', false )
            .classed( 'visited', true );


          var group = data[ 'groups' ].filter( g => g[ 'id' ] === elem.attr( 'id' ).slice(0,4) )[ 0 ];
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
            d3.select( `#${elem.attr('id')}-player` )
              .classed( 'visible-organizer', true );
          }

        } );
    } else if( entity == 'subgroup' ) {
      data[ 'characters' ]
        .filter( d => d[ entity ] === elem.attr( 'id' ).slice(0,4) )
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
    } else if (entity === 'frame') {
        // get scene list in frames.csv
        sceneList = data[ 'frames' ].filter( frame => frame[ 'id' ] === elem.attr('id') )[ 0 ]['scenes'].split(',');
        sceneList.map(sceneId => { showFrame(sceneId) });
    } else {
      elem
        .classed( 'hidden', false )
        .classed( 'visited', true )
        .classed( 'active', true );
    }


    // Highlight related scenes >> in show_elements (click)
    if ( entity === 'scene' ) {

      // switch scene node to active
      // d3.selectAll(`.${elem.attr('id')}`)
      //   .classed( 'hidden', true );
      d3.selectAll(`#${elem.attr('id')}-active`)
        .classed( 'hidden', false );

      // Highlight related scenes
      var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ).slice(0,4) )[ 0 ][ 'related' ];
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

    if(entity !== 'frame') {
      // Showing the panel
      // show_panel( elem.attr( 'id' ).slice(0,4), entity );

      // Temporary for 19/10 meeting
      addPlayer(elem.attr('id'), entity);

      let thisPlayer = d3.select(`#${elem.attr('id')}-player`);
      if( thisPlayer !== null && thisPlayer.classed('organizer-screen') ) {
        thisPlayer
        .classed( 'hidden-player', false )
        .classed( 'visible-player', true );
      }
    }
  }
  last_click = entity;
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
