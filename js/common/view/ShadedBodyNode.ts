// Copyright 2014-2022, University of Colorado Boulder

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at model or real scale.  It is also draggable,
 * which changes the position of the Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * 
 * @author Mario (Software Engineer)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Body from '../model/Body.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, CircleOptions, DragListener, Line, Node, RadialGradient, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BodyRenderer from './BodyRenderer.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Transform3 from '../../../../dot/js/Transform3.js';
import Multilink from '../../../../axon/js/Multilink.js';
import LabTatasuryaScene from '../LabTatasuryaScene.js';
import LabTatasuryaColors from '../LabTatasuryaColors.js';
import labTatasurya from '../../labTatasurya.js';
import Scene from '../Scene.js';
import BodyNode from './BodyNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';


type SelfOptions = {
    highlightColor?: TColor;
    shadowColor?: TColor;
    highlightDiameterRatio?: number;
    highlightXOffset?: number; // x-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
    highlightYOffset?: number; // y-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
};

export type ShadedBodyNodeOptions = SelfOptions & StrictOmit<CircleOptions, 'fill'>;

class ShadedBodyNode extends BodyNode {
    protected readonly shadowNode: Circle;
    public readonly updateShadowFill: () => void;

    /**
    * Constructor for ShadedBodyNode
    * @param body
    * @param labelAngle - Angle at which to show the name label, different for different ShadedBodyNodes so they
    *                              don't overlap too much
    * @param isPlayingProperty is the simulation playing?
    * @param scene
    * @param tandem
    */
    public constructor( body: Body, labelAngle: number, isPlayingProperty: Property<boolean>, scene: Scene, providedOptions: ShadedBodyNodeOptions ) {
        const options = optionize<ShadedBodyNodeOptions, SelfOptions, CircleOptions>()( {
            tandem: Tandem.REQUIRED,

            highlightColor: 'rgba(255,255,255,0)',
            shadowColor: 'black',
            highlightDiameterRatio: 0,
            highlightXOffset: 1,
            highlightYOffset: 0
        }, providedOptions );

        super(
            body,
            labelAngle,
            isPlayingProperty,
            scene,
            options.tandem
        );

        this.shadowNode = new Circle( this.getViewDiameter() / 2, {
            // options
        } );

        this.updateShadowFill = () => {
            const radius = this.shadowNode.radius;
            const highlightX = radius * options.highlightXOffset;
            const highlightY = radius * options.highlightYOffset;

            this.shadowNode.fill = new RadialGradient( highlightX, highlightY, 0, highlightX, highlightY, radius * 2 )
                .addColorStop( 0, options.highlightColor )
                .addColorStop( options.highlightDiameterRatio, 'rgba(0,0,0,0)' )
                .addColorStop( 0.9, options.shadowColor );
        };

        if ( body.showShade ) {
            this.addChild( this.shadowNode );

            this.updateShadowFill();

            const diameterListener = () => {
                const viewDiameter = this.getViewDiameter();
                this.shadowNode.setRadius( viewDiameter / 2 );

                this.updateShadowFill();
            };
            Multilink.multilink( [ this.body.diameterProperty, this.modelViewTransformProperty ], diameterListener );
        }
    }
}

labTatasurya.register( 'ShadedBodyNode', ShadedBodyNode );
export default ShadedBodyNode;
 