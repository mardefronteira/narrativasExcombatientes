let scenePlayer =  `
<rect id="player-background" x="680.3453" y="0.3461" style="fill:#252526;opacity:0.09;" width="491.9806" height="1090"/>
<g id="scene-player">
   <text transform="matrix(1 0 0 1 739.6605 380.1401)">
     <tspan id="scene-name" x="0" y="0" style="fill:#252526; font-family:"Heebo-Bold"; font-size:16px; letter-spacing:1;">Scene name</tspan>
     <tspan id="scene-character" x="0" y="40" style="fill:#252526; font-family:"Heebo-Bold"; font-size:15px; letter-spacing:1;"></tspan>
     <tspan id="scene-group" x="0" y="60" style="fill:#252526; font-family:"Heebo-Bold"; font-size:15px; letter-spacing:1;"></tspan>
   </text>
   <line id="scene-marker" style="fill:transparent;stroke:#252526;stroke-width:1.9269;stroke-linecap:round;stroke-miterlimit:10;" x1="742.8922" y1="467.2717" x2="742.8922" y2="488.3679"/>
   <polygon id="scene-button" style="fill:transparent;stroke:#252526;stroke-width:1.9269;stroke-miterlimit:10;" points="714.9749,488.2114 714.9749,468.9623 714.998,468.7446 715.0382,468.5791 715.1232,468.4002 715.2305,468.2303 715.3557,468.0872 715.4944,467.9843 715.6732,467.877 715.8387,467.8189 716.0131,467.7786 716.2367,467.7786 716.42,467.8099 716.6213,467.8681 716.8225,467.9709 716.8871,468.0029 729.614,477.6364 729.7016,477.7107 729.8089,477.8315 729.8715,477.903 729.9252,477.9835 729.9609,478.0551 729.9968,478.14 730.028,478.2339 730.0593,478.3368 730.0772,478.4441 730.0906,478.5515 730.0817,478.6811 730.0638,478.8198 730.0236,478.9629 729.9699,479.0881 729.9207,479.2043 729.8626,479.2893 729.7687,479.4011 729.6703,479.4861 729.614,479.5359 716.8871,489.1415 716.7554,489.2303 716.6347,489.2929 716.4961,489.3511 716.3574,489.3779 716.2099,489.4003 716.0087,489.3958 715.7895,489.3421 715.5704,489.2482 715.387,489.1141 715.2574,488.9844 715.1545,488.8458 715.074,488.6892 715.0159,488.5506 714.9756,488.3762 "/>
   <line id="scene-timebar" style="fill:transparent;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="477.0568" x2="742.8922" y2="477.0568"/>
   <line id="scene-timeline" style="opacity:0.24;fill:transparent;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="477.0568" x2="1071.8921" y2="477.0568"/>
   <text id="scene-time" transform="matrix(1 0 0 1 1079.6604 480.5091)" style="fill:#252526; font-family:"Heebo-Medium"; font-size:11px;">– 00:00:00</text>
 </g>
 <g id="character-player" class="hidden">
   <text transform="matrix(1 0 0 1 739.5695 559.1689)">
     <tspan id="character-character" x="0" y="0" style="fill:#252526; font-family:"Heebo-Bold"; font-size:16px; letter-spacing:1;"></tspan>
     <tspan id="character-group" x="0" y="20" style="fill:#252526; font-family:"Heebo-Medium"; font-size:16px; letter-spacing:1;">Character group</tspan>
   </text>
   <line id="character-timeline" style="opacity:0.24;fill:transparent;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="615.0568" x2="1071.8921" y2="615.0568"/>
   <line id="character-marker" style="fill:transparent;stroke:#252526;stroke-width:1.9269;stroke-linecap:round;stroke-miterlimit:10;" x1="742.8922" y1="604.8223" x2="742.8922" y2="625.9185"/>
   <text id="character-time" transform="matrix(1 0 0 1 1079.6604 617.5091)" style="fill:#252526; font-family:"Heebo-Medium"; font-size:11px;">– 00:00:00</text>
   <polygon id="character-button" style="fill:transparent;stroke:#252526;stroke-width:1.9269;stroke-miterlimit:10;" points="714.9749,625.0515 714.9749,605.8024 714.998,605.5847 715.0382,605.4192 715.1232,605.2404 715.2305,605.0704 715.3557,604.9273 715.4944,604.8245 715.6732,604.7171 715.8387,604.659 716.0131,604.6188 716.2367,604.6188 716.42,604.65 716.6213,604.7082 716.8225,604.811 716.8871,604.843 729.614,614.4765 729.7016,614.5508 729.8089,614.6716 729.8715,614.7431 729.9252,614.8236 729.9609,614.8951 729.9968,614.9802 730.028,615.074 730.0593,615.1769 730.0772,615.2842 730.0906,615.3915 730.0817,615.5212 730.0638,615.6599 730.0236,615.803 729.9699,615.9282 729.9207,616.0444 729.8626,616.1294 729.7687,616.2412 729.6703,616.3262 729.614,616.376 716.8871,625.9817 716.7554,626.0704 716.6347,626.1331 716.4961,626.1912 716.3574,626.218 716.2099,626.2404 716.0087,626.2359 715.7895,626.1823 715.5704,626.0883 715.387,625.9542 715.2574,625.8245 715.1545,625.6859 715.074,625.5294 715.0159,625.3907 714.9756,625.2163 "/>
   <line id="character-timebar" style="fill:transparent;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="615.0568" x2="742.8922" y2="615.0568"/>
 </g>
 `

 groupPlayer = `
  <rect id="player-background" x="589.3453" y="0.3461" style="fill:#252526; opacity:0.09;" width="491.9806" height="1090"/>
  <foreignObject transform="matrix(1 0 0 1 633.8849 126.5473)" x="0" y="0" width="420" height="280">
    <div xmlns="http://www.w3.org/1999/xhtml">
    <p id="group-name">EJÉRCITO POPULAR DE LIBERACIÓN</p>
    <p id="group-description">Texto teste, texto teste, texto teste. Texto teste, texto teste, texto teste. Texto teste, texto teste, texto teste. Texto teste, texto teste, texto teste. Texto teste, texto teste, texto teste. Texto teste, texto teste, texto teste. Texto teste, texto teste, texto teste. Texto teste, texto teste, texto teste.</p>
    </div>
  </foreignObject>
  <g class="hidden character-player" id="character-player-0">
    <text id="character-name-0" transform="matrix(1 0 0 1 649.5695 473.1689)" style="fill:#252526; font-family:'Heebo-Bold'; font-size:16px; letter-spacing:1;">Francisco Caraballo</text>
    <text id="character-time-0" transform="matrix(1 0 0 1 986.4347 512.2863)" style="fill:#252526; font-family:'Heebo-Medium'; font-size:11px;">– 00:00:00</text>
    <line id="character-timeline-0" style="opacity:0.24;fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="509.834" x2="978.6664" y2="509.834"/>
    <line id="character-marker-0" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-linecap:round;stroke-miterlimit:10;" x1="649.6664" y1="499.5995" x2="649.6664" y2="520.6957"/>
    <polygon id="character-button-0" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-miterlimit:10;" points="621.7491,519.8287 621.7491,500.5796   621.7722,500.3619 621.8124,500.1964 621.8974,500.0175 622.0048,499.8476 622.1299,499.7045 622.2686,499.6017 622.4474,499.4943   622.6129,499.4362 622.7873,499.396 623.0109,499.396 623.1943,499.4272 623.3955,499.4854 623.5967,499.5883 623.6614,499.6202   636.3882,509.2537 636.4758,509.328 636.5831,509.4488 636.6458,509.5203 636.6994,509.6008 636.7352,509.6724 636.7709,509.7574   636.8022,509.8513 636.8336,509.9541 636.8514,510.0614 636.8649,510.1688 636.8559,510.2984 636.838,510.4371 636.7978,510.5802   636.7441,510.7054 636.6949,510.8217 636.6368,510.9066 636.5429,511.0184 636.4445,511.1034 636.3882,511.1532 623.6614,520.7589   623.5297,520.8477 623.4089,520.9103 623.2703,520.9684 623.1317,520.9952 622.9841,521.0176 622.7828,521.0131 622.5637,520.9595   622.3446,520.8655 622.1613,520.7314 622.0316,520.6017 621.9287,520.4631 621.8482,520.3066 621.7901,520.1679 621.7498,519.9935   "/>
    <line id="character-timebar-0" style="fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="509.834" x2="649.6664" y2="509.834"/>
  </g>
  <g class="hidden character-player" id="character-player-1">
  <text id="character-name-1" transform="matrix(1 0 0 1 649.5695 625.9296)" style="fill:#252526; font-family:'Heebo-Bold'; font-size:16px; letter-spacing:1;">Ildefonso Henao Salazar</text>
    <text id="character-time-1" transform="matrix(1 0 0 1 986.4347 662.8104)" style="fill:#252526; font-family:'Heebo-Medium'; font-size:11px;">– 00:00:00</text>
    <line id="character-timeline-1" style="opacity:0.24;fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="660.3581" x2="978.6664" y2="660.3581"/>
    <line id="character-marker-1" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-linecap:round;stroke-miterlimit:10;" x1="649.6664" y1="650.1237" x2="649.6664" y2="671.2198"/>
    <polygon id="character-button-1" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-miterlimit:10;" points="621.7491,670.3528 621.7491,651.1037   621.7722,650.886 621.8124,650.7205 621.8974,650.5417 622.0048,650.3717 622.1299,650.2286 622.2686,650.1258 622.4474,650.0184   622.6129,649.9603 622.7873,649.92 623.0109,649.92 623.1943,649.9514 623.3955,650.0095 623.5967,650.1124 623.6614,650.1443   636.3882,659.7778 636.4758,659.8522 636.5831,659.9729 636.6458,660.0444 636.6994,660.1249 636.7352,660.1965 636.7709,660.2814   636.8022,660.3754 636.8336,660.4782 636.8514,660.5856 636.8649,660.6929 636.8559,660.8226 636.838,660.9612 636.7978,661.1043   636.7441,661.2295 636.6949,661.3458 636.6368,661.4307 636.5429,661.5425 636.4445,661.6275 636.3882,661.6774 623.6614,671.283   623.5297,671.3718 623.4089,671.4344 623.2703,671.4925 623.1317,671.5193 622.9841,671.5417 622.7828,671.5372 622.5637,671.4836   622.3446,671.3896 622.1613,671.2555 622.0316,671.1258 621.9287,670.9872 621.8482,670.8307 621.7901,670.692 621.7498,670.5176   "/>
    <line id="character-timebar-1" style="fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="660.3581" x2="649.6664" y2="660.3581"/>
  </g>
  <g class="hidden character-player" id="character-player-2">
    <text id="character-name-2" transform="matrix(1 0 0 1 649.5695 776.2427)" style="fill:#252526; font-family:'Heebo-Bold'; font-size:16px; letter-spacing:1;">Raquel Vergara Álvarez   </text>
    <text id="character-time-2" transform="matrix(1 0 0 1 986.4347 816.8762)" style="fill:#252526; font-family:'Heebo-Medium'; font-size:11px;">– 00:00:00</text>
    <line id="character-timeline-2" style="opacity:0.24;fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="814.4239" x2="978.6664" y2="814.4239"/>
    <line id="character-marker-2" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-linecap:round;stroke-miterlimit:10;" x1="649.6664" y1="804.1895" x2="649.6664" y2="825.2856"/>
    <polygon id="character-button-2" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-miterlimit:10;" points="621.7491,824.4186 621.7491,805.1696   621.7722,804.9518 621.8124,804.7864 621.8974,804.6075 622.0048,804.4376 622.1299,804.2944 622.2686,804.1916 622.4474,804.0843   622.6129,804.0261 622.7873,803.9859 623.0109,803.9859 623.1943,804.0172 623.3955,804.0753 623.5967,804.1782 623.6614,804.2101   636.3882,813.8436 636.4758,813.918 636.5831,814.0387 636.6458,814.1103 636.6994,814.1907 636.7352,814.2623 636.7709,814.3473   636.8022,814.4412 636.8336,814.5441 636.8514,814.6514 636.8649,814.7587 636.8559,814.8884 636.838,815.027 636.7978,815.1701   636.7441,815.2953 636.6949,815.4116 636.6368,815.4966 636.5429,815.6083 636.4445,815.6933 636.3882,815.7432 623.6614,825.3488   623.5297,825.4376 623.4089,825.5002 623.2703,825.5583 623.1317,825.5851 622.9841,825.6075 622.7828,825.603 622.5637,825.5494   622.3446,825.4554 622.1613,825.3213 622.0316,825.1917 621.9287,825.053 621.8482,824.8965 621.7901,824.7579 621.7498,824.5834   "/>
    <line id="character-timebar-2" style="fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="814.4239" x2="649.6664" y2="814.4239"/>
  </g>
  <g class="hidden character-player" id="character-player-3">
    <text id="character-name-3" transform="matrix(1 0 0 1 649.5695 929.0034)" style="fill:#252526; font-family:'Heebo-Bold'; font-size:16px; letter-spacing:1;">Álvaro Villarraga Sarmiento </text>
    <text id="character-time-3" transform="matrix(1 0 0 1 986.4347 967.0856)" style="fill:#252526; font-family:'Heebo-Medium'; font-size:11px;">– 00:00:00</text>
    <line id="character-timeline-3" style="opacity:0.24;fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="964.6333" x2="978.6664" y2="964.6333"/>
    <line id="character-marker-3" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-linecap:round;stroke-miterlimit:10;" x1="649.6664" y1="954.3989" x2="649.6664" y2="975.4951"/>
    <polygon id="character-button-3" style="fill:transparent;stroke:#252526;stroke-width:2.7;stroke-miterlimit:10;" points="621.7491,974.6281 621.7491,955.379   621.7722,955.1613 621.8124,954.9958 621.8974,954.8169 622.0048,954.647 622.1299,954.5039 622.2686,954.401 622.4474,954.2937   622.6129,954.2355 622.7873,954.1953 623.0109,954.1953 623.1943,954.2266 623.3955,954.2847 623.5967,954.3876 623.6614,954.4196   636.3882,964.0531 636.4758,964.1274 636.5831,964.2482 636.6458,964.3197 636.6994,964.4002 636.7352,964.4717 636.7709,964.5567   636.8022,964.6506 636.8336,964.7535 636.8514,964.8608 636.8649,964.9681 636.8559,965.0978 636.838,965.2365 636.7978,965.3795   636.7441,965.5048 636.6949,965.621 636.6368,965.706 636.5429,965.8178 636.4445,965.9028 636.3882,965.9526 623.6614,975.5582   623.5297,975.647 623.4089,975.7096 623.2703,975.7678 623.1317,975.7946 622.9841,975.817 622.7828,975.8125 622.5637,975.7588   622.3446,975.6649 622.1613,975.5308 622.0316,975.4011 621.9287,975.2625 621.8482,975.1059 621.7901,974.9673 621.7498,974.7929   "/>
    <line id="character-timebar-3" style="fill:transparent;stroke:#252526;stroke-width:3;stroke-miterlimit:10;" x1="649.6664" y1="964.6333" x2="649.6664" y2="964.6333"/>
  </g>
 `
//style="fill:#0D0D0D; font-family:'Heebo-Bold'; font-size:17px;"
