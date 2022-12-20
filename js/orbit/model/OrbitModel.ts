// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import labTatasurya from '../../labTatasurya.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import OrbitSceneFactory from './OrbitSceneFactory.js';
import LabTatasuryaModel from '../../common/model/LabTatasuryaModel.js';

class OrbitModel extends LabTatasuryaModel {

  public constructor( modelTandem: Tandem, viewTandem: Tandem ) {
    super(
      model => new OrbitSceneFactory( model, modelTandem, viewTandem ),
      0,
      modelTandem
    );

    this.showGravityForceProperty.setInitialValue( true );
    this.showGravityForceProperty.set( false );

    this.showMassProperty.setInitialValue( false );
    this.showMassProperty.set( true );

    this.showPathProperty.setInitialValue( true );
    this.showPathProperty.set( false );
  }

  public override reset(): void {
    super.reset();

    this.showGravityForceProperty.set( false );
    this.showMassProperty.set( true );
    this.showPathProperty.set( false );
  }
}

labTatasurya.register( 'OrbitModel', OrbitModel );
export default OrbitModel;