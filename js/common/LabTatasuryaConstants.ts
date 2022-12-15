// Copyright 2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Mario (Software Engineer)
 */

import Range from '../../../dot/js/Range.js';
import labTatasurya from '../labTatasurya.js';
import LabTatasuryaColors from './LabTatasuryaColors.js';

// constants
const CONTROL_PANEL_STROKE = '#8E9097';
const PANEL_X_MARGIN = 5;

const LabTatasuryaConstants = {

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  // massa planets
  SUN_MASS: 1.989E30, // kg
  MERCURY_MASS: 0.3301E24, // kg
  VENUS_MASS: 4.8673E24, // kg
  EARTH_MASS: 5.9724E24, // kg
  MARS_MASS: 0.64169E24, // kg
  JUPITER_MASS: 1898.13E24, // kg
  SATURN_MASS: 568.32E24, // kg
  URANUS_MASS: 86.811E24, // kg
  NEPTUNE_MASS: 102.409E24, // kg

  // radius planets
  /**
   * in meters
   */
  SUN_RADIUS: 6.957E8, // m
  /**
   * in meters
   */
  EARTH_RADIUS: 6.371E6, // m
  MERCURY_RADIUS: 2.4397E6, // m
  VENUS_RADIUS: 6.0518E6, // m
  MARS_RADIUS: 3.3895E6, // m
  JUPITER_RADIUS: 69.911E6, // m
  SATURN_RADIUS: 58.232E6, // m
  URANUS_RADIUS: 25.362E6, // m
  NEPTUNE_RADIUS: 24.622E6, // m

  // planet perihelion
  EARTH_PERIHELION: 147098074E3, // m, distance from the sun at the closest point
  MERCURY_PERIHELION: 46E9, // m
  VENUS_PERIHELION: 107.48E9, // m
  MARS_PERIHELION: 206.650E9, // m
  JUPITER_PERIHELION: 740.595E9, // m
  SATURN_PERIHELION: 1357.554E9, // m
  URANUS_PERIHELION: 2732.696E9, // m
  NEPTUNE_PERIHELION: 4471.05E9, // m
  
  // planet orbital speed at perihelion
  EARTH_ORBITAL_SPEED_AT_PERIHELION: 30300, // m/s
  MERCURY_ORBITAL_SPEED_AT_PERIHELION: 58980, // m/s
  VENUS_ORBITAL_SPEED_AT_PERIHELION: 35260, // m/s
  MARS_ORBITAL_SPEED_AT_PERIHELION: 26500, // m/s
  JUPITER_ORBITAL_SPEED_AT_PERIHELION: 13720, // m/s
  SATURN_ORBITAL_SPEED_AT_PERIHELION: 10180, // m/s
  URANUS_ORBITAL_SPEED_AT_PERIHELION: 7110, // m/s
  NEPTUNE_ORBITAL_SPEED_AT_PERIHELION: 5500, // m/s

  PLAY_AREA_TANDEM_NAME: 'playAreaNode',
  ZOOM_RANGE: new Range( 0.5, 1.3 ),
  CONTROL_PANEL_OPTIONS: {
    stroke: CONTROL_PANEL_STROKE,
    lineWidth: 2,
    cornerRadius: 5,
    xMargin: PANEL_X_MARGIN,
    scale: 1.05,
    fill: LabTatasuryaColors.controlPanelFillProperty
  },
};

labTatasurya.register( 'LabTatasuryaConstants', LabTatasuryaConstants );
export default LabTatasuryaConstants;