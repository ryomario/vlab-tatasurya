// Copyright 2022, STECHOQ TNS Ineffable team

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
 * @author Mario (Software Engineer)
 */

import BooleanProperty from "../../../../axon/js/BooleanProperty.js";
import EnumerationProperty from "../../../../axon/js/EnumerationProperty.js";
import NumberProperty from "../../../../axon/js/NumberProperty.js";
import Property from "../../../../axon/js/Property.js";
import TProperty from "../../../../axon/js/TProperty.js";
import TReadOnlyProperty from "../../../../axon/js/TReadOnlyProperty.js";
import Bounds2 from "../../../../dot/js/Bounds2.js";
import Vector2 from "../../../../dot/js/Vector2.js";
import Vector2Property from "../../../../dot/js/Vector2Property.js";
import optionize from "../../../../phet-core/js/optionize.js";
import ModelViewTransform2 from "../../../../phetcommon/js/view/ModelViewTransform2.js";
import TimeSpeed from "../../../../scenery-phet/js/TimeSpeed.js";
import { Node } from "../../../../scenery/js/imports.js";
import { PhetioObjectOptions } from "../../../../tandem/js/PhetioObject.js";
import Tandem from "../../../../tandem/js/Tandem.js";
import ReferenceIO from "../../../../tandem/js/types/ReferenceIO.js";
import IOType from "../../../../tandem/js/types/IOType.js";
import { LabTatasuryaSceneOptions } from "../../common/LabTatasuryaScene.js";
import Body from "../../common/model/Body.js";
import LabTatasuryaModel from "../../common/model/LabTatasuryaModel.js";
import LabTatasuryaPhysicsEngine from "../../common/model/LabTatasuryaPhysicsEngine.js";
import ModeConfig from "../../common/model/ModeConfig.js";
import Pair from "../../common/model/Pair.js";
import Scene from "../../common/Scene.js";
import BodyNode from "../../common/view/BodyNode.js";
import SceneView from "../../common/view/SceneView.js";
import Range from "../../../../dot/js/Range.js";
import GravityAndOrbitsClock from "../../../../gravity-and-orbits/js/common/model/GravityAndOrbitsClock.js";
import Multilink from "../../../../axon/js/Multilink.js";
import labTatasurya from "../../labTatasurya.js";
import RotasiSceneView from "../view/RotasiSceneView.js";
import merge from "../../../../phet-core/js/merge.js";

type SelfOptions = {
    dt?: number;
    gridCenter?: Vector2;
    timeSpeedScale?: number;
    xShadowEnd?: number;
};
type RotasiSceneOptions = SelfOptions & PhetioObjectOptions;

type RotasiSceneImplementationOptions = Pick<RotasiSceneOptions, 'dt' | 'gridCenter' | 'timeSpeedScale' | 'xShadowEnd' >;

 
class RotasiScene extends Scene {
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
    public readonly massReadoutFactory: (arg0: BodyNode, arg1: Property<boolean>) => Node;
    public readonly zoomLevelProperty: NumberProperty;
    public readonly velocityVectorScale: number;
    public readonly gridSpacing: number;
    public readonly gridCenter: Vector2;
    public readonly timeFormatter: (numberProperty: TProperty<number>, tandem: Tandem) => TReadOnlyProperty<string>;
    public readonly measuringTapeStartPointProperty: Vector2Property;
    public readonly measuringTapeEndPointProperty: Vector2Property;
    public readonly isPlayingProperty: BooleanProperty;
    public massControlPanel: Node | null;

    public readonly xShadowEnd: number;
    private readonly tandemName: string;
    private readonly dt: number;
    protected readonly deviatedFromDefaultsProperty: BooleanProperty;
    protected readonly rewindingProperty: BooleanProperty;
    protected readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

    public constructor( model: LabTatasuryaModel, modeConfig: ModeConfig,
        timeFormatter: ( numberProperty: TProperty<number>, tandem: Tandem ) => TReadOnlyProperty<string>,
        iconImage: Node, velocityVectorScale: number, gridSpacing: number, tandem: Tandem,
        sceneViewTandem: Tandem, bodies: Body[], pairs: Pair[], providedOptions?: RotasiSceneOptions ) {

        const forceScale = modeConfig.forceScale;
        const defaultZoomScale = modeConfig.zoom;
        const tandemName = tandem.name;
        const radioButtonTandemName = `${tandemName}RadioButton`;
        const resetButtonTandemName = `${tandemName}ResetButton`;

        model.showGridProperty.setInitialValue( true );
        model.showGridProperty.set( true );

        const options = optionize<RotasiSceneImplementationOptions>()( {
            gridCenter: new Vector2( 0, 0 ),
            dt: modeConfig.dt,
            timeSpeedScale: 1,
            xShadowEnd: 0,
        }, providedOptions );

        const gridCenter = options.gridCenter;
        const dt = options.dt;

        super( {
            phetioDocumentation: 'A group of orbital masses which can be selected',
            phetioType: ReferenceIO( IOType.ObjectIO ),
            phetioState: false,
            tandem: tandem
        } );

        this.xShadowEnd = options.xShadowEnd;
        this.massControlPanel = null;
        this.massControlPanelTandemName = '';
        
        this.activeProperty = new BooleanProperty( false );

        this.deviatedFromDefaultsProperty = new BooleanProperty( false, {
            tandem: tandem.createTandem( 'deviatedFromDefaultsProperty' ),
            phetioDocumentation: 'for internal PhET use only',
            phetioReadOnly: true
        } );

        const measuringTapePointOptions = {
            units: 'm',
        };

        const measuringTapeTandem = tandem.createTandem( 'measuringTape' );

        // @ts-expect-error
        this.measuringTapeStartPointProperty = new Vector2Property( modeConfig.initialMeasuringTapePosition.p1, merge( {
            tandem: measuringTapeTandem.createTandem( 'startPointProperty' )
        }, measuringTapePointOptions ) );
        // @ts-expect-error
        this.measuringTapeEndPointProperty = new Vector2Property( modeConfig.initialMeasuringTapePosition.p2, merge( {
            tandem: measuringTapeTandem.createTandem( 'endPointProperty' )
        }, measuringTapePointOptions ) );

        this.zoomLevelProperty = new NumberProperty( 1, {
            tandem: tandem.createTandem( 'zoomLevelProperty' ),
            range: new Range( 0.12, 3 ),
        } );

        this.radioButtonTandemName = radioButtonTandemName; // (read-only)
        this.resetButtonTandemName = resetButtonTandemName; // (read-only)
        this.tandemName = tandemName; // (read-only)

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

        this.massReadoutFactory = ( _, _1 ) => new Node();

        this.modelBoundsProperty = new Property<Bounds2 | null>( null );
        this.transformProperty = new Property( this.createTransform( defaultZoomScale, gridCenter ) );
        
        this.zoomLevelProperty.link( () => this.transformProperty.set( this.createTransform( defaultZoomScale, gridCenter ) ) );

        const clock = new GravityAndOrbitsClock( model.changeRewindValueProperty, dt, model.steppingProperty, this.timeSpeedProperty, tandem, tandem.createTandem( 'clock' ) );
        this.physicsEngine = new LabTatasuryaPhysicsEngine( clock, model.gravityEnabledProperty, false, options.timeSpeedScale );

        Multilink.multilink( [ model.isPlayingProperty, this.activeProperty ], ( playButtonPressed, active ) =>
            this.physicsEngine.clock.setRunning( playButtonPressed && active )
        );

        bodies.forEach( body => this.addBody( body ) );

        // {Node} - scenery node that depicts the play area for this scene
        this.sceneView = new RotasiSceneView( this, model, sceneViewTandem );

        // this.pairs = pairs;

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

labTatasurya.register( 'RotasiScene', RotasiScene );
export default RotasiScene;