// Copyright 2014-2022, University of Colorado Boulder

/**
 * This type makes the radii of all objects much larger than the true physical values to make them visible on
 * the same scale. Configuration file for setting up the model scene parameters. This is typically done by
 * multiplying the real values by the desired scales. SunEarth and SunEarthMoon should be as similar as possible
 * (aside from the addition of the moon).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Tandem from "../../../../tandem/js/Tandem.js";
import LabTatasuryaModel from "../../common/model/LabTatasuryaModel.js";
import SceneFactory from "../../common/SceneFactory.js";
import labTatasurya from "../../labTatasurya.js";

// constants
const SUN_RADIUS_MULTIPLIER = 50; // sun radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
const EARTH_MOON_RADIUS_MULTIPLIER = 2000; // earth and moon radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand

/**
 * Convenience function that converts days to seconds, using days * hoursPerDay * minutesPerHour * secondsPerMinute
 */
const daysToSeconds = ( days: number ) => days * 24 * 60 * 60;

class OrbitSceneFactory extends SceneFactory {

    public constructor( model: LabTatasuryaModel, modelTandem: Tandem, viewTandem: Tandem ) {
        super(
            model,
            modelTandem, viewTandem, {
                sunEarth: new SunEarthModeConfig(),
            }
        );
    }
}

labTatasurya.register( 'OrbitSceneFactory', OrbitSceneFactory );

/**
 * Model configuration for a system with the sun and the earth.
 */
class SunEarthModeConfig extends SceneFactory.SunEarthModeConfig {
    public constructor() {
        super();
        this.sun.radius *= SUN_RADIUS_MULTIPLIER;
        this.planet.radius *= EARTH_MOON_RADIUS_MULTIPLIER;

        // Sun shouldn't move in model modes
        this.sun.isMovable = false;
        this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
    }
}

labTatasurya.register( 'SunEarthModeConfig', SunEarthModeConfig );

export default OrbitSceneFactory;