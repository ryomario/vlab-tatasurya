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
import { Color, HBox, Image, Line, Node } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import LabTatasuryaConstants from './LabTatasuryaConstants.js';
import sun_png from '../../images/Matahari_png.js';
import earth_png from '../../images/Bumi_png.js';
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
import BodyConfiguration from './model/BodyConfiguration.js';
import { ImageRenderer, SwitchableBodyRenderer } from './view/BodyRenderer.js';
import Body, { BodyOptions } from './model/Body.js';

// CONSTANTS
const FORCE_SCALE = VectorNode.FORCE_SCALE;

type SelfOptions = {
    sunEarth?: SunEarthModeConfig;
    adjustMoonPathLength?: boolean;
    adjustMoonOrbit?: boolean;
};

type SceneFactoryOptions = SelfOptions;

class SceneFactory {
    public readonly scenes: LabTatasuryaScene[];
    public static SunEarthModeConfig: typeof SunEarthModeConfig;

    public constructor( model: LabTatasuryaModel, modelTandem: Tandem, viewTandem: Tandem, providedOptions?: SceneFactoryOptions ) {
        const options = optionize<SceneFactoryOptions, SelfOptions>()( {
            sunEarth: new SunEarthModeConfig(),
            adjustMoonPathLength: false, // increase the moon path so that it matches other traces at default settings
            adjustMoonOrbit: false,
        }, providedOptions );

        this.scenes = [];

        options.sunEarth.center();

        const readoutInEarthMasses = ( bodyNode: BodyNode, visibleProperty: TReadOnlyProperty<boolean> ) => new EarthMassReadoutNode( bodyNode, visibleProperty );

        // Create the actual modes (GravityAndOrbitsModes) from the specifications passed in (ModeConfigs).
        const SUN_MODES_VELOCITY_SCALE = 4.48E6;
        const starPlanetSceneTandem = modelTandem.createTandem( 'starPlanetScene' );

        const star0 = new Star( model, options.sunEarth.sun, starPlanetSceneTandem.createTandem( 'star' ), {
            maxPathLength: 345608942000 // in km
        } );
        const planet0 = new Planet( model, options.sunEarth.planet, starPlanetSceneTandem.createTandem( 'planet' ) );

        this.scenes.push( new LabTatasuryaScene(
            model,
            options.sunEarth,
            scaledDays,
            this.createIconImage( [ sun_png, earth_png ] ),
            SUN_MODES_VELOCITY_SCALE,
            readoutInEarthMasses,
            options.sunEarth.planet.x / 2,
            starPlanetSceneTandem,
            viewTandem.createTandem( LabTatasuryaConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'starPlanetSceneView' ),
            [ star0, planet0 ],
            [ new Pair( star0, planet0, starPlanetSceneTandem.createTandem( 'starPlanetPair' ) ) ]
        ) );


    }

    /**
     * Creates an image that can be used for the scene icon, showing the nodes of each body in the mode.
     */
    private createIconImage( images: HTMLImageElement[] ): Node {
        const children: Node[] = [];
        images.forEach( image => children.push( new Image( image ) ) );

        for ( let i = 0; i < children.length; i++ ) {
            children[ i ].setScaleMagnitude( 25 / children[ i ].width );
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
        return StringUtils.fillIn( patternString, { daysValue:fixedValue, daysString:earthDaysString } );
    }, {
        tandem: tandem,
        phetioValueType: StringIO
    } );
};
  

class SunEarthModeConfig extends ModeConfig {
    public readonly sun: BodyConfiguration;
    public readonly planet: BodyConfiguration;

    public constructor() {
        super( 1.25 );

        this.sun = new BodyConfiguration(
            LabTatasuryaConstants.SUN_MASS,
            LabTatasuryaConstants.SUN_RADIUS,
            0, 0, 0, 0
        );
        this.planet = new BodyConfiguration(
            LabTatasuryaConstants.EARTH_MASS,
            LabTatasuryaConstants.EARTH_RADIUS,
            LabTatasuryaConstants.EARTH_PERIHELION,
            0,
            0,
            LabTatasuryaConstants.EARTH_ORBITAL_SPEED_AT_PERIHELION
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
      'planet',
      bodyConfiguration,
      Color.gray,
      Color.lightGray,
      getSwitchableRenderer( earth_png, planetGeneric_png, bodyConfiguration.mass ),
      -Math.PI / 4,
      bodyConfiguration.mass,
      LabTatasuryaStrings.earthStringProperty,
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
            getImageRenderer( sun_png ),
            -Math.PI / 4,
            bodyConfiguration.mass,
            LabTatasuryaStrings.ourSunStringProperty,
            model,
            tandem,
            options
        );
    }
}

SceneFactory.SunEarthModeConfig = SunEarthModeConfig;

labTatasurya.register( 'SceneFactory', SceneFactory );
export default SceneFactory;