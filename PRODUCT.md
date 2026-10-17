# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JavaScript client with a dependency-free Node.js static server for local preview. Vercel serves the same frontend without functions, APIs, storage, or environment variables.

## Users

Primary users are children participating in an in-person coding mission activity. The initial build assumes elementary-school reading and motor skills; the precise age range remains open.

## Product Purpose

Teach sequencing, repetition, and basic algorithm design by having players assemble block-like commands through a three-stage intermediate or advanced mission. Success means reaching each flag quickly, avoiding bombs, collecting coins, and understanding why a shorter or smarter program scores better.

## Positioning

The game makes an algorithm directly observable: children build a command sequence, run it on a grid, see each instruction execute, and immediately connect code efficiency, elapsed time, coin collection, and the final score.

## Operating Context

The build is branded for the Goyang Youth Harmony Festival and assumes event computers running a modern browser. Children choose a three-stage mission and see their combined result locally after completion; no name or result is submitted.

## Capabilities and Constraints

- Five organizer-supplied grid layouts: two centered 3×3 play areas with wall borders, two 4×4 maps, and one 5×5 final map.
- Absolute up, down, left, and right movement blocks plus a repeat container; there is no rotation mechanic.
- Blocks support click-to-add and drag-and-drop assembly, including dropping movement commands into a C-shaped repeat container.
- The game withholds route prediction so children reason from their code and learn from the actual execution result.
- The primary competition setup targets a 1920×1080 desktop with the algorithm on the left, map on the right, and command inventory across the bottom.
- A fixed, non-removable start block anchors every program.
- Source-block limits are intentionally generous: stages 1–5 allow 8, 9, 9, 10, and 12 blocks. Repeat containers and their inner commands each count as source blocks.
- Bomb collision ends the current attempt; the stage can be retried.
- Coins award bonus points, and faster completion earns more points.
- The final screen shows the combined score, elapsed time, and collected coins after all three stages.
- There is no leaderboard, account system, database, or personal-data input.
- Exact competition scoring constants and deployment environment remain configurable decisions.

## Evidence on Hand

The organizer supplied three brand images: the ten-year event slogan, the Tanhyeon Youth Center logo, and the PROTEEN logo. Official Goyang City mascot artwork is sourced from the city website and stored unchanged in the project.

## Brand Commitments

The game name is `코딩할고양`. The official Goyang City cat mascot is the main character and must not be visually modified. It may only be sized and positioned in the interface. Every public surface must retain the attribution `캐릭터 제공: 고양특례시 · 공공누리 제3유형` and the creator credit `제작: 연세대학교 컴퓨터과학과 조민준`.

No finalized competition rule sheet, testimonials, or benchmark claims were supplied and none should be invented.

## Product Principles

- Make cause and effect visible after every command.
- Reward correct and efficient algorithms without making failure punitive.
- Keep the full competition flow understandable without facilitator explanation.
- Keep scoring local and show the result only after the run is complete.
- Make retrying fast so experimentation feels safe.

## Accessibility & Inclusion

Controls must work with keyboard and touch, never rely on color alone, use readable Korean labels, and respect reduced-motion preferences.
