// Loaded on demand: the Collection page pulls in the whole 3D engine, so other pages shouldn't pay for it.
export const loadCollection = () => import('./Collection')
