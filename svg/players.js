let scenePlayer =  `
<rect id="player-background" x="680.3453" y="0.3461" style="fill:#252526;opacity:0.09;" width="491.9806" height="1090"/>
<g id="scene-player">
   <text transform="matrix(1 0 0 1 739.6605 380.1401)">
     <tspan id="scene-name" x="0" y="0" style="fill:#252526; font-family:"Heebo-Bold"; font-size:16px; letter-spacing:1;">Scene name</tspan>
     <tspan id="scene-character" x="0" y="40" style="fill:#252526; font-family:"Heebo-Bold"; font-size:15px; letter-spacing:1;"></tspan>
     <tspan id="scene-group" x="0" y="60" style="fill:#252526; font-family:"Heebo-Bold"; font-size:15px; letter-spacing:1;"></tspan>
   </text>
   <line id="scene-marker" style="fill:none;stroke:#252526;stroke-width:1.9269;stroke-linecap:round;stroke-miterlimit:10;" x1="742.8922" y1="467.2717" x2="742.8922" y2="488.3679"/>
   <polygon id="scene-button" style="fill:transparent;stroke:#252526;stroke-width:1.9269;stroke-miterlimit:10;" points="714.9749,488.2114 714.9749,468.9623 714.998,468.7446 715.0382,468.5791 715.1232,468.4002 715.2305,468.2303 715.3557,468.0872 715.4944,467.9843 715.6732,467.877 715.8387,467.8189 716.0131,467.7786 716.2367,467.7786 716.42,467.8099 716.6213,467.8681 716.8225,467.9709 716.8871,468.0029 729.614,477.6364 729.7016,477.7107 729.8089,477.8315 729.8715,477.903 729.9252,477.9835 729.9609,478.0551 729.9968,478.14 730.028,478.2339 730.0593,478.3368 730.0772,478.4441 730.0906,478.5515 730.0817,478.6811 730.0638,478.8198 730.0236,478.9629 729.9699,479.0881 729.9207,479.2043 729.8626,479.2893 729.7687,479.4011 729.6703,479.4861 729.614,479.5359 716.8871,489.1415 716.7554,489.2303 716.6347,489.2929 716.4961,489.3511 716.3574,489.3779 716.2099,489.4003 716.0087,489.3958 715.7895,489.3421 715.5704,489.2482 715.387,489.1141 715.2574,488.9844 715.1545,488.8458 715.074,488.6892 715.0159,488.5506 714.9756,488.3762 "/>
   <line id="scene-timebar" style="fill:none;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="477.0568" x2="742.8922" y2="477.0568"/>
   <line id="scene-timeline" style="opacity:0.24;fill:none;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="477.0568" x2="1071.8921" y2="477.0568"/>
   <text id="scene-time" transform="matrix(1 0 0 1 1079.6604 480.5091)" style="fill:#252526; font-family:"Heebo-Medium"; font-size:11px;">– 00:00:00</text>
 </g>
 <g id="character-player" class="hidden">
   <text transform="matrix(1 0 0 1 739.5695 559.1689)">
     <tspan id="character-character" x="0" y="0" style="fill:#252526; font-family:"Heebo-Bold"; font-size:16px; letter-spacing:1;"></tspan>
     <tspan id="character-group" x="0" y="20" style="fill:#252526; font-family:"Heebo-Medium"; font-size:16px; letter-spacing:1;">Character group</tspan>
   </text>
   <line id="character-timeline" style="opacity:0.24;fill:none;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="615.0568" x2="1071.8921" y2="615.0568"/>
   <line id="character-marker" style="fill:none;stroke:#252526;stroke-width:1.9269;stroke-linecap:round;stroke-miterlimit:10;" x1="742.8922" y1="604.8223" x2="742.8922" y2="625.9185"/>
   <text id="character-time" transform="matrix(1 0 0 1 1079.6604 617.5091)" style="fill:#252526; font-family:"Heebo-Medium"; font-size:11px;">– 00:00:00</text>
   <polygon id="character-button" style="fill:transparent;stroke:#252526;stroke-width:1.9269;stroke-miterlimit:10;" points="714.9749,625.0515 714.9749,605.8024 714.998,605.5847 715.0382,605.4192 715.1232,605.2404 715.2305,605.0704 715.3557,604.9273 715.4944,604.8245 715.6732,604.7171 715.8387,604.659 716.0131,604.6188 716.2367,604.6188 716.42,604.65 716.6213,604.7082 716.8225,604.811 716.8871,604.843 729.614,614.4765 729.7016,614.5508 729.8089,614.6716 729.8715,614.7431 729.9252,614.8236 729.9609,614.8951 729.9968,614.9802 730.028,615.074 730.0593,615.1769 730.0772,615.2842 730.0906,615.3915 730.0817,615.5212 730.0638,615.6599 730.0236,615.803 729.9699,615.9282 729.9207,616.0444 729.8626,616.1294 729.7687,616.2412 729.6703,616.3262 729.614,616.376 716.8871,625.9817 716.7554,626.0704 716.6347,626.1331 716.4961,626.1912 716.3574,626.218 716.2099,626.2404 716.0087,626.2359 715.7895,626.1823 715.5704,626.0883 715.387,625.9542 715.2574,625.8245 715.1545,625.6859 715.074,625.5294 715.0159,625.3907 714.9756,625.2163 "/>
   <line id="character-timebar" style="fill:none;stroke:#252526;stroke-width:2.141;stroke-miterlimit:10;" x1="742.8922" y1="615.0568" x2="742.8922" y2="615.0568"/>
 </g>
 `

 groupPlayer = `

 `
