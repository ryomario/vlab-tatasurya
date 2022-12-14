// Copyright 2013-2022, University of Colorado Boulder

/**
 * Control panel containing the controls for orbital mode, gravity, and visibility of planetary path and vectors.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HSeparator, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LabTatasuryaModel from '../model/LabTatasuryaModel.js';
import Interruptable from '../model/Interruptable.js';
import LabTatasuryaConstants from '../LabTatasuryaConstants.js';
import SceneSelectionControls from './SceneSelectionControls.js';
import GravityControl from './GravityControl.js';
import CheckboxPanel from './CheckboxPanel.js';
import labTatasurya from '../../labTatasurya.js';
import LabTatasuryaStrings from '../../LabTatasuryaStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import LabTatasuryaColors from '../LabTatasuryaColors.js';

// constants
const MENU_SECTION_OPTIONS = { x: 5 };

type LabTatasuryaControlsOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

class LabTatasuryaControls extends VBox {

public constructor( model: LabTatasuryaModel, screenView: Interruptable, providedOptions?: Partial<LabTatasuryaControlsOptions> ) {

    const options: LabTatasuryaControlsOptions = merge( {}, LabTatasuryaConstants.CONTROL_PANEL_OPTIONS, providedOptions ) as unknown as LabTatasuryaControlsOptions;
    
    const children = [
        new Text( LabTatasuryaStrings.chooseSettings, {
            font: new PhetFont( 16 ),
            fontWeight: 'bold',
            fill: LabTatasuryaColors.foregroundProperty,
            maxWidth: 175,
        } ) as Node,
        new HSeparator()
    ];
    
    if ( model.getScenes().length > 1 ) {
        children.push(
            new SceneSelectionControls( model.sceneProperty, model.getScenes(), screenView, merge( { tandem: options.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) )
        );
        children.push(
            new HSeparator()
        );
    }

    children.push(
        new CheckboxPanel( model, merge( { tandem: options.tandem.createTandem( 'checkboxPanel' ) }, MENU_SECTION_OPTIONS ) )
    );

    super( {
        children: [
            // new SceneSelectionControls( model.sceneProperty, model.getScenes(), screenView, merge( { tandem: options.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) ),
            // new HSeparator(),
            // new GravityControl( model.gravityEnabledProperty, merge( { tandem: options.tandem.createTandem( 'gravityControl' ) }, MENU_SECTION_OPTIONS ) ),
            // new HSeparator(),
            // new CheckboxPanel( model, merge( { tandem: options.tandem.createTandem( 'checkboxPanel' ) }, MENU_SECTION_OPTIONS ) )
            ...children
        ],
        spacing: 4,
        y: 5,
        align: 'left'
    } );
}
}

labTatasurya.register( 'LabTatasuryaControls', LabTatasuryaControls );
export default LabTatasuryaControls;