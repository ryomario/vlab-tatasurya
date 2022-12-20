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
import LabTatasuryaConstants from "../../common/LabTatasuryaConstants.js";
import LabTatasuryaModel from "../../common/model/LabTatasuryaModel.js";
import SceneFactory from "../../common/SceneFactory.js";
import labTatasurya from "../../labTatasurya.js";

// constants
const SUN_RADIUS_MULTIPLIER = 50; // sun radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
const SUN_MERCURY_RADIUS_MULTIPLIER = 2000;
const SUN_EARTH_RADIUS_MULTIPLIER = 1500;
const SUN_VENUS_RADIUS_MULTIPLIER = 1700;
const SUN_MARS_RADIUS_MULTIPLIER = 2000;
const SUN_JUPITER_RADIUS_MULTIPLIER = 1000;
const ALL_PLANETS_RADIUS_MULTIPLIER = 1000;

/**
 * Convenience function that converts days to seconds, using days * hoursPerDay * minutesPerHour * secondsPerMinute
 */
const daysToSeconds = ( days: number ) => days * 24 * 60 * 60;

class PlanetTatasuryaSceneFactory extends SceneFactory {

    public constructor( model: LabTatasuryaModel, modelTandem: Tandem, viewTandem: Tandem ) {
        super(
            model,
            modelTandem, viewTandem, {
                sunMercury: new SunMercuryModeConfig(),
                sunVenus: new SunVenusModeConfig(),
                sunEarth: new SunEarthModeConfig(),
                sunMars: new SunMarsModeConfig(),
                sunJupiter: new SunJupiterModeConfig(),
                allPlanet: new AllPlanetModeConfig(),
            }
        );
    }
}

labTatasurya.register( 'PlanetTatasuryaSceneFactory', PlanetTatasuryaSceneFactory );

/**
 * Model configuration for a system with the sun and the earth.
 */
 class AllPlanetModeConfig extends SceneFactory.AllPlanetModeConfig {
    public constructor() {
        super();
        this.sun.radius *= SUN_RADIUS_MULTIPLIER;
        this.planets.forEach( (planetConf, idx ) => {
            planetConf.radius *= ALL_PLANETS_RADIUS_MULTIPLIER;
        } );

        // Sun shouldn't move in model modes
        this.sun.isMovable = false;
    }
}

labTatasurya.register( 'AllPlanetModeConfig', AllPlanetModeConfig );

/**
 * Model configuration for a system with the sun and the mercury.
 */
 class SunMercuryModeConfig extends SceneFactory.SunMercuryModeConfig {
    public constructor() {
        super();
        this.sun.radius *= SUN_RADIUS_MULTIPLIER;
        this.planet.radius *= SUN_MERCURY_RADIUS_MULTIPLIER;

        // Sun shouldn't move in model modes
        this.sun.isMovable = false;
        this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
    }
}

/**
 * Model configuration for a system with the sun and the venus.
 */
 class SunVenusModeConfig extends SceneFactory.SunVenusModeConfig {
    public constructor() {
        super();
        this.sun.radius *= SUN_RADIUS_MULTIPLIER;
        this.planet.radius *= SUN_VENUS_RADIUS_MULTIPLIER;

        // Sun shouldn't move in model modes
        this.sun.isMovable = false;
        this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
    }
}

labTatasurya.register( 'SunVenusModeConfig', SunVenusModeConfig );

/**
 * Model configuration for a system with the sun and the earth.
 */
class SunEarthModeConfig extends SceneFactory.SunEarthModeConfig {
    public constructor() {
        super();
        this.sun.radius *= SUN_RADIUS_MULTIPLIER;
        this.planet.radius *= SUN_EARTH_RADIUS_MULTIPLIER;

        // Sun shouldn't move in model modes
        this.sun.isMovable = false;
        this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
    }
}

labTatasurya.register( 'SunEarthModeConfig', SunEarthModeConfig );

/**
 * Model configuration for a system with the sun and the earth.
 */
 class SunMarsModeConfig extends SceneFactory.SunMarsModeConfig {
    public constructor() {
        super();
        this.sun.radius *= SUN_RADIUS_MULTIPLIER;
        this.planet.radius *= SUN_MARS_RADIUS_MULTIPLIER;

        // Sun shouldn't move in model modes
        this.sun.isMovable = false;
        this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
    }
}

labTatasurya.register( 'SunMarsModeConfig', SunMarsModeConfig );

/**
 * Model configuration for a system with the sun and the earth.
 */
 class SunJupiterModeConfig extends SceneFactory.SunJupiterModeConfig {
    public constructor() {
        super();
        this.sun.radius *= SUN_JUPITER_RADIUS_MULTIPLIER / 2;
        this.planet.radius *= SUN_JUPITER_RADIUS_MULTIPLIER;

        // Sun shouldn't move in model modes
        this.sun.isMovable = false;
        this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
    }
}

labTatasurya.register( 'SunJupiterModeConfig', SunJupiterModeConfig );

export default PlanetTatasuryaSceneFactory;