# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: dependency-light Node.js server with a responsive HTML/CSS/JavaScript client. This keeps event setup simple while allowing a shared leaderboard. The exact deployment target remains open.

## Users

Primary users are children participating in an in-person coding competition. The initial build assumes elementary-school reading and motor skills; the precise age range remains open.

## Product Purpose

Teach sequencing, repetition, and basic algorithm design by having players assemble block-like commands that guide a character through five stages. Success means reaching each flag quickly, avoiding bombs, collecting coins, and understanding why a shorter or smarter program scores better.

## Positioning

The game makes an algorithm directly observable: children build a command sequence, run it on a grid, see each instruction execute, and immediately connect code efficiency, elapsed time, coin collection, and the final score.

## Operating Context

The initial build assumes event computers running a modern browser on a shared local network. A facilitator starts the Node.js server, children complete all five stages, then enter their name once to submit the combined result.

## Capabilities and Constraints

- Five organizer-supplied grid layouts: two centered 3×3 play areas with wall borders, two 4×4 maps, and one 5×5 final map.
- Absolute up, down, left, and right movement blocks plus a repeat container; there is no rotation mechanic.
- Blocks support click-to-add and drag-and-drop assembly, including dropping movement commands into a C-shaped repeat container.
- The game withholds route prediction so children reason from their code and learn from the actual execution result.
- The primary competition setup targets a 1920×1080 desktop with the algorithm on the left, map on the right, and command inventory across the bottom.
- A fixed, non-removable start block anchors every program.
- Each stage enforces its own source-block limit, excluding the fixed start block.
- Bomb collision ends the current attempt; the stage can be retried.
- Coins award bonus points, and faster completion earns more points.
- Ranking submission is unlocked only after all five stages are completed.
- The shared leaderboard persists to a small server-side JSON file.
- No account system or personal data beyond a short display name.
- Exact competition scoring constants and deployment environment remain configurable decisions.

## Evidence on Hand

The organizer supplied a folder of G-META robot character artwork with standing, moving, greeting, cheering, dancing, heart, pointing, angled, and victory poses. These are real project assets and should be reused without destructive edits.

## Brand Commitments

The G-META robot is the main character. Preserve its oversized round head, side ear panels, large dark oval eyes, small smile, white segmented body, coral-pink chest display, and G-META emblem. Adaptation may simplify shading and strengthen outlines for small grid tiles, but must not replace its silhouette or personality.

No finalized competition rule sheet, testimonials, or benchmark claims were supplied and none should be invented.

## Product Principles

- Make cause and effect visible after every command.
- Reward correct and efficient algorithms without making failure punitive.
- Keep the full competition flow understandable without facilitator explanation.
- Prevent accidental score submission before the run is complete.
- Make retrying fast so experimentation feels safe.

## Accessibility & Inclusion

Controls must work with keyboard and touch, never rely on color alone, use readable Korean labels, and respect reduced-motion preferences.
