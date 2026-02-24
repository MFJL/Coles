// Rewards engine configuration.
// Centralised here so the path to real Flybuys API integration is obvious.

/** How many steps earn 1 Flybuys point from walking */
export const STEPS_PER_POINT = 50;

/** Multiplier applied to quest completion bonuses (1 = no extra multiplier) */
export const BONUS_MULTIPLIER = 1;

/** Maximum walking-derived points per store visit */
export const MAX_POINTS_PER_VISIT = 100;

/** Steps added per manual boost tap (for testing) */
export const MANUAL_BOOST_STEPS = 20;

/** Auto-increment interval in ms when motion is unavailable (500ms = 2 steps/sec) */
export const AUTO_INCREMENT_INTERVAL_MS = 500;

/** Auto-increment steps per tick */
export const AUTO_INCREMENT_STEPS_PER_TICK = 1;

/** Minimum accelerometer magnitude to count as a step event */
export const MOTION_STEP_THRESHOLD = 12;

/** Minimum ms between counted steps (prevents double-counting one footfall) */
export const MOTION_STEP_COOLDOWN_MS = 350;
