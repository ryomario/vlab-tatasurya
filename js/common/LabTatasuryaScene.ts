// Copyright 2014-2022, University of Colorado Boulder

/**
 * A GravityAndOrbitsScene behaves like a screen, it has its own model, control panel, canvas, and remembers its state
 * when you leave and come back. It is created with defaults from SceneFactory.Mode.
 * <p/>
 * The sim was designed this way so that objects are replaced instead of mutated.
 * For instance, when switching from Mode 1 to Mode 2, instead of removing Mode 1 bodies from the model,
 * storing their state, and replacing with the Mode 2 bodies, this paradigm just replaces the entire model instance.
 * <p/>
 * The advantage of this approach is that model states, canvas states and control panels are always correct,
 * and it is impossible to end up with a bug in which you have a mixture of components from multiple modes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * 
 * @author Mario (Software Engineer)
 */

import BooleanProperty from "../../../axon/js/BooleanProperty.js";
import EnumerationProperty from "../../../axon/js/EnumerationProperty.js";
import Multilink from "../../../axon/js/Multilink.js";
import NumberProperty from "../../../axon/js/NumberProperty.js";
import Property from "../../../axon/js/Property.js";
import TProperty from "../../../axon/js/TProperty.js";
import TReadOnlyProperty from "../../../axon/js/TReadOnlyProperty.js";
import Bounds2 from "../../../dot/js/Bounds2.js";
import Range from "../../../dot/js/Range.js";
import Rectangle from "../../../dot/js/Rectangle.js";
import Vector2 from "../../../dot/js/Vector2.js";
import Vector2Property from "../../../dot/js/Vector2Property.js";
import GravityAndOrbitsClock from "../../../gravity-and-orbits/js/common/model/GravityAndOrbitsClock.js";
import merge from "../../../phet-core/js/merge.js";
import optionize from "../../../phet-core/js/optionize.js";
import ModelViewTransform2 from "../../../phetcommon/js/view/ModelViewTransform2.js";
import TimeSpeed from "../../../scenery-phet/js/TimeSpeed.js";
import { Node } from "../../../scenery/js/imports.js";
import { PhetioObjectOptions } from "../../../tandem/js/PhetioObject.js";
import Tandem from "../../../tandem/js/Tandem.js";
import IOType from "../../../tandem/js/types/IOType.js";
import ReferenceIO from "../../../tandem/js/types/ReferenceIO.js";
import labTatasurya from "../labTatasurya.js";
import LabTatasuryaConstants from "./LabTatasuryaConstants.js";
import Body from "./model/Body.js";
import LabTatasuryaModel from "./model/LabTatasuryaModel.js";
import LabTatasuryaPhysicsEngine from "./model/LabTatasuryaPhysicsEngine.js";
import ModeConfig from "./model/ModeConfig.js";
import Pair from "./model/Pair.js";
import Scene from "./Scene.js";
import BodyNode from "./view/BodyNode.js";
import LabTatasuryaSceneView from "./view/LabTatasuryaSceneView.js";
import SceneView from "./view/SceneView.js";

type SelfOptions = {
    adjustMoonOrbit?: boolean;
    dt?: number;
    gridCenter?: Vector2;
    adjustZoomRange?: boolean;
    timeSpeedScale?: number;
};
export type LabTatasuryaSceneOptions = SelfOptions & PhetioObjectOptions;
type MeasuringTapeOptions = {
    tandem?: Tandem;
    units?: string;
};

type LabTatasuryaSceneImplementationOptions = Pick<LabTatasuryaSceneOptions, 'adjustMoonOrbit' | 'dt' | 'gridCenter' | 'adjustZoomRange' | 'timeSpeedScale'>;

class LabTatasuryaScene extends Scene {
    public readonly activeProperty: BooleanProperty;
    public readonly iconImage: Node;
    public readonly modelBoundsProperty: Property<Bounds2 | null>;
    public readonly transformProperty: Property<ModelViewTransform2>;
    public readonly radioButtonTandemName: string;
    public readonly resetButtonTandemName: string;
    public readonly sceneView: SceneView;
    public readonly massControlPanelTandemName: string;
    public readonly forceScale: number;
    public readonly physicsEngine: LabTatasuryaPhysicsEngine;
    public readonly massReadoutFactory: ( arg0: BodyNode, arg1: Property<boolean> ) => Node;
    public readonly zoomLevelProperty: NumberProperty;
    public readonly velocityVectorScale: number;
    public readonly gridSpacing: number;
    public readonly gridCenter: Vector2;
    public readonly timeFormatter: ( numberProperty: TProperty<number>, tandem: Tandem ) => TReadOnlyProperty<string>;
    public readonly measuringTapeStartPointProperty: Vector2Property;
    public readonly measuringTapeEndPointProperty: Vector2Property;
    public readonly isPlayingProperty: BooleanProperty;
    public massControlPanel: Node | null;
  
    protected readonly deviatedFromDefaultsProperty: BooleanProperty;
    private readonly tandemName: string;
    private readonly dt: number;
    protected readonly rewindingProperty: BooleanProperty;
    protected readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
    private readonly pairs: Pair[];

    /**
     * @param model
     * @param modeConfig
     * @param timeFormatter
     * @param iconImage
     * @param velocityVectorScale
     * @param massReadoutFactory - returns a node for the representation
     * @param gridSpacing
     * @param tandem
     * @param sceneViewTandem
     * @param bodies
     * @param pairs
     * @param [providedOptions]
     */
    public constructor( model: LabTatasuryaModel, modeConfig: ModeConfig,
                        timeFormatter: ( numberProperty: TProperty<number>, tandem: Tandem ) => TReadOnlyProperty<string>,
                        iconImage: Node, velocityVectorScale: number,
                        massReadoutFactory: ( arg0: BodyNode, arg1: Property<boolean> ) => Node, gridSpacing: number, tandem: Tandem,
                        sceneViewTandem: Tandem, bodies: Body[], pairs: Pair[], providedOptions?: LabTatasuryaSceneOptions ) {
  
        const forceScale = modeConfig.forceScale;
        const initialMeasuringTapePosition = modeConfig.initialMeasuringTapePosition;
        const defaultZoomScale = modeConfig.zoom;
        const tandemName = tandem.name;
        const radioButtonTandemName = `${tandemName}RadioButton`;
        const resetButtonTandemName = `${tandemName}ResetButton`;
        const massControlPanelTandemName = `${tandemName}MassesControlPanel`;

        const options = optionize<LabTatasuryaSceneImplementationOptions>()( {
            gridCenter: new Vector2( 0, 0 ),
            dt: modeConfig.dt,
            adjustMoonOrbit: false,
            adjustZoomRange: false,
            timeSpeedScale: 1,
        }, providedOptions );
        const gridCenter = options.gridCenter;
        const dt = options.dt;
        
        super( {
            phetioDocumentation: 'A group of orbital masses which can be selected',
            phetioType: ReferenceIO( IOType.ObjectIO ),
            phetioState: false,
            tandem: tandem
        } );

        this.massControlPanel = null;

        this.activeProperty = new BooleanProperty( false );

        this.deviatedFromDefaultsProperty = new BooleanProperty( false, {
            tandem: tandem.createTandem( 'deviatedFromDefaultsProperty' ),
            phetioDocumentation: 'for internal PhET use only',
            phetioReadOnly: true
        } );
        const measuringTapePointOptions: MeasuringTapeOptions = {
            units: 'm'
        };

        const measuringTapeTandem = tandem.createTandem( 'measuringTape' );

        // @ts-expect-error
        this.measuringTapeStartPointProperty = new Vector2Property( initialMeasuringTapePosition.p1, merge( {
            tandem: measuringTapeTandem.createTandem( 'startPointProperty' )
        }, measuringTapePointOptions ) );
        // @ts-expect-error
        this.measuringTapeEndPointProperty = new Vector2Property( initialMeasuringTapePosition.p2, merge( {
            tandem: measuringTapeTandem.createTandem( 'endPointProperty' )
        }, measuringTapePointOptions ) );
        let range = new Range( 0.12, 3 );
        if ( !options.adjustZoomRange ) range = LabTatasuryaConstants.ZOOM_RANGE;
        this.zoomLevelProperty = new NumberProperty( options.adjustZoomRange ? 2 : 1, {
            tandem: tandem.createTandem( 'zoomLevelProperty' ),
            range: range
        } );

        this.radioButtonTandemName = radioButtonTandemName; // (read-only)
        this.resetButtonTandemName = resetButtonTandemName; // (read-only)
        this.tandemName = tandemName; // (read-only)
        this.massControlPanelTandemName = massControlPanelTandemName; // (read-only)

        this.dt = dt;
        this.forceScale = forceScale!;
        this.iconImage = iconImage;

        this.isPlayingProperty = model.isPlayingProperty;

        // How much to scale (shrink or grow) the velocity vectors; a mapping from meters/second to stage coordinates
        this.velocityVectorScale = velocityVectorScale;
        this.gridSpacing = gridSpacing; // in meters
        this.gridCenter = gridCenter;
        this.rewindingProperty = model.rewindingProperty; // save a reference to the rewinding property of p
        this.timeSpeedProperty = model.timeSpeedProperty;
        this.timeFormatter = timeFormatter;

        // Function that creates a Node to readout the mass for the specified body node (with the specified visibility flag)
        this.massReadoutFactory = massReadoutFactory;

        this.modelBoundsProperty = new Property<Bounds2 | null>( null ); // needed for dragListener bounds
        this.transformProperty = new Property( this.createTransform( defaultZoomScale, gridCenter ) );

        this.zoomLevelProperty.link( () => this.transformProperty.set( this.createTransform( defaultZoomScale, gridCenter ) ) );

        const clock = new GravityAndOrbitsClock( model.changeRewindValueProperty, dt, model.steppingProperty, this.timeSpeedProperty, tandem, tandem.createTandem( 'clock' ) );
        this.physicsEngine = new LabTatasuryaPhysicsEngine( clock, model.gravityEnabledProperty, options.adjustMoonOrbit, options.timeSpeedScale );

        Multilink.multilink( [ model.isPlayingProperty, this.activeProperty ], ( playButtonPressed, active ) =>
            this.physicsEngine.clock.setRunning( playButtonPressed && active )
        );

        bodies.forEach( body => this.addBody( body ) );

        // {Node} - scenery node that depicts the play area for this scene
        this.sceneView = new LabTatasuryaSceneView( this, model, sceneViewTandem );

        this.pairs = pairs;

        // Save the new PhET-iO state as an initial configuration for this scene, but only if the state being set applies
        // to this scene.
        Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( ( state: Record<string, unknown> ) => {

            const phetioIDsToSet = Object.keys( state );
            for ( let i = 0; i < phetioIDsToSet.length; i++ ) {
                if ( phetioIDsToSet[ i ].startsWith( this.tandem.phetioID ) ) {
                    this.saveState();
                    break;
                }
            }
        } );
    }
}

labTatasurya.register( 'LabTatasuryaScene', LabTatasuryaScene );
export default LabTatasuryaScene;