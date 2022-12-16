// Copyright 2014-2022, University of Colorado Boulder

/**
 * Provides the play area for a single GravityAndOrbitsScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * 
 * @author Mario (Software Engineer)
 * 
 * @see LabTatasuryaScene
 */

import Bounds2 from "../../../../dot/js/Bounds2.js";
import platform from "../../../../phet-core/js/platform.js";
import { Color, Rectangle } from "../../../../scenery/js/imports.js";
import labTatasurya from "../../labTatasurya.js";

// constants
const SCALE = 0.8; // these numbers come from trying to match the original MLL port of this sim
const WIDTH = 790 * ( 1 / SCALE );
const HEIGHT = 618 * ( 1 / SCALE );
const STAGE_SIZE = Bounds2.rect( 0, 0, WIDTH, HEIGHT );
const buttonBackgroundColor = new Color( 255, 250, 125 );

abstract class SceneView extends Rectangle {
    public static readonly STAGE_SIZE = STAGE_SIZE;
    public static readonly buttonBackgroundColor = buttonBackgroundColor;

    constructor() {
        // each orbit mode has its own play area with a CanvasNode for rendering paths
        // each canvas should be excluded from the DOM when invisible, with the exception of iOS Safari,
        // which performs worse in this case when toggling visibility
        const excludeInvisible = !platform.mobileSafari;

        super( STAGE_SIZE.x, STAGE_SIZE.y, STAGE_SIZE.width, STAGE_SIZE.height, { scale: SCALE, excludeInvisible: excludeInvisible } );
        this.right = 1024;
    }
}

labTatasurya.register( 'SceneView', SceneView );
export default SceneView;