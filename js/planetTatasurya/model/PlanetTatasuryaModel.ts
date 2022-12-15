// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import labTatasurya from '../../labTatasurya.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PlanetTatasuryaSceneFactory from './PlanetTatasuryaSceneFactory.js';
import LabTatasuryaModel from '../../common/model/LabTatasuryaModel.js';

class OrbitModel extends LabTatasuryaModel {

  public constructor( modelTandem: Tandem, viewTandem: Tandem ) {
    super(
      model => new PlanetTatasuryaSceneFactory( model, modelTandem, viewTandem ),
      0,
      modelTandem
    );

    this.showMassProperty.setInitialValue( false );
    this.showMassProperty.set( false );
  }
}

labTatasurya.register( 'OrbitModel', OrbitModel );
export default OrbitModel;