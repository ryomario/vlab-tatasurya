// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import LabTatasuryaColors from '../common/LabTatasuryaColors.js';
import labTatasurya from '../labTatasurya.js';
import OrbitModel from './model/OrbitModel.js';
import LabTatasuryaStrings from '../LabTatasuryaStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import icon from '../../images/orbit_png.js';
import LabTatasuryaScreenView from '../common/view/LabTatasuryaScreenView.js';

class OrbitScreen extends Screen<OrbitModel, LabTatasuryaScreenView> {

  public constructor( providedOptions: ScreenOptions ) {

    const options = optionize<ScreenOptions, EmptySelfOptions, ScreenOptions>()( {
      name: LabTatasuryaStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      homeScreenIcon: new ScreenIcon( new Image( icon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } ),

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: LabTatasuryaColors.backgroundProperty
    }, providedOptions );

    const viewTandem = options.tandem.createTandem( 'view' );
    const modelTandem = options.tandem.createTandem( 'model' );
    super(
      () => new OrbitModel( modelTandem, viewTandem ),
      model => new LabTatasuryaScreenView( model, viewTandem ),
      options
    );
  }
}

labTatasurya.register( 'OrbitScreen', OrbitScreen );
export default OrbitScreen;