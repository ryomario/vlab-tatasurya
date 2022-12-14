// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import labTatasurya from '../../labTatasurya.js';
import LabTatasuryaModel from '../model/PlanetTatasuryaModel.js';
import LabTatasuryaScreenView from '../../common/view/LabTatasuryaScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class OrbitScreenView extends LabTatasuryaScreenView {

  public constructor( model: LabTatasuryaModel, viewTandem: Tandem ) {

    super( model, viewTandem );
  }
}

labTatasurya.register( 'OrbitScreenView', OrbitScreenView );
export default OrbitScreenView;