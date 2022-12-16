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
import NumberProperty from "../../../axon/js/NumberProperty.js";
import Property from "../../../axon/js/Property.js";
import TProperty from "../../../axon/js/TProperty.js";
import TReadOnlyProperty from "../../../axon/js/TReadOnlyProperty.js";
import Bounds2 from "../../../dot/js/Bounds2.js";
import Rectangle from "../../../dot/js/Rectangle.js";
import Vector2 from "../../../dot/js/Vector2.js";
import Vector2Property from "../../../dot/js/Vector2Property.js";
import GravityAndOrbitsClock from "../../../gravity-and-orbits/js/common/model/GravityAndOrbitsClock.js";
import ModelViewTransform2 from "../../../phetcommon/js/view/ModelViewTransform2.js";
import TimeSpeed from "../../../scenery-phet/js/TimeSpeed.js";
import { Node } from "../../../scenery/js/imports.js";
import PhetioObject from "../../../tandem/js/PhetioObject.js";
import Tandem from "../../../tandem/js/Tandem.js";
import labTatasurya from "../labTatasurya.js";
import Body from "./model/Body.js";
import LabTatasuryaPhysicsEngine from "./model/LabTatasuryaPhysicsEngine.js";
import BodyNode from "./view/BodyNode.js";
import SceneView from "./view/SceneView.js";

// constants
const PLAY_AREA_WIDTH = SceneView.STAGE_SIZE.width;
const PLAY_AREA_HEIGHT = SceneView.STAGE_SIZE.height;

abstract class Scene extends PhetioObject {
    public abstract readonly activeProperty: BooleanProperty;
    public abstract readonly iconImage: Node;
    public abstract readonly modelBoundsProperty: Property<Bounds2 | null>;
    public abstract readonly transformProperty: Property<ModelViewTransform2>;
    public abstract readonly radioButtonTandemName: string;
    public abstract readonly resetButtonTandemName: string;
    public abstract readonly sceneView: SceneView;
    public abstract readonly massControlPanelTandemName: string;
    public abstract readonly forceScale: number;
    public abstract readonly physicsEngine: LabTatasuryaPhysicsEngine;
    public abstract readonly massReadoutFactory: ( arg0: BodyNode, arg1: Property<boolean> ) => Node;
    public abstract readonly zoomLevelProperty: NumberProperty;
    public abstract readonly velocityVectorScale: number;
    public abstract readonly gridSpacing: number;
    public abstract readonly gridCenter: Vector2;
    public abstract readonly timeFormatter: ( numberProperty: TProperty<number>, tandem: Tandem ) => TReadOnlyProperty<string>;
    public abstract readonly measuringTapeStartPointProperty: Vector2Property;
    public abstract readonly measuringTapeEndPointProperty: Vector2Property;
    public abstract readonly isPlayingProperty: BooleanProperty;
    public abstract massControlPanel: Node | null;

    protected readonly PLAY_AREA_WIDTH = PLAY_AREA_WIDTH;
    protected readonly PLAY_AREA_HEIGHT = PLAY_AREA_HEIGHT;

    protected abstract readonly deviatedFromDefaultsProperty: BooleanProperty;
    protected abstract readonly rewindingProperty: BooleanProperty;
    protected abstract readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;


    /**
     * Create the transform from model coordinates to stage coordinates
     */
     protected createTransform( defaultZoomScale: number, gridCenter: Vector2 ): ModelViewTransform2 {
        const modelBounds = this.getTargetRectangle( defaultZoomScale * this.zoomLevelProperty.get(), gridCenter );
        this.modelBoundsProperty.set( modelBounds );
        const playAreaHeight = this.PLAY_AREA_HEIGHT - 50;
        const scale = playAreaHeight / this.PLAY_AREA_HEIGHT;
        const viewBounds = new Rectangle( 30, 0, this.PLAY_AREA_WIDTH * scale, this.PLAY_AREA_HEIGHT * scale );

        // Ensure the transform is square (not stretched or squashed), so that circles transform into circles and not ellipses
        assert && assert( Math.abs( modelBounds.width / modelBounds.height - viewBounds.width / viewBounds.height ) <= 1E-12 );

        return ModelViewTransform2.createRectangleInvertedYMapping( modelBounds, viewBounds );
    }

    /**
     * Find the rectangle that should be viewed in the model
     */
     protected getTargetRectangle( targetScale: number, targetCenterModelPoint: Vector2 ): Rectangle {
        const z = targetScale * 1.5E-9;
        const modelWidth = this.PLAY_AREA_WIDTH / z;
        const modelHeight = this.PLAY_AREA_HEIGHT / z;
        return new Rectangle(
            -modelWidth / 2 + targetCenterModelPoint.x,
            -modelHeight / 2 + targetCenterModelPoint.y,
            modelWidth,
            modelHeight
        );
    }

    /**
     * Set the deviated from defaults property - stored on the scene so that we don't have to use a closure for performance.
     */
    protected setDeviatedFromDefaults(): void {
        this.deviatedFromDefaultsProperty.set( true );
    }

    protected addBody( body: Body ): void {
        this.physicsEngine.addBody( body );

        body.massProperty.link( this.setDeviatedFromDefaults.bind( this ) );
        body.userModifiedPositionEmitter.addListener( this.setDeviatedFromDefaults.bind( this ) );
        // body.userModifiedVelocityEmitter.addListener( this.setDeviatedFromDefaults.bind( this ) ) ;

        // if the user modifies velocity, save state while paused
        body.userModifiedVelocityEmitter.addListener( () => {
            this.setDeviatedFromDefaults();
            if ( !this.isPlayingProperty.get() ) {
                this.saveState();
            }
        } );
    }

    public getClock(): GravityAndOrbitsClock {
        return this.physicsEngine.clock;
    }
    public getBodies(): Body[] {
        return this.physicsEngine.getBodies();
    }

    public reset(): void {
        this.activeProperty.reset();
        this.deviatedFromDefaultsProperty.reset();
        this.measuringTapeStartPointProperty.reset();
        this.measuringTapeEndPointProperty.reset();
        this.zoomLevelProperty.reset();
        this.physicsEngine.clock.resetSimulationTime();

        this.physicsEngine.resetAll();
    }

    /**
     * Return the bodies to their original states when the user presses "reset" (not "reset all")
     *
     */
    public resetScene(): void {
        this.physicsEngine.resetBodies();
        this.getClock().setSimulationTime( 0 );

        Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.restoreStateForPhetioObject( this );
    }

    /**
     * Restore the last set of initial conditions that were set while the sim was paused.
     */
    public rewind(): void {

        this.rewindingProperty.set( true );

        this.getClock().timeProperty.rewind();
        const bodies = this.physicsEngine.getBodies();
        bodies.forEach( body => body.rewind() );

        this.physicsEngine.updateForceVectors();

        this.rewindingProperty.set( false );
    }

    /**
     * Save the state of the orbital system, which includes all rewindable properties of all bodies. This should only be
     * called when the sim is paused.
     */
    public saveState(): void {
        const bodies = this.physicsEngine.getBodies();
        for ( let i = 0; i < bodies.length; i++ ) {
            bodies[ i ].saveBodyState();
        }
        this.getClock().timeProperty.storeRewindValueNoNotify();
    }

    /**
     * @returns All bodies in the scene for which the mass can be changed
     */
    public getMassSettableBodies(): Body[] {
        const bodies = this.getBodies();
        const massSettableBodies = [];
        for ( let i = 0; i < bodies.length; i++ ) {
            if ( bodies[ i ].massSettable ) {
                massSettableBodies.push( bodies[ i ] );
            }
        }
        return massSettableBodies;
    }
}

labTatasurya.register( 'Scene', Scene );
export default Scene;