<template>
  <div w-256px h-256px mx-auto bg-gray-400 rounded-md animate-pulse>
    <svg width="256" height="256">
      <defs>
        <clipPath id="clip-path-dot-color">
          <path d="M 12 76v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,16,80)" />
          <rect x="12" y="84" width="8" height="8" transform="rotate(0,16,88)" />
          <path d="M 12 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,16,96)" />
          <path d="M 12 108v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,16,112)" />
          <rect x="12" y="116" width="8" height="8" transform="rotate(0,16,120)" />
          <rect x="12" y="124" width="8" height="8" transform="rotate(0,16,128)" />
          <path d="M 12 132v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,16,136)" />
          <path d="M 12 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,16,152)" />
          <path d="M 12 156v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,16,160)" />
          <path d="M 12 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,16,176)" />
          <path d="M 20 76v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,24,80)" />
          <path d="M 20 92v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,24,96)" />
          <path d="M 20 116v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,24,120)" />
          <path d="M 20 140v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,24,144)" />
          <path d="M 20 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,24,152)" />
          <path d="M 20 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,24,176)" />
          <circle cx="32" cy="112" r="4" transform="rotate(0,32,112)" />
          <path d="M 28 140v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,32,144)" />
          <path d="M 28 156v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,32,160)" />
          <path d="M 28 164v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,32,168)" />
          <path d="M 36 76v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,40,80)" />
          <rect x="36" y="84" width="8" height="8" transform="rotate(0,40,88)" />
          <path d="M 36 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,40,96)" />
          <path d="M 36 124v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,40,128)" />
          <path d="M 36 132v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,40,136)" />
          <circle cx="40" cy="152" r="4" transform="rotate(0,40,152)" />
          <path d="M 44 84v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,48,88)" />
          <path d="M 44 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,48,96)" />
          <circle cx="48" cy="112" r="4" transform="rotate(0,48,112)" />
          <path d="M 44 124v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,48,128)" />
          <path d="M 44 140v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,48,144)" />
          <path d="M 44 164v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,48,168)" />
          <path d="M 44 172v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,48,176)" />
          <circle cx="56" cy="120" r="4" transform="rotate(0,56,120)" />
          <path d="M 52 132v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,56,136)" />
          <rect x="52" y="140" width="8" height="8" transform="rotate(0,56,144)" />
          <rect x="52" y="148" width="8" height="8" transform="rotate(0,56,152)" />
          <rect x="52" y="156" width="8" height="8" transform="rotate(0,56,160)" />
          <rect x="52" y="164" width="8" height="8" transform="rotate(0,56,168)" />
          <rect x="52" y="172" width="8" height="8" transform="rotate(0,56,176)" />
          <path d="M 60 76v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,64,80)" />
          <circle cx="64" cy="96" r="4" transform="rotate(0,64,96)" />
          <circle cx="64" cy="112" r="4" transform="rotate(0,64,112)" />
          <circle cx="64" cy="128" r="4" transform="rotate(0,64,128)" />
          <rect x="60" y="140" width="8" height="8" transform="rotate(0,64,144)" />
          <path d="M 60 156v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,64,160)" />
          <path d="M 60 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,64,176)" />
          <path d="M 68 76v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,72,80)" />
          <path d="M 68 84v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,72,88)" />
          <circle cx="72" cy="104" r="4" transform="rotate(0,72,104)" />
          <path d="M 68 132v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,72,136)" />
          <rect x="68" y="140" width="8" height="8" transform="rotate(0,72,144)" />
          <path d="M 68 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,72,152)" />
          <path d="M 76 12v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,80,16)" />
          <path d="M 76 28v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,80,32)" />
          <path d="M 76 36v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,80,40)" />
          <path d="M 76 52v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,80,56)" />
          <rect x="76" y="60" width="8" height="8" transform="rotate(0,80,64)" />
          <path d="M 76 68v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,80,72)" />
          <path d="M 76 116v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,80,120)" />
          <rect x="76" y="132" width="8" height="8" transform="rotate(0,80,136)" />
          <path d="M 76 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,80,152)" />
          <rect x="76" y="156" width="8" height="8" transform="rotate(0,80,160)" />
          <path d="M 76 164v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,80,168)" />
          <path d="M 76 188v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,80,192)" />
          <path d="M 76 212v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,80,216)" />
          <path d="M 76 228v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,80,232)" />
          <path d="M 76 236v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,80,240)" />
          <rect x="84" y="12" width="8" height="8" transform="rotate(0,88,16)" />
          <circle cx="88" cy="48" r="4" transform="rotate(0,88,48)" />
          <rect x="84" y="68" width="8" height="8" transform="rotate(0,88,72)" />
          <path d="M 84 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,88,96)" />
          <rect x="84" y="100" width="8" height="8" transform="rotate(0,88,104)" />
          <rect x="84" y="108" width="8" height="8" transform="rotate(0,88,112)" />
          <rect x="84" y="116" width="8" height="8" transform="rotate(0,88,120)" />
          <rect x="84" y="124" width="8" height="8" transform="rotate(0,88,128)" />
          <path d="M 84 132v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,88,136)" />
          <rect x="84" y="156" width="8" height="8" transform="rotate(0,88,160)" />
          <rect x="84" y="164" width="8" height="8" transform="rotate(0,88,168)" />
          <path d="M 84 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,88,176)" />
          <path d="M 84 188v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,88,192)" />
          <rect x="84" y="196" width="8" height="8" transform="rotate(0,88,200)" />
          <rect x="84" y="204" width="8" height="8" transform="rotate(0,88,208)" />
          <rect x="84" y="212" width="8" height="8" transform="rotate(0,88,216)" />
          <rect x="84" y="220" width="8" height="8" transform="rotate(0,88,224)" />
          <rect x="84" y="228" width="8" height="8" transform="rotate(0,88,232)" />
          <path d="M 84 236v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,88,240)" />
          <path d="M 92 12v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,96,16)" />
          <rect x="92" y="20" width="8" height="8" transform="rotate(0,96,24)" />
          <path d="M 92 28v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,96,32)" />
          <path d="M 92 52v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,96,56)" />
          <rect x="92" y="60" width="8" height="8" transform="rotate(0,96,64)" />
          <rect x="92" y="68" width="8" height="8" transform="rotate(0,96,72)" />
          <rect x="92" y="76" width="8" height="8" transform="rotate(0,96,80)" />
          <rect x="92" y="84" width="8" height="8" transform="rotate(0,96,88)" />
          <rect x="92" y="92" width="8" height="8" transform="rotate(0,96,96)" />
          <rect x="92" y="100" width="8" height="8" transform="rotate(0,96,104)" />
          <rect x="92" y="108" width="8" height="8" transform="rotate(0,96,112)" />
          <path d="M 92 116v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,96,120)" />
          <path d="M 92 140v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,96,144)" />
          <rect x="92" y="148" width="8" height="8" transform="rotate(0,96,152)" />
          <path d="M 92 156v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,96,160)" />
          <path d="M 92 204v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,96,208)" />
          <path d="M 92 220v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,96,224)" />
          <path d="M 92 228v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,96,232)" />
          <path d="M 100 28v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,104,32)" />
          <rect x="100" y="36" width="8" height="8" transform="rotate(0,104,40)" />
          <path d="M 100 44v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,104,48)" />
          <rect x="100" y="68" width="8" height="8" transform="rotate(0,104,72)" />
          <rect x="100" y="92" width="8" height="8" transform="rotate(0,104,96)" />
          <rect x="100" y="100" width="8" height="8" transform="rotate(0,104,104)" />
          <path d="M 100 140v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,104,144)" />
          <path d="M 100 164v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,104,168)" />
          <path d="M 100 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,104,176)" />
          <circle cx="104" cy="200" r="4" transform="rotate(0,104,200)" />
          <path d="M 100 236v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,104,240)" />
          <path d="M 108 12v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,112,16)" />
          <path d="M 108 20v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,112,24)" />
          <rect x="108" y="44" width="8" height="8" transform="rotate(0,112,48)" />
          <path d="M 108 60v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,112,64)" />
          <rect x="108" y="68" width="8" height="8" transform="rotate(0,112,72)" />
          <rect x="108" y="76" width="8" height="8" transform="rotate(0,112,80)" />
          <rect x="108" y="84" width="8" height="8" transform="rotate(0,112,88)" />
          <rect x="108" y="92" width="8" height="8" transform="rotate(0,112,96)" />
          <rect x="108" y="100" width="8" height="8" transform="rotate(0,112,104)" />
          <path d="M 108 108v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,112,112)" />
          <path d="M 108 124v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,112,128)" />
          <path d="M 108 132v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,112,136)" />
          <path d="M 108 148v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,112,152)" />
          <rect x="108" y="164" width="8" height="8" transform="rotate(0,112,168)" />
          <circle cx="112" cy="224" r="4" transform="rotate(0,112,224)" />
          <rect x="108" y="236" width="8" height="8" transform="rotate(0,112,240)" />
          <path d="M 116 28v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,120,32)" />
          <rect x="116" y="36" width="8" height="8" transform="rotate(0,120,40)" />
          <rect x="116" y="44" width="8" height="8" transform="rotate(0,120,48)" />
          <path d="M 116 52v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,120,56)" />
          <rect x="116" y="76" width="8" height="8" transform="rotate(0,120,80)" />
          <rect x="116" y="84" width="8" height="8" transform="rotate(0,120,88)" />
          <path d="M 116 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,120,96)" />
          <path d="M 116 108v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,120,112)" />
          <path d="M 116 124v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,120,128)" />
          <path d="M 116 140v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,120,144)" />
          <path d="M 116 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,120,152)" />
          <rect x="116" y="164" width="8" height="8" transform="rotate(0,120,168)" />
          <path d="M 116 188v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,120,192)" />
          <circle cx="120" cy="216" r="4" transform="rotate(0,120,216)" />
          <rect x="116" y="236" width="8" height="8" transform="rotate(0,120,240)" />
          <path d="M 124 52v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,128,56)" />
          <path d="M 124 60v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,128,64)" />
          <path d="M 124 76v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,128,80)" />
          <path d="M 124 84v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,128,88)" />
          <circle cx="128" cy="120" r="4" transform="rotate(0,128,120)" />
          <path d="M 124 132v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,128,136)" />
          <rect x="124" y="140" width="8" height="8" transform="rotate(0,128,144)" />
          <path d="M 124 156v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,128,160)" />
          <rect x="124" y="164" width="8" height="8" transform="rotate(0,128,168)" />
          <path d="M 124 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,128,176)" />
          <path d="M 124 188v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,128,192)" />
          <path d="M 124 196v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,128,200)" />
          <path d="M 124 220v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,128,224)" />
          <rect x="124" y="228" width="8" height="8" transform="rotate(0,128,232)" />
          <path d="M 124 236v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,128,240)" />
          <path d="M 132 12v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,136,16)" />
          <path d="M 132 28v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,136,32)" />
          <circle cx="136" cy="72" r="4" transform="rotate(0,136,72)" />
          <path d="M 132 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,136,96)" />
          <rect x="132" y="100" width="8" height="8" transform="rotate(0,136,104)" />
          <path d="M 132 108v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,136,112)" />
          <path d="M 132 124v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,136,128)" />
          <rect x="132" y="140" width="8" height="8" transform="rotate(0,136,144)" />
          <rect x="132" y="196" width="8" height="8" transform="rotate(0,136,200)" />
          <path d="M 132 204v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,136,208)" />
          <path d="M 140 12v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,144,16)" />
          <rect x="140" y="20" width="8" height="8" transform="rotate(0,144,24)" />
          <rect x="140" y="28" width="8" height="8" transform="rotate(0,144,32)" />
          <path d="M 140 36v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,144,40)" />
          <circle cx="144" cy="64" r="4" transform="rotate(0,144,64)" />
          <path d="M 140 76v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,144,80)" />
          <rect x="140" y="84" width="8" height="8" transform="rotate(0,144,88)" />
          <rect x="140" y="92" width="8" height="8" transform="rotate(0,144,96)" />
          <path d="M 140 100v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,144,104)" />
          <rect x="140" y="124" width="8" height="8" transform="rotate(0,144,128)" />
          <rect x="140" y="132" width="8" height="8" transform="rotate(0,144,136)" />
          <rect x="140" y="140" width="8" height="8" transform="rotate(0,144,144)" />
          <path d="M 140 156v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,144,160)" />
          <rect x="140" y="164" width="8" height="8" transform="rotate(0,144,168)" />
          <rect x="140" y="172" width="8" height="8" transform="rotate(0,144,176)" />
          <path d="M 140 180v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,144,184)" />
          <rect x="140" y="196" width="8" height="8" transform="rotate(0,144,200)" />
          <path d="M 140 204v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,144,208)" />
          <circle cx="144" cy="232" r="4" transform="rotate(0,144,232)" />
          <path d="M 148 20v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,152,24)" />
          <rect x="148" y="28" width="8" height="8" transform="rotate(0,152,32)" />
          <path d="M 148 52v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,152,56)" />
          <rect x="148" y="76" width="8" height="8" transform="rotate(0,152,80)" />
          <rect x="148" y="84" width="8" height="8" transform="rotate(0,152,88)" />
          <path d="M 148 108v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,152,112)" />
          <rect x="148" y="124" width="8" height="8" transform="rotate(0,152,128)" />
          <rect x="148" y="140" width="8" height="8" transform="rotate(0,152,144)" />
          <rect x="148" y="148" width="8" height="8" transform="rotate(0,152,152)" />
          <rect x="148" y="156" width="8" height="8" transform="rotate(0,152,160)" />
          <path d="M 148 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,152,176)" />
          <path d="M 148 196v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,152,200)" />
          <circle cx="152" cy="224" r="4" transform="rotate(0,152,224)" />
          <circle cx="160" cy="16" r="4" transform="rotate(0,160,16)" />
          <rect x="156" y="28" width="8" height="8" transform="rotate(0,160,32)" />
          <rect x="156" y="36" width="8" height="8" transform="rotate(0,160,40)" />
          <rect x="156" y="44" width="8" height="8" transform="rotate(0,160,48)" />
          <rect x="156" y="52" width="8" height="8" transform="rotate(0,160,56)" />
          <rect x="156" y="60" width="8" height="8" transform="rotate(0,160,64)" />
          <rect x="156" y="68" width="8" height="8" transform="rotate(0,160,72)" />
          <rect x="156" y="76" width="8" height="8" transform="rotate(0,160,80)" />
          <path d="M 156 84v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,160,88)" />
          <path d="M 156 108v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,160,112)" />
          <rect x="156" y="116" width="8" height="8" transform="rotate(0,160,120)" />
          <rect x="156" y="124" width="8" height="8" transform="rotate(0,160,128)" />
          <rect x="156" y="132" width="8" height="8" transform="rotate(0,160,136)" />
          <path d="M 156 140v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,160,144)" />
          <path d="M 156 156v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,160,160)" />
          <circle cx="160" cy="192" r="4" transform="rotate(0,160,192)" />
          <path d="M 156 204v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,160,208)" />
          <path d="M 164 28v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,168,32)" />
          <path d="M 164 36v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,168,40)" />
          <path d="M 164 52v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,168,56)" />
          <rect x="164" y="76" width="8" height="8" transform="rotate(0,168,80)" />
          <path d="M 164 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,168,96)" />
          <path d="M 164 100v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,168,104)" />
          <rect x="164" y="116" width="8" height="8" transform="rotate(0,168,120)" />
          <rect x="164" y="124" width="8" height="8" transform="rotate(0,168,128)" />
          <path d="M 164 148v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,168,152)" />
          <circle cx="168" cy="168" r="4" transform="rotate(0,168,168)" />
          <path d="M 164 180v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,168,184)" />
          <rect x="164" y="204" width="8" height="8" transform="rotate(0,168,208)" />
          <path d="M 164 220v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,168,224)" />
          <circle cx="176" cy="24" r="4" transform="rotate(0,176,24)" />
          <circle cx="176" cy="48" r="4" transform="rotate(0,176,48)" />
          <circle cx="176" cy="64" r="4" transform="rotate(0,176,64)" />
          <rect x="172" y="76" width="8" height="8" transform="rotate(0,176,80)" />
          <rect x="172" y="84" width="8" height="8" transform="rotate(0,176,88)" />
          <rect x="172" y="92" width="8" height="8" transform="rotate(0,176,96)" />
          <path d="M 172 100v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,176,104)" />
          <path d="M 172 116v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,176,120)" />
          <path d="M 172 124v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,176,128)" />
          <path d="M 172 140v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,176,144)" />
          <path d="M 172 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,176,152)" />
          <path d="M 172 172v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,176,176)" />
          <rect x="172" y="180" width="8" height="8" transform="rotate(0,176,184)" />
          <rect x="172" y="188" width="8" height="8" transform="rotate(0,176,192)" />
          <rect x="172" y="196" width="8" height="8" transform="rotate(0,176,200)" />
          <rect x="172" y="204" width="8" height="8" transform="rotate(0,176,208)" />
          <rect x="172" y="212" width="8" height="8" transform="rotate(0,176,216)" />
          <path d="M 172 220v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,176,224)" />
          <rect x="180" y="76" width="8" height="8" transform="rotate(0,184,80)" />
          <rect x="180" y="84" width="8" height="8" transform="rotate(0,184,88)" />
          <path d="M 180 92v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,184,96)" />
          <circle cx="184" cy="112" r="4" transform="rotate(0,184,112)" />
          <path d="M 180 132v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,184,136)" />
          <path d="M 180 140v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,184,144)" />
          <circle cx="184" cy="160" r="4" transform="rotate(0,184,160)" />
          <rect x="180" y="172" width="8" height="8" transform="rotate(0,184,176)" />
          <rect x="180" y="204" width="8" height="8" transform="rotate(0,184,208)" />
          <path d="M 180 228v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,184,232)" />
          <rect x="188" y="76" width="8" height="8" transform="rotate(0,192,80)" />
          <path d="M 188 84v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,192,88)" />
          <path d="M 188 124v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,192,128)" />
          <rect x="188" y="132" width="8" height="8" transform="rotate(0,192,136)" />
          <circle cx="192" cy="152" r="4" transform="rotate(0,192,152)" />
          <path d="M 188 164v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,192,168)" />
          <rect x="188" y="172" width="8" height="8" transform="rotate(0,192,176)" />
          <circle cx="192" cy="192" r="4" transform="rotate(0,192,192)" />
          <rect x="188" y="204" width="8" height="8" transform="rotate(0,192,208)" />
          <path d="M 188 220v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,192,224)" />
          <path d="M 188 228v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,192,232)" />
          <path d="M 196 76v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,200,80)" />
          <circle cx="200" cy="96" r="4" transform="rotate(0,200,96)" />
          <path d="M 196 108v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,200,112)" />
          <rect x="196" y="116" width="8" height="8" transform="rotate(0,200,120)" />
          <rect x="196" y="124" width="8" height="8" transform="rotate(0,200,128)" />
          <path d="M 196 132v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,200,136)" />
          <path d="M 196 156v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,200,160)" />
          <rect x="196" y="172" width="8" height="8" transform="rotate(0,200,176)" />
          <rect x="196" y="204" width="8" height="8" transform="rotate(0,200,208)" />
          <path d="M 196 236v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,200,240)" />
          <circle cx="208" cy="88" r="4" transform="rotate(0,208,88)" />
          <circle cx="208" cy="144" r="4" transform="rotate(0,208,144)" />
          <path d="M 204 156v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,208,160)" />
          <rect x="204" y="172" width="8" height="8" transform="rotate(0,208,176)" />
          <rect x="204" y="180" width="8" height="8" transform="rotate(0,208,184)" />
          <rect x="204" y="188" width="8" height="8" transform="rotate(0,208,192)" />
          <rect x="204" y="196" width="8" height="8" transform="rotate(0,208,200)" />
          <rect x="204" y="204" width="8" height="8" transform="rotate(0,208,208)" />
          <path d="M 204 212v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(180,208,216)" />
          <path d="M 204 236v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,208,240)" />
          <path d="M 212 76v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,216,80)" />
          <path d="M 212 100v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,216,104)" />
          <path d="M 212 116v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,216,120)" />
          <path d="M 212 164v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,216,168)" />
          <path d="M 212 172v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,216,176)" />
          <rect x="212" y="196" width="8" height="8" transform="rotate(0,216,200)" />
          <rect x="212" y="204" width="8" height="8" transform="rotate(0,216,208)" />
          <rect x="212" y="212" width="8" height="8" transform="rotate(0,216,216)" />
          <rect x="212" y="220" width="8" height="8" transform="rotate(0,216,224)" />
          <path d="M 212 228v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,216,232)" />
          <path d="M 220 76v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,224,80)" />
          <path d="M 220 92v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(-90,224,96)" />
          <rect x="220" y="100" width="8" height="8" transform="rotate(0,224,104)" />
          <rect x="220" y="116" width="8" height="8" transform="rotate(0,224,120)" />
          <path d="M 220 124v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,224,128)" />
          <path d="M 220 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(-90,224,152)" />
          <rect x="220" y="156" width="8" height="8" transform="rotate(0,224,160)" />
          <path d="M 220 164v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,224,168)" />
          <rect x="220" y="196" width="8" height="8" transform="rotate(0,224,200)" />
          <rect x="220" y="212" width="8" height="8" transform="rotate(0,224,216)" />
          <circle cx="224" cy="240" r="4" transform="rotate(0,224,240)" />
          <path d="M 228 100v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,232,104)" />
          <rect x="228" y="108" width="8" height="8" transform="rotate(0,232,112)" />
          <path d="M 228 116v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,232,120)" />
          <circle cx="232" cy="136" r="4" transform="rotate(0,232,136)" />
          <rect x="228" y="148" width="8" height="8" transform="rotate(0,232,152)" />
          <rect x="228" y="156" width="8" height="8" transform="rotate(0,232,160)" />
          <circle cx="232" cy="184" r="4" transform="rotate(0,232,184)" />
          <path d="M 228 196v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,232,200)" />
          <rect x="228" y="204" width="8" height="8" transform="rotate(0,232,208)" />
          <path d="M 228 212v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(90,232,216)" />
          <path d="M 228 228v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(180,232,232)" />
          <circle cx="240" cy="80" r="4" transform="rotate(0,240,80)" />
          <circle cx="240" cy="96" r="4" transform="rotate(0,240,96)" />
          <circle cx="240" cy="128" r="4" transform="rotate(0,240,128)" />
          <path d="M 236 148v 8h 8v -4a 4 4, 0, 0, 0, -4 -4" transform="rotate(0,240,152)" />
          <rect x="236" y="156" width="8" height="8" transform="rotate(0,240,160)" />
          <rect x="236" y="164" width="8" height="8" transform="rotate(0,240,168)" />
          <path d="M 236 172v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(90,240,176)" />
          <path d="M 236 228v 8h 4a 4 4, 0, 0, 0, 0 -8" transform="rotate(0,240,232)" />
          <path
            clip-rule="evenodd"
            d="M 12 32v 16a 20 20, 0, 0, 0, 20 20h 16a 20 20, 0, 0, 0, 20 -20v -16a 20 20, 0, 0, 0, -20 -20h -16a 20 20, 0, 0, 0, -20 20M 32 20h 16a 12 12, 0, 0, 1, 12 12v 16a 12 12, 0, 0, 1, -12 12h -16a 12 12, 0, 0, 1, -12 -12v -16a 12 12, 0, 0, 1, 12 -12"
            transform="rotate(0,40,40)"
          />
          <circle cx="40" cy="40" r="12" transform="rotate(0,40,40)" />
          <path
            clip-rule="evenodd"
            d="M 188 32v 16a 20 20, 0, 0, 0, 20 20h 16a 20 20, 0, 0, 0, 20 -20v -16a 20 20, 0, 0, 0, -20 -20h -16a 20 20, 0, 0, 0, -20 20M 208 20h 16a 12 12, 0, 0, 1, 12 12v 16a 12 12, 0, 0, 1, -12 12h -16a 12 12, 0, 0, 1, -12 -12v -16a 12 12, 0, 0, 1, 12 -12"
            transform="rotate(90,216,40)"
          />
          <circle cx="216" cy="40" r="12" transform="rotate(90,216,40)" />
          <path
            clip-rule="evenodd"
            d="M 12 208v 16a 20 20, 0, 0, 0, 20 20h 16a 20 20, 0, 0, 0, 20 -20v -16a 20 20, 0, 0, 0, -20 -20h -16a 20 20, 0, 0, 0, -20 20M 32 196h 16a 12 12, 0, 0, 1, 12 12v 16a 12 12, 0, 0, 1, -12 12h -16a 12 12, 0, 0, 1, -12 -12v -16a 12 12, 0, 0, 1, 12 -12"
            transform="rotate(-90,40,216)"
          />
          <circle cx="40" cy="216" r="12" transform="rotate(-90,40,216)" />
        </clipPath>
      </defs>
      <rect x="0" y="0" height="256" width="256" clip-path="url('#clip-path-background-color')" fill="#fff" />
      <rect x="0" y="0" height="256" width="256" clip-path="url('#clip-path-dot-color')" fill="#9ca3af" />
    </svg>
  </div>
</template>
