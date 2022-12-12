// Copyright 2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Mario (Software Engineer)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import LabTatasuryaScreen from './orbit/OrbitScreen.js';
import LabTatasuryaStrings from './LabTatasuryaStrings.js';
import './common/LabTatasuryaQueryParameters.js';
import { CreditsData } from '../../joist/js/CreditsNode.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = LabTatasuryaStrings[ 'lab-tatasurya' ].titleStringProperty;

  const screens = [
    new LabTatasuryaScreen( { tandem: Tandem.ROOT.createTandem( 'labTatasuryaScreen' ) } )
  ];

  const options: SimOptions = {

    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    credits: {
      // leadDesign: '',
      softwareDevelopment: 'Khairul Arifin, Mario',
      team: 'Nia, Sofi, Tanti',
      // contributors: '',
      // qualityAssurance: '',
      graphicArts: 'Oscar',
      // soundDesign: '',
      // thanks: ''
    } as CreditsData,

    // phet-io
    phetioDesigned: true,

    preferencesModel: new PreferencesModel( {
      visualOptions: {
        supportsProjectorMode: true
      }
    } )
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );