// Framer Motion's animation features, loaded in their own small chunk after the first paint
// (the navbar menus use LazyMotion with these, so the main bundle only carries the light `m` components).
import { domMax } from 'framer-motion';

export default domMax;
