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
import RotasiRevolusiModel from './model/RotasiRevolusiModel.js';
import LabTatasuryaStrings from '../LabTatasuryaStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import icon from '../../images/Rotasi & Revolusi_png.js';
import RotasiRevolusiScreenView from './view/RotasiRevolusiScreenView.js';

class RotasiRevolusiScreen extends Screen<RotasiRevolusiModel, RotasiRevolusiScreenView> {

  public constructor( providedOptions: ScreenOptions ) {

    const options = optionize<ScreenOptions, EmptySelfOptions, ScreenOptions>()( {
      name: LabTatasuryaStrings.screen.rotasiRevolusiNameStringProperty,

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
      () => new RotasiRevolusiModel( modelTandem, viewTandem ),
      model => new RotasiRevolusiScreenView( model, viewTandem ),
      options
    );
  }
}

labTatasurya.register( 'RotasiRevolusiScreen', RotasiRevolusiScreen );
export default RotasiRevolusiScreen;