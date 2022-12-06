// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import labTatasurya from '../../labTatasurya.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  //TODO add options that are specific to LabTatasuryaModel here
};

type LabTatasuryaModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class LabTatasuryaModel {

  public constructor( providedOptions: LabTatasuryaModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

labTatasurya.register( 'LabTatasuryaModel', LabTatasuryaModel );
export default LabTatasuryaModel;