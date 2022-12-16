// Copyright 2013-2022, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode, { TimeControlNodeOptions } from '../../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Body from '../model/Body.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import animationFrameTimer from '../../../../axon/js/animationFrameTimer.js';
import LabTatasuryaModel from '../model/LabTatasuryaModel.js';
import labTatasurya from '../../labTatasurya.js';
import LabTatasuryaColors from '../LabTatasuryaColors.js';
import LabTatasuryaScene from '../LabTatasuryaScene.js';
import Scene from '../Scene.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;

type SelfOptions = EmptySelfOptions;

type LabTatasuryaTimeControlNodeOptions = SelfOptions & PickRequired<TimeControlNodeOptions, 'tandem'>;

class LabTatasuryaTimeControlNode extends TimeControlNode {

    public constructor( model: LabTatasuryaModel, providedOptions: LabTatasuryaTimeControlNodeOptions ) {

        super( model.isPlayingProperty, {
            timeSpeedProperty: model.timeSpeedProperty,
            timeSpeeds: [ TimeSpeed.FAST, TimeSpeed.NORMAL, TimeSpeed.SLOW ],
            playPauseStepButtonOptions: {
                playPauseStepXSpacing: PUSH_BUTTON_SPACING,
                playPauseButtonOptions: {
                    radius: PLAY_PAUSE_BUTTON_RADIUS,
                    touchAreaDilation: 3
                },
                stepForwardButtonOptions: {
                    radius: STEP_BUTTON_RADIUS,
                    listener: () => model.sceneProperty.value.getClock().stepClockWhilePaused()
                }
            },
            speedRadioButtonGroupOnLeft: true,
            speedRadioButtonGroupOptions: {
                labelOptions: {
                    font: new PhetFont( 20 ),
                    fill: LabTatasuryaColors.foregroundProperty,
                    maxWidth: 200
                }
            },
            tandem: providedOptions.tandem
        } );

        // Enable/disable the rewind button based on whether any Property in that scene has changed.
        const dependencies = [ model.sceneProperty ];
        model.getScenes().forEach( scene => {
            scene.getBodies().forEach( body => {
                // @ts-expect-error
                body.getRewindableProperties().forEach( ( property: RewindableProperty ) => {
                    dependencies.push( property.differentProperty );
                    dependencies.push( property );
                } );
            } );
        } );

        const anyPropertyDifferentProperty = DerivedProperty.deriveAny( dependencies, ( ...args: Scene[] ) => {
            let changed = false;
            model.sceneProperty.value.getBodies().forEach( ( body: Body ) => {

                // @ts-expect-error
                body.getRewindableProperties().forEach( ( property: RewindableProperty ) => {

                    // Make sure there are no stale values of differentProperty
                    property.updateDifferentProperty();

                    changed = changed || property.differentProperty.value;
                } );
            } );
            return changed;
        } );


        const restartButton = new RestartButton( {
            enabledProperty: anyPropertyDifferentProperty,
            radius: STEP_BUTTON_RADIUS,
            xMargin: 9.5,
            yMargin: 9.5,
            listener: () => model.sceneProperty.value.rewind(),
            center: this.getPlayPauseButtonCenter().minusXY( PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + PUSH_BUTTON_SPACING, 0 ),
            tandem: providedOptions.tandem.createTandem( 'restartButton' )
        } );
        this.addChild( restartButton );

        // Update the enabled property
        Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {

            anyPropertyDifferentProperty.recomputeDerivation();

            // For unknown reasons, we have to wait for this frame to completely resolve before this will work.
            // See https://github.com/phetsims/gravity-and-orbits/issues/459
            animationFrameTimer.runOnNextTick( () => anyPropertyDifferentProperty.recomputeDerivation() );
        } );
    }
}

labTatasurya.register( 'LabTatasuryaTimeControlNode', LabTatasuryaTimeControlNode );
export default LabTatasuryaTimeControlNode;