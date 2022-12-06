// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import LabTatasuryaColors from '../common/LabTatasuryaColors.js';
import labTatasurya from '../labTatasurya.js';
import LabTatasuryaModel from './model/LabTatasuryaModel.js';
import LabTatasuryaScreenView from './view/LabTatasuryaScreenView.js';
import LabTatasuryaStrings from '../LabTatasuryaStrings.js';

type SelfOptions = {
  //TODO add options that are specific to LabTatasuryaScreen here
};

type LabTatasuryaScreenOptions = SelfOptions & ScreenOptions;

class LabTatasuryaScreen extends Screen<LabTatasuryaModel, LabTatasuryaScreenView> {

  public constructor( providedOptions: LabTatasuryaScreenOptions ) {

    const options = optionize<LabTatasuryaScreenOptions, SelfOptions, ScreenOptions>()( {
      name: LabTatasuryaStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: LabTatasuryaColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new LabTatasuryaModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new LabTatasuryaScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

labTatasurya.register( 'LabTatasuryaScreen', LabTatasuryaScreen );
export default LabTatasuryaScreen;