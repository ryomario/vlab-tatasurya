// Copyright 2014-2022, University of Colorado Boulder

/**
 * Provides a textual readout of a Body's mass in "earth masses"
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import labTatasurya from '../../labTatasurya.js';
import LabTatasuryaStrings from '../../LabTatasuryaStrings.js';
import LabTatasuryaConstants from '../LabTatasuryaConstants.js';
import BodyNode from './BodyNode.js';
import MassReadoutNode, { MassReadoutNodeOptions } from './MassReadoutNode.js';

const earthMassesStringProperty = LabTatasuryaStrings.earthMassesStringProperty;
const earthMassStringProperty = LabTatasuryaStrings.earthMassStringProperty;
const pattern0Value1UnitsStringProperty = LabTatasuryaStrings.pattern[ '0value' ][ '1unitsStringProperty' ];
const thousandEarthMassesStringProperty = LabTatasuryaStrings.thousandEarthMassesStringProperty;

class EarthMassReadoutNode extends MassReadoutNode {

    public constructor( bodyNode: BodyNode, visibleProperty: TReadOnlyProperty<boolean>, providedOptions?: MassReadoutNodeOptions ) {
        super( bodyNode, visibleProperty, providedOptions );

        /**
         * Create a label for the earth, but with rules to provide either exact or qualitative representations,
         * and limitations so that the label looks good in the view.
         */
        const updateText = () => {
            const massKG = this.bodyNode.body.massProperty.get();
            const earthMasses = massKG / LabTatasuryaConstants.EARTH_MASS;

            // Show the value in terms of earth masses (or thousands of earth masses)
            let value;
            let units;
            if ( earthMasses > 1E3 ) {
                value = Utils.toFixed( Utils.roundSymmetric( earthMasses / 1E3 ), 0 );
                units = thousandEarthMassesStringProperty.value;
            }
            else if ( Math.abs( earthMasses - 1 ) < 1E-2 ) {
                value = '1';
                units = earthMassStringProperty.value;
            }
            else if ( earthMasses < 1 ) {
                value = Utils.toFixed( earthMasses, 2 );
                units = earthMassesStringProperty.value;
            }
            else {

                // Handle showing exactly "1 earth mass" instead of "1 earth masses"
                value = Utils.toFixed( earthMasses, 2 );
                units = ( earthMasses === 1 ) ? earthMassStringProperty.value : earthMassesStringProperty.value;
            }
            this.stringProperty.value = StringUtils.fillIn( pattern0Value1UnitsStringProperty.value, { value: value, unit: units } );
        };
        this.bodyNode.body.massProperty.lazyLink( updateText );
        thousandEarthMassesStringProperty.lazyLink( updateText );
        earthMassStringProperty.lazyLink( updateText );
        earthMassesStringProperty.lazyLink( updateText );
        pattern0Value1UnitsStringProperty.lazyLink( updateText );
        updateText();
    }
}

labTatasurya.register( 'EarthMassReadoutNode', EarthMassReadoutNode );
export default EarthMassReadoutNode;