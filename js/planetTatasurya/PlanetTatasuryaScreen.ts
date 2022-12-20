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
import PlanetTatasuryaModel from './model/PlanetTatasuryaModel.js';
import LabTatasuryaStrings from '../LabTatasuryaStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import icon from '../../images/allPlanets_png.js';
import PlanetTatasuryaScreenView from './view/PlanetTatasuryaScreenView.js';

class PlanetTatasuryaScreen extends Screen<PlanetTatasuryaModel, PlanetTatasuryaScreenView> {

  public constructor( providedOptions: ScreenOptions ) {

    const options = optionize<ScreenOptions, EmptySelfOptions, ScreenOptions>()( {
      name: LabTatasuryaStrings.screen.planetTatasuryaNameStringProperty,

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
      () => new PlanetTatasuryaModel( modelTandem, viewTandem ),
      model => new PlanetTatasuryaScreenView( model, viewTandem ),
      options
    );
  }
}

labTatasurya.register( 'PlanetTatasuryaScreen', PlanetTatasuryaScreen );
export default PlanetTatasuryaScreen;