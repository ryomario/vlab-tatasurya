// Copyright 2022, University of Colorado Boulder

/**
 * SceneFactory enumerates and declares the posible modes in the LabTatasuryaModel, such as 'Star + Planet' scene.
 * Models (and the bodies they contain) are created in SceneFactory.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * 
 * @author Mario (Software Engineer)
 */

import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import { Color, HBox, Image, Line, Node, Text } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import LabTatasuryaConstants from './LabTatasuryaConstants.js';
import sun_png from '../../images/Matahari_png.js';
import moon_png from '../../images/Bulan_png.js';
import mercury_png from '../../images/Merkurius_png.js';
import venus_png from '../../images/Venus_png.js';
import earth_png from '../../images/Bumi_png.js';
import mars_png from '../../images/Mars_png.js';
import jupiter_png from '../../images/Jupiter_png.js';
import saturn_png from '../../images/Saturnus_png.js';
import uranus_png from '../../images/Uranus_png.js';
import neptune_png from '../../images/Neptunus_png.js';
import allPlanet_png from '../../images/allPlanets_png.js';
import planetGeneric_png from '../../images/Bulan_png.js';
import LabTatasuryaStrings from '../LabTatasuryaStrings.js';
import TProperty from '../../../axon/js/TProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import GravityAndOrbitsClock from '../../../gravity-and-orbits/js/common/model/GravityAndOrbitsClock.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import Utils from '../../../dot/js/Utils.js';
import StringIO from '../../../tandem/js/types/StringIO.js';
import labTatasurya from '../labTatasurya.js';
import LabTatasuryaScene from './LabTatasuryaScene.js';
import VectorNode from './view/VectorNode.js';
import LabTatasuryaModel from './model/LabTatasuryaModel.js';
import BodyNode from './view/BodyNode.js';
import EarthMassReadoutNode from './view/EarthMassReadoutNode.js';
import Pair from './model/Pair.js';
import ModeConfig from './model/ModeConfig.js';
import OldBodyConfiguration from './model/BodyConfiguration.js';
import { ImageRenderer, SwitchableBodyRenderer } from './view/BodyRenderer.js';
import Body, { BodyOptions } from './model/Body.js';
import Property from '../../../axon/js/Property.js';
import Scene from './Scene.js';
import MorePlanetsScene from './MorePlanetsScene.js';
import LabTatasuryaColors from './LabTatasuryaColors.js';

// CONSTANTS
const FORCE_SCALE = VectorNode.FORCE_SCALE;

type PlanetName = 'all' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

type SelfOptions = {
    allPlanet?: AllPlanetModeConfig | null;
    planetVisibility?: PlanetName[];
    sunMercury?: SunMercuryModeConfig | null;
    sunEarth?: SunEarthModeConfig | null;
    adjustMoonPathLength?: boolean;
    adjustMoonOrbit?: boolean;
};

type SceneFactoryOptions = SelfOptions;

class SceneFactory {
    public readonly scenes: Scene[];
    public static SunMercuryModeConfig: typeof SunMercuryModeConfig;
    public static SunEarthModeConfig: typeof SunEarthModeConfig;
    public static AllPlanetModeConfig: typeof AllPlanetModeConfig;

    public constructor( model: LabTatasuryaModel, modelTandem: Tandem, viewTandem: Tandem, providedOptions?: SceneFactoryOptions ) {
        const options = optionize<SceneFactoryOptions, SelfOptions>()( {
            allPlanet: null,
            sunMercury: null,
            sunEarth: null,
            planetVisibility: ['earth'],

            adjustMoonPathLength: false, // increase the moon path so that it matches other traces at default settings
            adjustMoonOrbit: false,
        }, providedOptions );

        this.scenes = [];

        options.allPlanet?.center();
        options.sunMercury?.center();
        options.sunEarth?.center();

        const readoutInEarthMasses = ( bodyNode: BodyNode, visibleProperty: TReadOnlyProperty<boolean> ) => new EarthMassReadoutNode( bodyNode, visibleProperty );

        // Create the actual modes (GravityAndOrbitsModes) from the specifications passed in (ModeConfigs).
        const SUN_MODES_VELOCITY_SCALE = 4.48E6;
        if ( options.allPlanet ) {
            const starPlanetSceneTandem = modelTandem.createTandem( 'allPlanetsScene' );

            const star = new Star( model, options.allPlanet.sun, starPlanetSceneTandem.createTandem( 'star' ), {
                maxPathLength: 345608942000, // in km
                massSettable: false,
            } );
            const planets: Planet[] = [];
            const pairs: Pair[] = [];

            options.allPlanet.planets.forEach( ( planetConf, idx ) => {
                const planet = new Planet(
                    model,
                    planetConf,
                    starPlanetSceneTandem.createTandem( 'planet'+idx ),
                    {
                        massSettable: false,
                        massReadoutBelow: false,
                    }
                );

                planets.push( planet );
                pairs.push(
                    new Pair( star, planet, starPlanetSceneTandem.createTandem( 'planet'+idx+'Pair' ) )
                );
            } );

            this.scenes.push( new MorePlanetsScene(
                model,
                options.allPlanet,
                scaledDays,
                this.createIconImage( [ allPlanet_png ], [ new Text( LabTatasuryaStrings.allPlanets, { fill: LabTatasuryaColors.foregroundProperty } ) ] ),
                SUN_MODES_VELOCITY_SCALE,
                options.allPlanet.planets[2].x,
                starPlanetSceneTandem,
                viewTandem.createTandem( LabTatasuryaConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'allPlanetSceneView' ),
                [ star, ...planets ],
                pairs
            ) );
        }

        if ( options.sunMercury ) {
            const starPlanetSceneTandem = modelTandem.createTandem( 'suhMercuryScene' );
    
            const star0 = new Star( model, options.sunMercury.sun, starPlanetSceneTandem.createTandem( 'star' ), {
                maxPathLength: 345608942000 // in km
            } );
            const planet0 = new Planet( model, options.sunMercury.planet, starPlanetSceneTandem.createTandem( 'planet' ) );
    
            this.scenes.push( new LabTatasuryaScene(
                model,
                options.sunMercury,
                scaledDays,
                this.createIconImage( [ sun_png, mercury_png ], [ new Text( LabTatasuryaStrings.mercury, { fill: LabTatasuryaColors.foregroundProperty } ) ] ),
                SUN_MODES_VELOCITY_SCALE,
                readoutInEarthMasses,
                options.sunMercury.planet.x / 2,
                starPlanetSceneTandem,
                viewTandem.createTandem( LabTatasuryaConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'starPlanetSceneView' ),
                [ star0, planet0 ],
                [ new Pair( star0, planet0, starPlanetSceneTandem.createTandem( 'starPlanetPair' ) ) ]
            ) );
        }
        if ( options.sunEarth ) {
            const starPlanetSceneTandem = modelTandem.createTandem( 'suhEarthScene' );
    
            const star0 = new Star( model, options.sunEarth.sun, starPlanetSceneTandem.createTandem( 'star' ), {
                maxPathLength: 345608942000 // in km
            } );
            const planet0 = new Planet( model, options.sunEarth.planet, starPlanetSceneTandem.createTandem( 'planet' ) );
    
            this.scenes.push( new LabTatasuryaScene(
                model,
                options.sunEarth,
                scaledDays,
                this.createIconImage( [ sun_png, earth_png ], [ new Text( LabTatasuryaStrings.earth, { fill: LabTatasuryaColors.foregroundProperty } ) ] ),
                SUN_MODES_VELOCITY_SCALE,
                readoutInEarthMasses,
                options.sunEarth.planet.x / 2,
                starPlanetSceneTandem,
                viewTandem.createTandem( LabTatasuryaConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'starPlanetSceneView' ),
                [ star0, planet0 ],
                [ new Pair( star0, planet0, starPlanetSceneTandem.createTandem( 'starPlanetPair' ) ) ]
            ) );
        }


    }

    /**
     * Creates an image that can be used for the scene icon, showing the nodes of each body in the mode.
     */
    private createIconImage( images: HTMLImageElement[], nodes?: Node[] ): Node {
        const children: Node[] = [];
        images.forEach( image => children.push( new Image( image ) ) );

        for ( let i = 0; i < children.length; i++ ) {
            children[ i ].setScaleMagnitude( 25 / children[ i ].width );
        }
        for ( let i = 0; nodes && i < nodes.length; i++ ) {
            children.push( nodes[ i ] );
        }

        return new HBox( { children: children, spacing: 20 } );
    }
}

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

const getSpeedAtPerihelion = ( R2: number ) => {
    const v1 = LabTatasuryaConstants.EARTH_ORBITAL_SPEED_AT_PERIHELION;
    const R1 = LabTatasuryaConstants.EARTH_PERIHELION;
    return Math.sqrt( R1 / R2 ) * v1;
}

class BodyConfiguration extends OldBodyConfiguration {
    public readonly planetImage: HTMLImageElement;

    constructor( mass: number, radius: number, x: number, y: number, vx: number, vy: number, planetImage: HTMLImageElement, providedOptions?: Object ) {
        super( mass, radius, x, y, vx, vy, providedOptions );

        this.planetImage = planetImage;
    }
}

class AllPlanetModeConfig extends ModeConfig {
    public readonly sun: BodyConfiguration;
    public readonly planets: BodyConfiguration[];

    public constructor() {
        super( 0.5 );

        this.sun = new BodyConfiguration(
            LabTatasuryaConstants.SUN_MASS,
            LabTatasuryaConstants.SUN_RADIUS,
            0, 0, 0, 0,
            sun_png,
            {
                bodyName: 'Sun',
            }
        );

        this.planets = [];

        // Merkurius
        const mercuryPerihelion = LabTatasuryaConstants.EARTH_PERIHELION * 0.3;
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.MERCURY_MASS,
            LabTatasuryaConstants.MERCURY_RADIUS * 2,
            mercuryPerihelion,
            0,
            0,
            // LabTatasuryaConstants.MERCURY_ORBITAL_SPEED_AT_PERIHELION,
            getSpeedAtPerihelion( mercuryPerihelion ),
            mercury_png,
            {
                bodyName: 'Merkurius',
                rotationPeriod: LabTatasuryaConstants.MERCURY_ROTATION_PERIOD
            }
        ) );
        // Venus
        const venusPerihelion = LabTatasuryaConstants.EARTH_PERIHELION * 0.7;
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.VENUS_MASS,
            LabTatasuryaConstants.VENUS_RADIUS * 1.5,
            venusPerihelion,
            0,
            0,
            // LabTatasuryaConstants.VENUS_ORBITAL_SPEED_AT_PERIHELION,
            getSpeedAtPerihelion( venusPerihelion ),
            venus_png,
            {
                bodyName: 'Venus',
                rotationPeriod: LabTatasuryaConstants.VENUS_ROTATION_PERIOD
            }
        ) );
        // Bumi
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.EARTH_MASS,
            LabTatasuryaConstants.EARTH_RADIUS * 1.5,
            LabTatasuryaConstants.EARTH_PERIHELION,
            0,
            0,
            LabTatasuryaConstants.EARTH_ORBITAL_SPEED_AT_PERIHELION,
            earth_png,
            {
                bodyName: 'Bumi',
                rotationPeriod: LabTatasuryaConstants.EARTH_ROTATION_PERIOD
            }
        ) );
        // Mars
        const marsPerihelion = LabTatasuryaConstants.EARTH_PERIHELION * 1.3;
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.MARS_MASS,
            LabTatasuryaConstants.MARS_RADIUS * 2,
            marsPerihelion,
            0,
            0,
            // LabTatasuryaConstants.MARS_ORBITAL_SPEED_AT_PERIHELION,
            getSpeedAtPerihelion( marsPerihelion ),
            mars_png,
            {
                bodyName: 'Mars',
                rotationPeriod: LabTatasuryaConstants.MARS_ROTATION_PERIOD
            }
        ) );
        // Jupiter
        const jupiterPerihelion = LabTatasuryaConstants.EARTH_PERIHELION * 2;
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.JUPITER_MASS,
            LabTatasuryaConstants.JUPITER_RADIUS * 0.3,
            jupiterPerihelion,
            0,
            0,
            // LabTatasuryaConstants.JUPITER_ORBITAL_SPEED_AT_PERIHELION / 0.5,
            getSpeedAtPerihelion( jupiterPerihelion ),
            jupiter_png,
            {
                bodyName: 'Jupiter',
                rotationPeriod: LabTatasuryaConstants.JUPITER_ROTATION_PERIOD
            }
        ) );
        // Saturnus
        const saturnPerihelion = LabTatasuryaConstants.EARTH_PERIHELION * 2.7;
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.SATURN_MASS * 0.5,
            LabTatasuryaConstants.SATURN_RADIUS * 0.3,
            saturnPerihelion,
            0,
            0,
            // LabTatasuryaConstants.SATURN_ORBITAL_SPEED_AT_PERIHELION / 0.5,
            getSpeedAtPerihelion( saturnPerihelion ),
            saturn_png,
            {
                bodyName: 'Saturnus',
                rotationPeriod: LabTatasuryaConstants.SATURN_ROTATION_PERIOD
            }
        ) );
        // Uranus
        const uranusPerihelion = LabTatasuryaConstants.EARTH_PERIHELION * 3.1;
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.URANUS_MASS * 0.5,
            LabTatasuryaConstants.URANUS_RADIUS * 0.3,
            uranusPerihelion,
            0,
            0,
            // LabTatasuryaConstants.URANUS_ORBITAL_SPEED_AT_PERIHELION / 0.5,
            getSpeedAtPerihelion( uranusPerihelion ),
            uranus_png,
            {
                bodyName: 'Uranus',
                rotationPeriod: LabTatasuryaConstants.URANUS_ROTATION_PERIOD
            }
        ) );
        // Neptunus
        const neptunePerihelion = LabTatasuryaConstants.EARTH_PERIHELION * 3.56;
        this.planets.push( new BodyConfiguration(
            LabTatasuryaConstants.NEPTUNE_MASS * 0.5,
            LabTatasuryaConstants.NEPTUNE_RADIUS * 0.3,
            neptunePerihelion,
            0,
            0,
            // LabTatasuryaConstants.NEPTUNE_ORBITAL_SPEED_AT_PERIHELION / 0.5,
            getSpeedAtPerihelion( neptunePerihelion ),
            neptune_png,
            {
                bodyName: 'Neptunus',
                rotationPeriod: LabTatasuryaConstants.NEPTUNE_ROTATION_PERIOD
            }
        ) );

        this.initialMeasuringTapePosition = new Line(
            // ( this.sun.x + this.planets[this.planets.length - 1].x ) / 3, // x start from
            // -this.planets[this.planets.length - 1].x / 2,
            // ( this.sun.x + this.planets[this.planets.length - 1].x ) / 3 + 8E7 * 1000,
            // -this.planets[this.planets.length - 1].x / 2
            0, 0, 0, 0
        );

        this.forceScale = FORCE_SCALE * 120;
    }

    protected getBodies(): BodyConfiguration[] {
        return [ this.sun, ...this.planets ];
    }
}

class SunMercuryModeConfig extends ModeConfig {
    public readonly sun: BodyConfiguration;
    public readonly planet: BodyConfiguration;

    public constructor() {
        super( 1.25 );

        this.sun = new BodyConfiguration(
            LabTatasuryaConstants.SUN_MASS,
            LabTatasuryaConstants.SUN_RADIUS,
            0, 0, 0, 0,
            sun_png
        );
        this.planet = new BodyConfiguration(
            LabTatasuryaConstants.MERCURY_MASS,
            LabTatasuryaConstants.MERCURY_RADIUS,
            LabTatasuryaConstants.MERCURY_PERIHELION,
            0,
            0,
            LabTatasuryaConstants.MERCURY_ORBITAL_SPEED_AT_PERIHELION,
            mercury_png
        );
        this.initialMeasuringTapePosition = new Line(
            0,0,0,0
        );
        this.forceScale = FORCE_SCALE * 120;
    }

    protected getBodies(): BodyConfiguration[] {
        return [ this.sun, this.planet ];
    }
}
class SunEarthModeConfig extends ModeConfig {
    public readonly sun: BodyConfiguration;
    public readonly planet: BodyConfiguration;

    public constructor() {
        super( 1.25 );

        this.sun = new BodyConfiguration(
            LabTatasuryaConstants.SUN_MASS,
            LabTatasuryaConstants.SUN_RADIUS,
            0, 0, 0, 0,
            sun_png
        );
        this.planet = new BodyConfiguration(
            LabTatasuryaConstants.EARTH_MASS,
            LabTatasuryaConstants.EARTH_RADIUS,
            LabTatasuryaConstants.EARTH_PERIHELION,
            0,
            0,
            LabTatasuryaConstants.EARTH_ORBITAL_SPEED_AT_PERIHELION,
            earth_png
        );
        this.initialMeasuringTapePosition = new Line(
            ( this.sun.x + this.planet.x ) / 3, // x start from
            -this.planet.x / 2, // y start from
            ( this.sun.x + this.planet.x ) / 3 + 8E7 * 1000, // initial measuring tape to 8E7 or 80000000 kilometers (in meters multiplied by 1000)
            -this.planet.x / 2
        );
        this.forceScale = FORCE_SCALE * 120;
    }

    protected getBodies(): BodyConfiguration[] {
        return [ this.sun, this.planet ];
    }
}


/**
 * Creates a BodyRenderer that just shows the specified image
 */
const getImageRenderer = ( image: HTMLImageElement ) => {
    return ( body: Body, viewDiameter: number ) => new ImageRenderer( body, viewDiameter, image );
};

/**
 * Creates a BodyRenderer that shows an image when at the targetMass, otherwise shows a shaded sphere
 */
const getSwitchableRenderer = ( image1: HTMLImageElement, image2: HTMLImageElement, targetMass: number ) => {
    // the mass for which to use the image
    return ( body: Body, viewDiameter: number ) => new SwitchableBodyRenderer(
        body,
        targetMass,
        new ImageRenderer( body, viewDiameter, image1 ), new ImageRenderer( body, viewDiameter, image2 ) );
};


  
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
      getSwitchableRenderer( bodyConfiguration.planetImage, moon_png, bodyConfiguration.mass ),
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

SceneFactory.SunMercuryModeConfig = SunMercuryModeConfig;
SceneFactory.SunEarthModeConfig = SunEarthModeConfig;
SceneFactory.AllPlanetModeConfig = AllPlanetModeConfig;

labTatasurya.register( 'SceneFactory', SceneFactory );
export default SceneFactory;