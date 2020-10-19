var i = 0;
var data = {};
var last_click = undefined,
  panels = [];

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
    a[ 'start_sec' ] = normalize_time( a[ 'start' ].split( ':' ).map( t => +t ) );
    a[ 'end_sec' ] = normalize_time( a[ 'end' ].split( ':' ).map( t => +t ) );
    return a
  } );
} );

d3.select( '#background' )
  .on( 'click', function() {
    restart();
  } );

/* Scene interactions */
d3.selectAll( '.scene,.group,.subgroup,.character,.frame' )
  .on( 'click', function() {

    var elem = d3.select( this );

    // Define the kind of node
    var entity = get_entity( elem );

    console.log( 'last_click: ', last_click );
    console.log( 'entity: ', entity );

    if ( [ 'group', 'subgroup' ].includes( last_click ) ) {

      if ( entity === 'character') {

        // Showing the panel
        // show_panel( elem.attr( 'id' ), entity );

      } else if ( last_click === 'subgroup' && entity === 'group' ) {

        show_elements();

      }

    } else if ( last_click === 'scene' && entity === 'character' ) {

      // Show the panel when the character is activated in a scene
      // show_panel( elem.attr( 'id' ), entity );

      d3.select( `#${elem.attr('id')}-name` )
        .classed( 'transparent', true );

    } else {

      if ( ![ 'group', 'subgroup' ].includes( entity ) || last_click === undefined ) {
        if ( !elem.classed( 'active' ) || ( last_click === 'character' && entity === 'scene' ) )
          show_elements();
      }
    }

    function show_elements() {

      restart();

        d3.selectAll( '.character-name' )
          .classed ( 'visible-text', false );

        d3.selectAll( '.node ' )
          .classed( 'hidden', true );

        // Show the elements
        if(entity === 'scene') {
          data[ 'relationships' ]
            .filter( d => d[ entity ] === elem.attr( 'id' ) )
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
                .classed( 'hidden', false );

              d3.select( '#' + r[ 'scene' ] + '.scene' )
                .classed( 'hidden', true )
                .classed( 'visited', true );

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
        } else if (entity === 'character') {
          data[ 'relationships' ]
            .filter( d => d[ entity ] === elem.attr( 'id' ) )
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
        } else if( entity == 'group' ) {
          data[ 'characters' ]
            .filter( d => d[ entity ] === elem.attr( 'id' ) )
            .map( r => {

              d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hidden', false )
                .classed( 'visited', true );


              var group = data[ 'groups' ].filter( g => g[ 'id' ] === elem.attr( 'id' ) )[ 0 ];
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
            .filter( d => d[ entity ] === elem.attr( 'id' ) )
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


        // Highlight related scenes
        if ( entity === 'scene' ) {

          var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ) )[ 0 ][ 'related' ];
          if ( related_scenes.length > 0 ) {
            d3.selectAll( related_scenes.map( s => '#' + s + '.scene' ).join( ',' ) )
              .classed( 'hidden', false )
              .classed( 'hover', false )
              .classed( 'minor', true );

            d3.selectAll( related_scenes.map( s => '#' + s + '.scene-name' ).join( ',' ) )
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
          // show_panel( elem.attr( 'id' ), entity );

          // Temporary for 19/10 meeting
          addPlayer(elem.attr('id'), entity);

          let thisPlayer = d3.select(`#${elem.attr('id')}-player`);
          if( thisPlayer !== undefined && thisPlayer.classed('organizer-screen') ) {
            thisPlayer
            .classed( 'hidden-player', false )
            .classed( 'visible-player', true );
          }
        }

        last_click = entity;

    }

  } )
  .on( 'mouseover', function() {

    var elem = d3.select( this );

    // Define the kind of node
    var entity = get_entity( elem );


    if (entity !== 'frame'){
      d3.selectAll( '.character-name' )
        .classed( 'visible-text', false );
    } else {
      d3.select(`#${elem.attr( 'id' )}-tooltip`)
        .classed( 'visible-tooltip', true );

      // activate frame button
      d3.select( `#${elem.attr( 'id' )}` )
        .classed( 'selected-menu-icon', true );
    }

    if ( ( elem.classed( 'active' ) === false ) && ( elem.classed( 'minor' ) === false ) ) {

      // Show the elements
      if ( [ 'scene', 'character' ].includes( entity ) ) {
        data[ 'relationships' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
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
              .classed( 'hover', true );

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
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
          .map( r => {

            d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hover', true );

            var group = data[ 'groups' ].filter( g => g[ 'id' ] === elem.attr( 'id' ) )[ 0 ];

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


          var group_characters = data[ 'characters' ].filter( c => c[ 'group' ] === elem.attr( 'id' ) ).map( c => c[ 'id' ] );
          d3.selectAll( group_characters.map( c => '#' + c + '.character' ).join( ',' ) )
            .classed( 'hidden', false );

      } else if( entity == 'subgroup' ) {
        data[ 'characters' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
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
        var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ) )[ 0 ][ 'related' ];
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

    var elem = d3.select( this );

    // Define the kind of node
    var entity = get_entity( elem );

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

    if ( last_click !== undefined ) {
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
  var entity;
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

  last_click = undefined;

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

function normalize_time( array ) {
  let hoursInSeconds = 0;
  let minutesInSeconds = 0;
  let seconds = 0;
  let fractionOfSecond = 0;

  if (array.length === 4) {
    // if there are four elements in the time list, calculate hours, minutes, seconds and second fraction
    hoursInSeconds = array[0] * 60 * 60;
    minutesInSeconds = array[1] * 60;
    seconds = array[2];
    fractionOfSecond = array[3] / 60;
  } else if (array.length === 2) {
    // if there are only two, set them as minutes and seconds
    minutesInSeconds = array[0] * 60;
    seconds = array[1];
  }

  return hoursInSeconds + minutesInSeconds + seconds + fractionOfSecond;
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
