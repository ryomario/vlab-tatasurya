// Copyright 2022, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Mario (Software Engineer)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import labTatasurya from '../labTatasurya.js';

const LabTatasuryaColors = {

  // Color mainly used for background things like panels or text backgrounds
  backgroundProperty: new ProfileColorProperty( labTatasurya, 'background', {
    default: 'black',
    projector: 'white'
  }, {
    tandem: Tandem.COLORS.createTandem( 'backgroundColorProperty' )
  } ),
  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( labTatasurya, 'foreground', {
    default: 'white',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'foregroundColorProperty' )
  } ),
  measuringTapeTextBackgroundColorProperty: new ProfileColorProperty( labTatasurya, 'measuring tape text background', {
    default: 'rgba( 0, 0, 0, 0.65 )',
    projector: 'rgba( 255, 255, 255, 0.65 )'
  }, {
    tandem: Tandem.COLORS.createTandem( 'measuringTapeTextBackgroundColorProperty' )
  } ),
  bodyLabelIndicatorProperty: new ProfileColorProperty( labTatasurya, 'body label indicator', {
    default: new Color( 255, 255, 0 ),
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'labelColorProperty' )
  } ),
  controlPanelFillProperty: new ProfileColorProperty( labTatasurya, 'control panel fill', {
    default: 'black',
    projector: new Color( 222, 234, 255 )
  } ),
  gridIconStrokeColorProperty: new ProfileColorProperty( labTatasurya, 'grid icon stroke', {
    default: 'gray',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'gridIconStrokeColorProperty' )
  } ),
};

labTatasurya.register( 'LabTatasuryaColors', LabTatasuryaColors );
export default LabTatasuryaColors;