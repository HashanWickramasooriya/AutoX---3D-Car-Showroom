/**
 * The real GLB (see CarModel.tsx) ships with a single modeled wheel/rim;
 * there is no separate geometry per option. Selecting a style here retints
 * the real rim material's finish (see WHEEL_FINISH in CarModel.tsx) rather
 * than pretending a different wheel design is mounted.
 */
export type WheelStyle = 'sport-19' | 'performance-20' | 'carbon-21'
