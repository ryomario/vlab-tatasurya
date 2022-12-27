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
import OldBodyConfiguration from "../../common/model/BodyConfiguration.js";
import LabTatasuryaModel from "../../common/model/LabTatasuryaModel.js";
import ModeConfig from "../../common/model/ModeConfig.js";
import SceneFactory from "../../common/SceneFactory.js";
import labTatasurya from "../../labTatasurya.js";
import rotasi_png from "../../../images/Rotasi & Revolusi_png.js";
import sun_png from "../../../images/Matahari_png.js";
import earth_png from "../../../images/Bumi_png.js";
import { Color, Line, Text } from "../../../../scenery/js/imports.js";
import VectorNode from "../../common/view/VectorNode.js";
import Body, { BodyOptions } from "../../common/model/Body.js";
import BodyRenderer, { ImageRenderer } from "../../common/view/BodyRenderer.js";
import Property from "../../../../axon/js/Property.js";
import Pair from "../../common/model/Pair.js";
import RotasiScene from "./RotasiScene.js";
import TProperty from "../../../../axon/js/TProperty.js";
import DerivedProperty from "../../../../axon/js/DerivedProperty.js";
import LabTatasuryaStrings from "../../LabTatasuryaStrings.js";
import GravityAndOrbitsClock from "../../../../gravity-and-orbits/js/common/model/GravityAndOrbitsClock.js";
import Utils from "../../../../dot/js/Utils.js";
import StringUtils from "../../../../phetcommon/js/util/StringUtils.js";
import StringIO from "../../../../tandem/js/types/StringIO.js";
import LabTatasuryaColors from "../../common/LabTatasuryaColors.js";
import Vector2Property from "../../../../dot/js/Vector2Property.js";
import NumberProperty from "../../../../axon/js/NumberProperty.js";
import RewindableProperty from "../../../../gravity-and-orbits/js/common/model/RewindableProperty.js";
import Vector2 from "../../../../dot/js/Vector2.js";

// constants
const SUN_RADIUS_MULTIPLIER = 50; // sun radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
const EARTH_MOON_RADIUS_MULTIPLIER = 2000; // earth and moon radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand

/**
 * Convenience function that converts days to seconds, using days * hoursPerDay * minutesPerHour * secondsPerMinute
 */
const daysToSeconds = ( days: number ) => days * 24 * 60 * 60;

class RotasiRevolusiSceneFactory extends SceneFactory {

    public constructor( model: LabTatasuryaModel, modelTandem: Tandem, viewTandem: Tandem ) {
        super(
            model,
            modelTandem, viewTandem, {
                sunEarth: new SunEarthModeConfig(),
            }
        );

        const SUN_MODES_VELOCITY_SCALE = 4.48E6;

        const rotasiScene = new EarthRotationConfig();

        rotasiScene.center();

        const starPlanetSceneTandem = modelTandem.createTandem( 'rotasiScene' );

        const star = new Star( model, rotasiScene.sun, starPlanetSceneTandem.createTandem( 'star' ), {
            maxPathLength: 345608942000, // in km
            massSettable: false,
        } );

        const planet = new Planet(
            model,
            rotasiScene.planet,
            starPlanetSceneTandem.createTandem( 'planet' ),
            {
                massSettable: false,
                massReadoutBelow: false,
                rotationPeriod: rotasiScene.planet.rotationPeriod
            }
        );
        planet.showShade = true;

        // planet.createRenderer = ( viewDiameter: number ): BodyRenderer => {
        //     const renderer = getImageWithShadowRenderer(
        //         rotasiScene.planet.planetImage,
        //         planet.rotationProperty,
        //         star.positionProperty
        //     );
        //     return renderer( planet, viewDiameter );
        // };

        const pairs: Pair[] = [];


        pairs.push(
            new Pair( star, planet, starPlanetSceneTandem.createTandem( 'starPlanet'+'Pair' ) )
        );

        this.scenes.unshift( new RotasiScene(
            model,
            rotasiScene,
            scaledDays,
            this.createIconImage( [ rotasi_png ], [ new Text( LabTatasuryaStrings.allPlanets, { fill: LabTatasuryaColors.foregroundProperty } ) ] ),
            SUN_MODES_VELOCITY_SCALE,
            LabTatasuryaConstants.EARTH_PERIHELION,
            starPlanetSceneTandem,
            viewTandem.createTandem( LabTatasuryaConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'rotasiSceneView' ),
            [ star, planet ],
            pairs,
            {
                timeSpeedScale: 0.01,
                // xShadowEnd: rotasiScene.planet.x,
            }
        ) );

        this.scenes.forEach( scene => {
            scene.massControlPanel?.setVisible( false );
        } );
    }
}

labTatasurya.register( 'RotasiRevolusiSceneFactory', RotasiRevolusiSceneFactory );

/**
 * Have to artificially scale up the time readout so that Sun/Earth/Moon scene has a stable orbit with correct periods
 */
 const scaledDays = ( timeProperty: TProperty<number>, tandem: Tandem ) => {
    return new DerivedProperty( [
        timeProperty,
        LabTatasuryaStrings.earthDaysStringProperty,
        LabTatasuryaStrings.pattern[ '0value' ][ '1unitsStringProperty' ]
    ], ( time, earthDaysString, patternString ) => {
        const value = ( time / GravityAndOrbitsClock.SECONDS_PER_DAY );
        const fixedValue = Utils.toFixed( value, 0 );
        return StringUtils.fillIn( patternString, { value:fixedValue, unit:earthDaysString } );
    }, {
        tandem: tandem,
        phetioValueType: StringIO
    } );
};

class BodyConfiguration extends OldBodyConfiguration {
    public readonly planetImage: HTMLImageElement;

    constructor( mass: number, radius: number, x: number, y: number, vx: number, vy: number, planetImage: HTMLImageElement, providedOptions?: Object ) {
        super( mass, radius, x, y, vx, vy, providedOptions );

        this.planetImage = planetImage;
    }
}

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

        this.massSettable = false;
    }
}

labTatasurya.register( 'SunEarthModeConfig', SunEarthModeConfig );

class EarthRotationConfig extends ModeConfig {
    public readonly sun: BodyConfiguration;
    public readonly planet: BodyConfiguration;

    public constructor() {
        super( 4 );

        const starPlanetDistance = LabTatasuryaConstants.EARTH_PERIHELION;

        this.sun = new BodyConfiguration(
            LabTatasuryaConstants.SUN_MASS,
            LabTatasuryaConstants.SUN_RADIUS * SUN_RADIUS_MULTIPLIER * 3,
            starPlanetDistance,
            0,
            0,
            0,
            sun_png,
            {
                bodyName: 'Sun'
            }
        );
        this.sun.isMovable = false;

        this.planet = new BodyConfiguration(
            LabTatasuryaConstants.EARTH_MASS,
            LabTatasuryaConstants.EARTH_RADIUS * EARTH_MOON_RADIUS_MULTIPLIER,
            0,
            0,
            0,
            -LabTatasuryaConstants.EARTH_ORBITAL_SPEED_AT_PERIHELION,
            earth_png,
            {
                bodyName: 'Earth',
                rotationPeriod: LabTatasuryaConstants.EARTH_ROTATION_PERIOD,
                timeSpeedScale: 1
            }
        );
        this.planet.isMovable = false;

        this.initialMeasuringTapePosition = new Line(
            0, 0, 0, 0
        );
        this.forceScale = VectorNode.FORCE_SCALE * 120;
    }

    protected getBodies(): BodyConfiguration[] {
        return [ this.sun, this.planet ];
    }
}
labTatasurya.register( 'EarthRotationConfig', EarthRotationConfig );


/**
 * Creates a BodyRenderer that just shows the specified image
 */
const getImageRenderer = ( image: HTMLImageElement ) => {
    return ( body: Body, viewDiameter: number ) => new ImageRenderer( body, viewDiameter, image );
};
// const getImageWithShadowRenderer = ( image: HTMLImageElement, rotationProperty: RewindableProperty<number>, lightPositionProperty: RewindableProperty<Vector2> ) => {
//     return ( body: Body, viewDiameter: number ) => new ShadowableBodyRenderer(
//         body,

//     );
// };

type PlanetOptions = BodyOptions;

class Planet extends Body {

  /**
   * @param model
   * @param bodyConfiguration
   * @param tandem
   * @param [providedOptions]
   */
  public constructor( model: LabTatasuryaModel, bodyConfiguration: BodyConfiguration, tandem: Tandem, options?: PlanetOptions ) {
    super(
      '',
      bodyConfiguration,
      Color.gray,
      Color.lightGray,
      getImageRenderer( bodyConfiguration.planetImage ),
      -Math.PI / 4,
      bodyConfiguration.mass,
      new Property( bodyConfiguration.bodyName, { phetioReadOnly: true } ),
      model,
      tandem,
      options
    );
  }
}

class Star extends Body {

    public constructor( model: LabTatasuryaModel, bodyConfiguration: BodyConfiguration, tandem: Tandem, options?: BodyOptions ) {
        super(
            'star',
            bodyConfiguration,
            Color.yellow,
            Color.white,
            getImageRenderer( bodyConfiguration.planetImage ),
            -Math.PI / 4,
            bodyConfiguration.mass,
            new Property( bodyConfiguration.bodyName, { phetioReadOnly: true } ),
            model,
            tandem,
            options
        );
    }
}

export default RotasiRevolusiSceneFactory;