/**
 * Determine Member Level based on total points.
 * Thresholds (cumulative):
 *   Basic   : 0 – 499
 *   Silver  : 500 – 1 999
 *   Gold    : 2 000 – 4 999
 *   Diamond : 5 000+
 */
const LEVEL_THRESHOLDS = [
  { level: 'Diamond', min: 5000 },
  { level: 'Gold',    min: 2000 },
  { level: 'Silver',  min: 500  },
  { level: 'Basic',   min: 0    },
]

/**
 * Returns the level name for a given point total.
 * @param {number} points
 * @returns {string}
 */
function getLevelForPoints(points) {
  for (const { level, min } of LEVEL_THRESHOLDS) {
    if (points >= min) return level
  }
  return 'Basic'
}

/**
 * Returns the point threshold needed to maintain (or reach) a level.
 * @param {string} level
 * @returns {number}
 */
function getMinPointsForLevel(level) {
  return LEVEL_THRESHOLDS.find(t => t.level === level)?.min ?? 0
}

/**
 * Year-end downgrade logic.
 * If the year has changed (new year) and the user's points don't meet the
 * required minimum for their current level → downgrade one step.
 *
 * @param {object} user   - full user row from DB
 * @param {number} currentYear - usually new Date().getFullYear()
 * @returns {{ newLevel: string, downgraded: boolean }}
 */
function checkYearEndDowngrade(user, currentYear) {
  const expiryYear = user.level_expiry_year ?? currentYear
  if (currentYear <= expiryYear) {
    // Same year or level hasn't expired yet – no change
    return { newLevel: user.level, downgraded: false }
  }

  // A new year has passed; verify points still meet current level
  const required = getMinPointsForLevel(user.level)
  if (user.points >= required) {
    return { newLevel: user.level, downgraded: false }
  }

  // Downgrade one step
  const idx   = LEVEL_THRESHOLDS.findIndex(t => t.level === user.level)
  const lower = LEVEL_THRESHOLDS[idx + 1]?.level ?? 'Basic'
  return { newLevel: lower, downgraded: true }
}

/**
 * Points awarded per purchase (1 point per Rp 1,000).
 * @param {number} finalPrice
 * @returns {number}
 */
function calcPointsEarned(finalPrice) {
  return Math.floor(finalPrice / 1000)
}

module.exports = {
  LEVEL_THRESHOLDS,
  getLevelForPoints,
  getMinPointsForLevel,
  checkYearEndDowngrade,
  calcPointsEarned,
}
