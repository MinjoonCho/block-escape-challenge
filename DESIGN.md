---
name: "G메타ㄹ출"
description: "명령 블록으로 지메타의 안전한 탈출 경로를 설계하는 코딩 경기 작전판"
colors:
  operations-navy: "#0c2538"
  command-blue: "#2b78c5"
  route-green: "#16836b"
  safety-yellow: "#f7c948"
  hazard-coral: "#e7523e"
  operations-ink: "#102331"
  instruction-muted: "#597080"
  divider-steel: "#b9c3c7"
  map-mist: "#e8ebe5"
  board-paper: "#f4f1e8"
  grid-white: "#fffdf7"
typography:
  display:
    fontFamily: "Black Han Sans, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Black Han Sans, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 400
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1.55
  label:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
rounded:
  xs: "7px"
  sm: "8px"
  md: "9px"
  lg: "10px"
  xl: "12px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "26px"
  2xl: "32px"
components:
  command-move:
    backgroundColor: "{colors.command-blue}"
    textColor: "{colors.grid-white}"
    rounded: "{rounded.xl}"
    padding: "10px 13px"
    height: "68px"
  command-repeat:
    backgroundColor: "{colors.route-green}"
    textColor: "{colors.grid-white}"
    rounded: "{rounded.xl}"
    padding: "10px 13px"
    height: "68px"
  button-run:
    backgroundColor: "{colors.safety-yellow}"
    textColor: "{colors.operations-navy}"
    rounded: "{rounded.lg}"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.map-mist}"
    textColor: "{colors.operations-navy}"
    rounded: "{rounded.lg}"
    height: "52px"
  program-move:
    backgroundColor: "{colors.command-blue}"
    textColor: "{colors.grid-white}"
    rounded: "{rounded.md}"
    padding: "7px 8px"
    height: "48px"
  program-repeat:
    backgroundColor: "{colors.route-green}"
    textColor: "{colors.grid-white}"
    rounded: "{rounded.md}"
    padding: "7px 8px"
    height: "48px"
---

# Design System: G메타ㄹ출

## Overview

**Creative North Star: "The Laminated Evacuation Board"**

The interface turns a child's command sequence into a visible evacuation route. It feels like a durable operations board prepared for a friendly school safety drill: navy framing establishes command, warm paper and mist surfaces keep the work legible, striped rails protect the play field, and magnetic-looking blocks make every instruction feel placed by hand.

The tone is alert without becoming alarming. Safety yellow identifies action and the planned path, coral marks hazards and errors, four distinct colors separate absolute movement directions, and green identifies repetition and safe completion. The upright G-META mascot remains the emotional center of the map while the interface stays compact, direct, and readable for elementary-school players.

**Key Characteristics:**

- A laminated navy-and-paper operations board rather than a generic rounded learning dashboard.
- Interlocking magnetic command blocks with tactile press depth.
- Safety-yellow rails and numbered markers that make the planned route visible before execution.
- Coral hazards, deep navy structure, four color-coded directions, and a distinct green repeat category.
- A 1920×1080 coding workbench with algorithm left, execution map right, and the command inventory spanning the bottom.

## Colors

The palette combines institutional navy and steel with warm paper, then reserves saturated color for commands, safe progress, and hazards.

### Primary

- **Operations Navy:** The structural color for the race header, grid frame, headings, directional marks, and high-contrast text.
- **Safety Yellow:** The action color for execution, active-code focus, hazard rails, coins, and the brand tile.

### Secondary

- **Command Blue:** Identifies upward movement; the remaining directions use their own consistent category colors.
- **Route Green:** Identifies repeat containers and marks the escape flag and verified completion state.

### Tertiary

- **Hazard Coral:** Identifies bombs, destructive text actions, validation messages, and final-score emphasis.

### Neutral

- **Board Paper:** The warm main workspace and modal surface.
- **Grid White:** The clean playable cells and white-on-color content.
- **Map Mist:** Separates the planning field and secondary controls from the paper bays.
- **Operations Ink:** The darkest reading color on light surfaces.
- **Instruction Muted:** Supporting instructions, captions, metadata, and disabled-feeling copy.
- **Divider Steel:** Thin bay separators and list dividers.

### Named Rules

**The Safety Signal Rule.** Safety yellow means route or action, while hazard coral means danger, destructive action, or error; never swap their jobs.

**The Color-Coded Command Rule.** Up, down, left, right, and repeat keep distinct, consistent colors everywhere they appear, so children can recognize a sequence before reading every label.

## Typography

**Display Font:** Black Han Sans (with sans-serif fallback)
**Body Font:** Noto Sans KR (with sans-serif fallback)
**Label Font:** Noto Sans KR (with sans-serif fallback)

**Character:** Black Han Sans gives headings the unmistakable voice of stamped Korean signage. Noto Sans KR keeps instructions, scores, and controls dense but clear, with heavier weights used as functional wayfinding rather than decoration.

### Hierarchy

- **Display** (400, fluid 2rem–3.5rem, 1.05): Reserved for the completion headline.
- **Headline** (400, 1.7rem): Names the command bay and program panel; leaderboard headings may rise to 2rem.
- **Body** (500, 0.9rem, 1.55): Explains missions and next actions in short, direct sentences.
- **Label** (800, 0.75rem): Carries scorebar labels, status text, legends, captions, and button emphasis.

### Named Rules

**The Stamped Heading Rule.** Use Black Han Sans only where a sign, panel, or result needs a bold operational title; all instructional copy remains Noto Sans KR.

**The Numbers-at-a-Glance Rule.** Timers, scores, block counts, and ranks use bold weight and tabular numerals where values update in place.

## Layout

The competition shell begins with an 88px navy scoreboard and fills the remaining 1920×1080 viewport. Its upper work area places the algorithm canvas on the left at roughly 42% and the execution map on the right at roughly 58%; the command inventory spans the full bottom rail beside undo and run controls. One-pixel steel dividers create the feeling of a single fabricated board instead of unrelated cards.

Below 1180px, the algorithm and map remain side by side while the command rail gains a second action row. Below 760px, content becomes a map-first vertical flow—scoreboard, map, algorithm canvas, then command inventory. Click-to-add remains available wherever touch devices cannot provide native drag-and-drop, and the run controls stay sticky near the bottom.

Spacing is compact and purposeful: 8–13px inside block controls, 18–26px between working groups, and 26–32px for major panel or result-card padding. The map remains square and centered; its scale, not its cell count, adapts to the viewport.

### Named Rules

**The Map Owns the Mission Rule.** The grid is always the largest working surface and moves ahead of editing controls on narrow screens.

**The Single Board Rule.** Adjacent work areas share edges and dividers; do not break the core workspace into floating dashboard cards.

## Elevation & Depth

Depth is structural rather than ambient. The full operations board has one broad shadow, the grid and command controls use short hard-edged drops that feel physically mounted, and transient overlays use larger directional or modal shadows. Most internal surfaces remain flat so state and play objects stay easy to read.

### Shadow Vocabulary

- **Board Lift** (`0 12px 24px rgba(2,24,39,.16)`): Lifts the complete workspace from the page background.
- **Magnetic Block** (`0 5px 0 rgba(12,37,56,.28)`): Gives command blocks a pressable bottom edge; active press shortens it to 2px.
- **Program Block** (`0 3px 0 #17466e` / `0 3px 0 #0b5646`): Keeps assembled commands tactile at a smaller scale.
- **Safety Rail** (`0 9px 0 #80909a`): Seats the striped grid frame on the map panel.
- **Drawer** (`-18px 0 40px rgba(0,0,0,.25)`): Pulls the leaderboard above the workspace from the right.
- **Result Modal** (`0 20px 60px rgba(0,0,0,.3)`): Separates the verified final result from its navy scrim.

### Named Rules

**The Mounted, Not Floating Rule.** Use short vertical shadows for controls and map hardware; reserve soft diffuse shadows for the workspace, drawer, and result overlay.

## Shapes

The system mixes modestly rounded utility controls with hard operational framing. Buttons and list items use 7–12px corners for safe touch affordances, while the workspace and result card remain rectangular. The signature command silhouette is an interlocking notched polygon, repeated in both the source command bay and assembled program so a block keeps its identity when moved.

Circles are semantic: score indicators, command indices, coins, and bombs. The brand mark, flag, arrowheads, and command notches use clipped geometry. The grid itself is square and bounded by a 12px navy frame overlaid with alternating navy-and-yellow safety stripes; on mobile, that rail narrows to 7px.

### Named Rules

**The Purposeful Geometry Rule.** Rounded corners belong to touch controls and circular game symbols; operational containers stay square and engineered.

**The Interlock Rule.** Command blocks retain their magnetic notch silhouette in every sequence-building context.

## Components

### Buttons

- **Shape:** Utility buttons use gently rounded corners (8–10px); command buttons use larger 12px corners plus the interlocking notch silhouette.
- **Primary:** The run button is safety yellow with navy type, a 52px minimum height, heavy label weight, and a 5px hard bottom edge.
- **Hover / Focus:** Enabled run buttons brighten and rise by 1px. Command blocks rise by 2px on hover, press down by 3px on active, and all controls receive a 4px sky-blue focus outline offset by 3px.
- **Secondary / Ghost:** Undo uses a mist fill and navy type. Leaderboard and quiet text actions stay transparent, using a border or coral text to communicate their different roles.

### Cards / Containers

- **Corner Style:** The main workspace and result card are square; the first-place leaderboard row alone uses a 12px celebratory corner.
- **Background:** Paper for work bays and results, mist for the map, navy for the global race header and modal scrim.
- **Shadow Strategy:** Structural lift only, following the Mounted, Not Floating Rule.
- **Border:** Single-pixel steel dividers separate bays; the map uses a thick striped safety rail.
- **Internal Padding:** Working bays use 26px; leaderboard and result surfaces use 28–32px.

### Inputs / Fields

- **Style:** The score-submission name field is a rectangular white field with a 2px navy stroke and 13px inset space, joined directly to its yellow submit action.
- **Focus:** The universal 4px sky-blue outline remains visible beyond the navy border.
- **Error / Disabled:** Validation text uses hazard coral. Disabled controls retain their shape and category color at 45% opacity with a non-interactive cursor.

### Navigation

The navy scorebar combines the clipped yellow brand tile, live centered race statistics, and a bordered leaderboard action. On smaller screens, the brand and leaderboard share the first row while four equally sized statistics form a second row. Labels are compact and pale; live values are bright, bold, and tabular.

### Competition Landing Page

The landing page is the race's starting gate. A large two-part Korean headline and the real G-META character share the first navy viewport, connected by a safety-yellow start line and a single prominent entry action. Below it, all five real maps appear as one continuous bordered stage rail rather than separate promotional cards, letting children understand the rising challenge before entering the game.

On phones the headline, action, and mascot stack in that order. The five-stage rail becomes two columns with the final 5×5 map centered across the last row, while the four rules become a single compact checklist.

### Command Blocks

Command blocks are the signature object. The bottom inventory exposes five equal square draggable source blocks with a translucent icon tile, bold Korean action, and short explanation. Direction and repeat symbols are inline SVGs, so their stroke weight and proportions remain crisp across browsers and display densities. Their assembled form compresses to a numbered row with a visible drag grip and delete control. A fixed start block anchors the top of every program. The coral repeat block forms a clear C/ㄷ-shaped shell with a left spine, header, bottom tail, and inset drop area for direction blocks. The executing command gains a thick safety-yellow outline, directly connecting code order to actual movement.

### Evacuation Grid

The grid derives both column and row tracks from each stage and preserves their ratio, with every playable and wall cell locked to a true square. It uses warm-white cells and layered CSS-built objects: beveled steel wall panels with rivets, ringed gold coins, glossy dark bombs with a lit fuse, and a dimensional green flag on a metallic pole. The legend repeats the same visual language at small scale. The map deliberately shows no predicted route while code is being assembled; only the character's actual execution changes the map. The character remains upright because movement is expressed through absolute direction blocks rather than rotation. The outer striped rail turns the whole map into a protected operational zone.

## Do's and Don'ts

### Do:

- **Do** keep the 1920×1080 hierarchy as scoreboard, algorithm left, map right, and command inventory across the bottom.
- **Do** highlight the active code block and show only actual movement results on the map.
- **Do** keep G-META upright and express direction through the four absolute movement blocks.
- **Do** preserve keyboard focus, touch-sized controls, Korean labels, and reduced-motion behavior.
- **Do** use hard-edged depth and clipped geometry to make controls feel mounted and magnetic.

### Don't:

- **Don't** turn the workspace into a collection of soft floating cards or pastel learning-app panels.
- **Don't** use safety yellow as decoration or hazard coral for ordinary navigation.
- **Don't** rotate, crop, or replace the recognizable G-META silhouette to indicate direction.
- **Don't** hide the run action below long content on mobile; retain the quick-run control by the map and sticky full controls.
- **Don't** communicate bombs, coins, flags, or execution state through color alone.
