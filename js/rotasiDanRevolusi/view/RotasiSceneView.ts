// Copyright 2022, University of Colorado Boulder

/**
 * Provides the play area for a single Scene.
 *
 * @author Mario (Software Engineer)
 * 
 * @see RotasiScene
 */

import DerivedProperty from "../../../../axon/js/DerivedProperty.js";
import TReadOnlyProperty from "../../../../axon/js/TReadOnlyProperty.js";
import GridNode from "../../../../scenery-phet/js/GridNode.js";
import PhetFont from "../../../../scenery-phet/js/PhetFont.js";
import { AlignBox, Color, LinearGradient, Rectangle } from "../../../../scenery/js/imports.js";
import TextPushButton from "../../../../sun/js/buttons/TextPushButton.js";
import Tandem from "../../../../tandem/js/Tandem.js";
import LabTatasuryaModel from "../../common/model/LabTatasuryaModel.js";
import BodyNode from "../../common/view/BodyNode.js";
import ExplosionNode from "../../common/view/ExplosionNode.js";
import SceneView from "../../common/view/SceneView.js";
import TimeCounter from "../../common/view/TimeCounter.js";
import ZoomControl from "../../common/view/ZoomControl.js";
import labTatasurya from "../../labTatasurya.js";
import LabTatasuryaStrings from "../../LabTatasuryaStrings.js";
import RotasiScene from "../model/RotasiScene.js";
import SpectrumNode from "../../../../scenery-phet/js/SpectrumNode.js";
import Dimension2 from "../../../../dot/js/Dimension2.js";

class RotasiSceneView extends SceneView {
    public constructor( scene: RotasiScene, model: LabTatasuryaModel, tandem: Tandem ) {
        super();

        const bodies = scene.physicsEngine.getBodies();

        const isReturnableProperties: TReadOnlyProperty<boolean>[] = [];
        bodies.forEach( body => {
            const bodyNode = new BodyNode( body, body.labelAngle, model.isPlayingProperty, scene, tandem.createTandem( body.bodyNodeTandemName ) );
            this.addChild( bodyNode );

            const isReturnableProperty = new DerivedProperty( [ body.positionProperty, scene.zoomLevelProperty, body.isCollidedProperty ], ( position, zoomLevel, isCollided ) => {
                const atRewindPosition = bodyNode.body.positionProperty.equalsRewindValue();
                return !atRewindPosition && isCollided;
            } );
            isReturnableProperties.push( isReturnableProperty );

            this.addChild( new ExplosionNode( body, scene.transformProperty ) );
        } );

        const shadowFill = new LinearGradient( 0, 0, RotasiSceneView.STAGE_SIZE.centerX, 0 )
        .addColorStop( 0, 'rgb( 0, 0, 0 )' )
        .addColorStop( 1, 'rgba( 0, 0, 0, 0 )' );
        
        const shadow = new Rectangle( RotasiSceneView.STAGE_SIZE, {
            fill: shadowFill,
            center: this.center
        } );

        // this.addChild( shadow );

        const gridNode = new GridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 50 );
        model.showGridProperty.linkAttribute( gridNode, 'visible' );
        this.addChild( gridNode );


        this.addChild( new AlignBox( new TimeCounter( scene.timeFormatter, scene.physicsEngine.clock, tandem.createTandem( 'timeCounter' ), {
            scale: 1.2
        } ), {
            alignBounds: RotasiSceneView.STAGE_SIZE,
            rightMargin: 100,
            bottomMargin: 20,
            xAlign: 'right',
            yAlign: 'bottom'
        } ) );

        if ( phet.chipper.queryParameters.dev ) {
            const draggableAreaNode = new Rectangle( 0, 0, 0, 0, { stroke: 'blue', lineWidth: 4 } );
            this.addChild( draggableAreaNode );

            scene.modelBoundsProperty.link( bounds => {
                if ( bounds ) {
                    draggableAreaNode.setRectBounds( scene.transformProperty.get().modelToViewBounds( bounds ) );
                }
            } );
        }

        scene.modelBoundsProperty.link( bounds => {

            // Tell each of the bodies about the stage size (in model coordinates) so they know if they are out of bounds
            for ( let i = 0; i < bodies.length; i++ ) {
                bodies[ i ].boundsProperty.set( scene.transformProperty.get().viewToModelBounds( RotasiSceneView.STAGE_SIZE ) );
            }
        } );

        // If any body is out of bounds, show a "return object" button
        const anythingReturnableProperty = DerivedProperty.or( isReturnableProperties );

        const returnObjectsButton = new TextPushButton( LabTatasuryaStrings.returnObjectsStringProperty, {
            font: new PhetFont( 16 ),
            textFill: 'black',
            visiblePropertyOptions: { phetioReadOnly: true },
            enabledPropertyOptions: { phetioReadOnly: true },
            listener: () => {

                // the return button should behave exactly like the rewind button
                // all objects should be restored to their saved state, and then
                // pause the orbital mode
                scene.rewind();
                scene.isPlayingProperty.set( false );
            },
            tandem: tandem.createTandem( 'returnObjectsButton' ),
            maxWidth: 225,
            x: 100,
            y: 100
        } );
        this.addChild( returnObjectsButton );

        anythingReturnableProperty.linkAttribute( returnObjectsButton, 'visible' );

        const scaleControl = new ZoomControl( scene.zoomLevelProperty, tandem.createTandem( 'zoomControl' ), {
            top: RotasiSceneView.STAGE_SIZE.top + 10,
            right: RotasiSceneView.STAGE_SIZE.right - 10
        } );
        this.addChild( scaleControl );
    }
}

labTatasurya.register( 'RotasiSceneView', RotasiSceneView );
export default RotasiSceneView;