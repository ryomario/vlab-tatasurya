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
  EARTH_MASS: 5.9724E24, // kg

  // radius planets
  /**
   * in meters
   */
  SUN_RADIUS: 6.957E8, // m
  /**
   * in meters
   */
  EARTH_RADIUS: 6.371E6, // m

  // planet perihelion
  EARTH_PERIHELION: 147098074E3, // m, distance from the sun at the closest point
  
  // planet orbital speed at perihelion
  EARTH_ORBITAL_SPEED_AT_PERIHELION: 30300, // m/s
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