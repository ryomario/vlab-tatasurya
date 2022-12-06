// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Mario (Software Engineer)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import LabTatasuryaConstants from '../../common/LabTatasuryaConstants.js';
import labTatasurya from '../../labTatasurya.js';
import LabTatasuryaModel from '../model/LabTatasuryaModel.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
 //TODO add options that are specific to LabTatasuryaScreenView here
};

type LabTatasuryaScreenViewOptions = SelfOptions & ScreenViewOptions;

class LabTatasuryaScreenView extends ScreenView {

  public constructor( model: LabTatasuryaModel, providedOptions: LabTatasuryaScreenViewOptions ) {

    const options = optionize<LabTatasuryaScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - LabTatasuryaConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - LabTatasuryaConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

labTatasurya.register( 'LabTatasuryaScreenView', LabTatasuryaScreenView );
export default LabTatasuryaScreenView;