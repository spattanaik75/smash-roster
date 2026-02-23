/**
 * Marvel superhero avatars - using actual icon files from Flaticon.
 */

export const SUPERHERO_AVATARS = [
  { id: 'spiderman', icon: '/icons/spiderman.png', name: 'Spider-Man', color: '#e53e3e' },
  { id: 'ironman', icon: '/icons/iron-man.png', name: 'Iron Man', color: '#d69e2e' },
  { id: 'thor', icon: '/icons/thor.png', name: 'Thor', color: '#3182ce' },
  { id: 'hulk', icon: '/icons/hulk.png', name: 'Hulk', color: '#38a169' },
  { id: 'batman', icon: '/icons/batman.png', name: 'Batman', color: '#2d3748' },
  { id: 'flash', icon: '/icons/flash.png', name: 'Flash', color: '#e53e3e' },
  { id: 'hawkeye', icon: '/icons/hawkeye.png', name: 'Hawkeye', color: '#805ad5' },
  { id: 'panther', icon: '/icons/panther.png', name: 'Black Panther', color: '#2d3748' },
  { id: 'humantorch', icon: '/icons/human-torch.png', name: 'Human Torch', color: '#ed8936' },
  { id: 'wonderwoman', icon: '/icons/wonder-woman.png', name: 'Wonder Woman', color: '#e53e3e' },
]

/**
 * Assign avatars to players (cycle through list).
 * @param {string[]} playerNames
 * @returns {Map<string, { icon: string, color: string }>}
 */
export function assignAvatars(playerNames) {
  const map = new Map()
  playerNames.forEach((name, idx) => {
    const avatar = SUPERHERO_AVATARS[idx % SUPERHERO_AVATARS.length]
    map.set(name, { icon: avatar.icon, color: avatar.color })
  })
  return map
}
