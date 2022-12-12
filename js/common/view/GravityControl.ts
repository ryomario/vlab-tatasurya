// Copyright 2015-2022, University of Colorado Boulder

/**
 * Container for gravity on/off buttons.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import LabTatasuryaColors from '../LabTatasuryaColors.js';
import LabTatasuryaStrings from '../../LabTatasuryaStrings.js';
import labTatasurya from '../../labTatasurya.js';

// constants
const FONT = new PhetFont( 14 );
const TEXT_OPTIONS = { font: FONT, fill: LabTatasuryaColors.foregroundProperty, maxWidth: 50 };
const RADIO_OPTIONS = { radius: 7 };

type GravityControlOptions = PhetioObjectOptions;

class GravityControl extends Node {

    /**
    * @param gravityEnabledProperty
    * @param [providedOptions] - This object contains options for main node of gravity menu.
    */
    public constructor( gravityEnabledProperty: Property<boolean>, providedOptions?: GravityControlOptions ) {
        super( providedOptions );

        const options = optionize<GravityControlOptions, EmptySelfOptions, PhetioObjectOptions>()( {
            tandem: Tandem.OPTIONAL
        }, providedOptions );

        const gravityTextNode = new Text( LabTatasuryaStrings.gravity, { ...TEXT_OPTIONS, stringProperty: LabTatasuryaStrings.gravityStringProperty } );
        const onTextNode = new Text( LabTatasuryaStrings.on, { ...TEXT_OPTIONS, stringProperty: LabTatasuryaStrings.onStringProperty } );
        const offTextNode = new Text( LabTatasuryaStrings.off, { ...TEXT_OPTIONS, stringProperty: LabTatasuryaStrings.offStringProperty } );

        this.addLinkedElement( gravityEnabledProperty, {
            tandem: options.tandem.createTandem( 'gravityEnabledProperty' )
        } );

        this.addChild( new HBox( {
            spacing: 10, bottom: 2, children: [
                gravityTextNode,
                new AquaRadioButton( gravityEnabledProperty, true, onTextNode, merge( { tandem: options.tandem.createTandem( 'gravityOnRadioButton' ) }, RADIO_OPTIONS ) ),
                new AquaRadioButton( gravityEnabledProperty, false, offTextNode, merge( { tandem: options.tandem.createTandem( 'gravityOffRadioButton' ) }, RADIO_OPTIONS ) )
            ]
        } ) );
    }
}

labTatasurya.register( 'GravityControl', GravityControl );
export default GravityControl;