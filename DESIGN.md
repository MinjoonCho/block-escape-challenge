---
name: "코딩할고양"
description: "고양 청소년어울림마당에서 공식 고양시 마스코트와 함께 즐기는 블록 코딩 챌린지"
colors:
  festival-green: "#114b2f"
  festival-green-deep: "#082f1c"
  coding-yellow: "#ffe22d"
  energetic-orange: "#ff7a00"
  repeat-orange: "#f0642f"
  direction-blue: "#2b78c5"
  direction-purple: "#7257b8"
  direction-green: "#11833f"
  warm-paper: "#f4f1e8"
  grid-white: "#fffdf7"
  map-mist: "#e8ebe5"
  evergreen-ink: "#173225"
  sage-muted: "#617568"
  soft-divider: "#c7d4ca"
typography:
  display:
    fontFamily: "Black Han Sans, sans-serif"
    fontSize: "clamp(3.5rem, 7.2vw, 7.1rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Black Han Sans, sans-serif"
    fontSize: "clamp(1.8rem, 2vw, 2.45rem)"
    fontWeight: 400
    letterSpacing: "-0.025em"
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
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "11px"
  xl: "14px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  2xl: "32px"
components:
  button-start:
    backgroundColor: "{colors.coding-yellow}"
    textColor: "{colors.festival-green}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "58px"
  button-run:
    backgroundColor: "{colors.coding-yellow}"
    textColor: "{colors.festival-green}"
    rounded: "{rounded.md}"
    height: "58px"
  command-up:
    backgroundColor: "{colors.direction-blue}"
    textColor: "{colors.grid-white}"
    padding: "14px 10px 18px"
    size: "156px"
  command-down:
    backgroundColor: "{colors.direction-purple}"
    textColor: "{colors.grid-white}"
    padding: "14px 10px 18px"
    size: "156px"
  command-horizontal:
    backgroundColor: "{colors.direction-green}"
    textColor: "{colors.grid-white}"
    padding: "14px 10px 18px"
    size: "156px"
  command-repeat:
    backgroundColor: "{colors.repeat-orange}"
    textColor: "{colors.grid-white}"
    padding: "14px 10px 18px"
    size: "156px"
  input-name:
    backgroundColor: "{colors.grid-white}"
    textColor: "{colors.evergreen-ink}"
    padding: "13px"
---

# Design System: 코딩할고양

## Overview

**Creative North Star: "The Youth Festival Coding Ground"**

코딩할고양 is a bright, event-ready identity for the Goyang Youth Harmony Festival. Deep green creates a recognizable civic frame; vivid yellow and orange deliver the energy of a youth event; and warm paper surfaces keep the coding task calm enough to operate. The system should feel welcoming and official at once—more like a well-produced festival activity than a generic educational dashboard.

The official Goyang City cat mascot is the human connection across the experience. Use the supplied artwork unmodified: preserve its pixels, proportions, colors, and silhouette, and change only its rendered size and position. The event slogan, Tanhyeon Youth Center logo, and PROTEEN logo are also authoritative supplied assets. Persistent creator and character-license attribution is part of the public visual system, not optional fine print.

The game retains its purpose-built coding topology: algorithm canvas on the left, execution map on the right, and a full-width command dock below. Interlocking direction blocks and the open repeat container make program structure tangible, while the mascot’s actual movement—not a predicted route—shows the result of the child’s reasoning.

**Key Characteristics:**

- Deep festival green paired with high-energy yellow and orange.
- Official, unmodified Goyang City cat mascot artwork as the primary character.
- Supplied event and partner logos presented clearly on neutral surfaces.
- A focused algorithm-left, map-right, command-dock workbench for the competition.
- Persistent creator and public-license attribution on every public surface.

## Colors

The brand palette leads with civic green, then uses yellow and orange as festival signals; directional blue, purple, and green remain functional coding categories.

### Primary

- **Festival Green:** The principal brand field for headers, the landing hero, dark controls, and high-contrast framing.
- **Coding Yellow:** The most important action color for starts, execution, active-code focus, wordmark emphasis, and celebratory highlights.

### Secondary

- **Energetic Orange:** Brings warmth to the landing-page start line, flag, and event accents.
- **Repeat Orange:** Identifies repeat commands and the C/ㄷ-shaped container in the algorithm.
- **Direction Blue:** Identifies upward movement blocks.
- **Direction Purple:** Identifies downward movement blocks.
- **Direction Green:** Identifies left and right movement blocks while remaining visually distinct through arrow direction and Korean labels.

### Neutral

- **Warm Paper:** The algorithm panel, command dock, dialog, and results surface.
- **Grid White:** Playable cells, light text, and neutral component previews.
- **Map Mist:** The map field and subdued secondary controls.
- **Evergreen Ink:** Primary text on light backgrounds.
- **Sage Muted:** Instructions, metadata, captions, and quieter status copy.
- **Soft Divider:** Panel seams, rules, and quiet structural borders.

### Named Rules

**The Festival Signal Rule.** Green establishes the event, yellow identifies the primary next action or active execution, and orange supplies energy or repetition; keep those roles stable.

**The Command Recognition Rule.** Up, down, horizontal movement, and repeat retain their category colors everywhere they appear, but labels and arrow geometry always accompany color.

## Typography

**Display Font:** Black Han Sans (with sans-serif fallback)
**Body Font:** Noto Sans KR (with sans-serif fallback)
**Label Font:** Noto Sans KR (with sans-serif fallback)

**Character:** Black Han Sans gives the Korean name and major headings a compact, cheerful event voice. Noto Sans KR carries every instruction and live value with high legibility, using weight rather than decorative styling to establish hierarchy.

### Hierarchy

- **Display** (400, fluid 3.5rem–7.1rem, 0.98): The landing name and its large invitation statement.
- **Headline** (400, fluid 1.8rem–2.45rem): Workbench panels, modal outcomes, and route-level titles.
- **Body** (500, 0.9rem, 1.55): Mission explanations and direct task guidance.
- **Label** (800, 0.75rem): Scoreboard labels, statuses, legends, credits, and control emphasis.

### Named Rules

**The One Festival Voice Rule.** Black Han Sans is reserved for the event name and decisive headings; all operational language remains Noto Sans KR.

**The Live Number Rule.** Timers, scores, coin totals, block counts, and ranks use bold weight and tabular numerals where values update in place.

## Layout

The landing page uses an 82px festival-green header, a two-column hero, a 128px partner strip, and a 44px attribution footer on desktop. The first viewport keeps the 코딩할고양 name, short rules summary, start and tutorial actions, official running mascot, event slogan, and partner identities visible together. At 680px and below, the hero becomes a vertical invitation and the logo strip and footer stack without removing attribution.

The competition surface targets 1920×1080. An 88px scoreboard combines the brand, partner logos, live race values, and leaderboard action. Beneath it, the upper work area places the algorithm canvas on the left at roughly 42% and the execution map on the right at roughly 58%; a 218px command dock spans the full bottom edge. The five source commands sit as centered square tiles between the dock explanation and undo/run actions.

Below 1180px, the algorithm and map remain side by side while the dock actions move to a second row. Below 760px, the surface becomes map-first—map, algorithm, then command dock—with sticky execution controls. Click-to-add remains alongside drag-and-drop for touch use. The grid derives both row and column tracks from the stage and preserves true square cells.

### Named Rules

**The Coding Topology Rule.** On competition displays, algorithm stays left, observed result stays right, and source commands stay in the full-width dock below.

**The Map-First Mobile Rule.** On narrow screens, show the execution map before the algorithm and dock without hiding the run action.

## Elevation & Depth

Depth is selective and functional. The brand surfaces rely primarily on color fields; controls, movable blocks, the partner-logo plate, and overlays receive soft lift. The coding canvas uses an inset boundary and dotted working texture rather than a floating card shadow. Map objects and effects use dimensional rendering, but the supplied official mascot and institutional logos remain visually unaltered.

### Shadow Vocabulary

- **Festival Action** (`0 7px 18px rgba(0,0,0,.25)`): Lifts the landing start action from the green hero.
- **Partner Plate** (`0 4px 12px rgba(0,0,0,.16)`): Separates institutional logos from the dark scoreboard.
- **Magnetic Tile** (`0 7px 16px rgba(12,37,56,.2)`): Gives draggable square source commands visible lift.
- **Program Block** (`0 4px 8px rgba(12,37,56,.2)`): Keeps assembled commands tangible without overpowering the canvas.
- **Map Frame** (`0 8px 18px rgba(12,37,56,.22)`): Seats the execution grid on the mist field.
- **Result Modal** (`0 20px 60px rgba(0,0,0,.3)`): Separates verified completion and score submission from the game.

### Named Rules

**The Functional Lift Rule.** Apply elevation to actions, movable code, partner-logo plates, and transient overlays; keep reading and working surfaces flat or inset.

## Shapes

The event identity uses approachable 8–14px rounding for links, primary actions, logo plates, and modal feedback. The yellow C brand tile is a rounded square. By contrast, direction blocks use a distinctive interlocking silhouette with a top socket, bottom tab, and side connections; assembled program blocks keep the top-and-bottom connection profile.

The repeat command is the signature algorithm shape: an orange C/ㄷ-like container with a header, left spine, inset body, and bottom tail that visibly wraps nested direction blocks. Circles are reserved for live status dots, score indices, coins, and outcome symbols. The game grid remains rectilinear and mechanically regular.

### Named Rules

**The Interlocking Code Rule.** Every movable direction command retains a visible connection profile in both the source dock and the assembled algorithm.

**The Container Means Structure Rule.** Repeat is not a differently colored row; it must visibly contain its nested movement commands.

## Components

### Buttons

- **Shape:** Start and tutorial actions use 11px corners and a 58px minimum height; utility and run controls use 8–10px corners.
- **Primary:** Start and run actions use Coding Yellow with Festival Green text and heavy labels.
- **Hover / Focus:** Primary actions rise and brighten on hover. Keyboard focus uses a 4px sky-blue outline with clear offset, and reduced-motion preferences collapse transitions.
- **Secondary / Ghost:** Tutorial uses a dark green-toned field with a light border. Undo and quiet text actions retain lower contrast than run or start.

### Cards / Containers

- **Corner Style:** The core workspace stays edge-to-edge and rectilinear; only interactive or transient containers receive stronger rounding.
- **Background:** Warm Paper for construction and results, Map Mist for execution, white for partner identity plates.
- **Shadow Strategy:** Follow the Functional Lift Rule.
- **Border:** Soft Divider defines the algorithm/map seam and dock boundary; the canvas uses a one-pixel inset edge.
- **Internal Padding:** Major working regions use 18–38px depending on viewport; compact controls use 8–14px.

### Inputs / Fields

- **Style:** The final name field is a rectangular Grid White input with a 2px Festival Green border and 13px inset, joined directly to its yellow submit action.
- **Focus:** The global 4px sky-blue focus outline remains visible beyond the field border.
- **Error / Disabled:** Validation uses Repeat Orange. Disabled controls preserve their form and become 45% opaque.

### Navigation

The landing header pairs the C tile and two-part 코딩할고양 wordmark with ranking and game-entry links. The game scoreboard adds a white partner-logo plate between the brand and live statistics. On small screens, navigation simplifies while the brand, critical race values, and partner identity remain readable.

### Official Mascot & Partner Marks

The official Goyang City cat artwork appears as the landing hero, the moving game character, and the completion character. It is never redrawn, recolored, cropped, rotated, filtered into a new style, or composited into a replacement silhouette; only size and position may change. The event slogan, Tanhyeon Youth Center logo, and PROTEEN logo retain their supplied artwork and proportions on neutral backgrounds.

### Attribution

Every public surface retains `제작: 연세대학교 컴퓨터과학과 조민준` and `캐릭터 제공: 고양특례시 · 공공누리 제3유형`. The landing page uses a full footer; the game and tutorial keep a persistent low-edge credit and repeat it in completion context where appropriate; ceremony and administrative surfaces include their own visible credit.

### Command Blocks

The bottom dock presents five square commands: four absolute directions and repeat. Each uses an inline SVG symbol, bold Korean label, short explanation, and interlocking silhouette. The algorithm begins with a fixed, non-removable start block. Assembled directions become compact draggable rows; the orange repeat container wraps its nested blocks. A thick yellow outline identifies the command currently executing.

### Execution Grid

The grid shows square cells, dimensional walls and game objects, and the official mascot’s actual position. It deliberately omits a predicted route: children diagnose the result from execution. Success, collision, coin, and flag effects provide immediate visible feedback, with status text and active-code treatment ensuring state is never communicated by color alone.

## Do's and Don'ts

### Do:

- **Do** lead every public route with the 코딩할고양 name and festival green/yellow/orange identity.
- **Do** use the official Goyang City mascot artwork unchanged and alter only rendered size and position.
- **Do** preserve supplied event and partner logos at their natural proportions on neutral surfaces.
- **Do** retain creator and public-license attribution on every public surface.
- **Do** keep the game’s algorithm-left, map-right, command-dock topology at competition width.
- **Do** pair command color with Korean text and distinct arrow or repeat geometry.

### Don't:

- **Don't** reintroduce the former robot-led dark operations-board identity.
- **Don't** recolor, redraw, rotate, crop, stylize, or replace the official Goyang City mascot.
- **Don't** recolor or distort the event slogan, Tanhyeon Youth Center logo, or PROTEEN logo.
- **Don't** turn the competition workbench into unrelated floating dashboard cards.
- **Don't** show a predicted route before execution or rely on color alone for game state.
- **Don't** hide or remove the required attribution to gain layout space.
