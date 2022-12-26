// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import labTatasurya from '../../labTatasurya.js';
import LabTatasuryaModel from '../model/RotasiRevolusiModel.js';
import LabTatasuryaScreenView from '../../common/view/LabTatasuryaScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class RotasiRevolusiScreenView extends LabTatasuryaScreenView {

  public constructor( model: LabTatasuryaModel, viewTandem: Tandem ) {

    super( model, viewTandem );
  }
}

labTatasurya.register( 'RotasiRevolusiScreenView', RotasiRevolusiScreenView );
export default RotasiRevolusiScreenView;