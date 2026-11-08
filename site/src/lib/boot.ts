// True while the page is first drawn from the ready-made HTML (and on the server that builds it).
// Parts that mount then skip their entrance animation, so text that is already on screen never blinks out.
let booting = typeof window === 'undefined'

export const isBooting = () => booting
export const setBooting = (v: boolean) => { booting = v }

/** Entrance start values for a motion `initial`, or none while booting. */
export const enter = <T,>(v: T): T | false => (booting ? false : v)
