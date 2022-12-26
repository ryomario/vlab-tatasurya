// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import labTatasurya from '../../labTatasurya.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RotasiRevolusiSceneFactory from './RotasiRevolusiSceneFactory.js';
import LabTatasuryaModel from '../../common/model/LabTatasuryaModel.js';

class RotasiRevolusiModel extends LabTatasuryaModel {

  public constructor( modelTandem: Tandem, viewTandem: Tandem ) {
    super(
      model => new RotasiRevolusiSceneFactory( model, modelTandem, viewTandem ),
      0,
      modelTandem
    );

    this.showGravityForceProperty.setInitialValue( true );
    this.showGravityForceProperty.set( false );

    this.showMassProperty.setInitialValue( false );
    this.showMassProperty.set( true );

    this.showPathProperty.setInitialValue( true );
    this.showPathProperty.set( true );
  }

  public override reset(): void {
    super.reset();

    this.showGravityForceProperty.set( false );
    this.showMassProperty.set( true );
    this.showPathProperty.set( true );
  }
}

labTatasurya.register( 'RotasiRevolusiModel', RotasiRevolusiModel );
export default RotasiRevolusiModel;