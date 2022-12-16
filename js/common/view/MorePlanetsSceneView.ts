// Copyright 2014-2022, University of Colorado Boulder

/**
 * Provides the play area for a single GravityAndOrbitsScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * 
 * @author Mario (Software Engineer)
 * 
 * @see MorePlanetsScene
 */

import DerivedProperty from "../../../../axon/js/DerivedProperty.js";
import TReadOnlyProperty from "../../../../axon/js/TReadOnlyProperty.js";
import GridNode from "../../../../scenery-phet/js/GridNode.js";
import PhetFont from "../../../../scenery-phet/js/PhetFont.js";
import { AlignBox, Rectangle } from "../../../../scenery/js/imports.js";
import TextPushButton from "../../../../sun/js/buttons/TextPushButton.js";
import Tandem from "../../../../tandem/js/Tandem.js";
import labTatasurya from "../../labTatasurya.js";
import LabTatasuryaStrings from "../../LabTatasuryaStrings.js";
import LabTatasuryaModel from "../model/LabTatasuryaModel.js";
import Scene from "../Scene.js";
import BodyNode from "./BodyNode.js";
import ExplosionNode from "./ExplosionNode.js";
import SceneView from "./SceneView.js";
import TimeCounter from "./TimeCounter.js";
import ZoomControl from "./ZoomControl.js";
 
class MorePlanetsSceneView extends SceneView {
    public constructor( scene: Scene, model: LabTatasuryaModel, tandem: Tandem ) {
        super();

        const forceScale = scene.forceScale;

        const bodies = scene.physicsEngine.getBodies();

        // this.addChild( new PathsCanvasNode( bodies, scene.transformProperty, model.showPathProperty, MorePlanetsSceneView.STAGE_SIZE ) );


        // Use canvas coordinates to determine whether something has left the visible area
        const isReturnableProperties: TReadOnlyProperty<boolean>[] = [];
        bodies.forEach( body => {
            const bodyNode = new BodyNode( body, body.labelAngle, model.isPlayingProperty, scene, tandem.createTandem( body.bodyNodeTandemName ) );
            this.addChild( bodyNode );

            const isReturnableProperty = new DerivedProperty( [ body.positionProperty, scene.zoomLevelProperty, body.isCollidedProperty ], ( position, zoomLevel, isCollided ) => {

                // the return objects button should be visible when a body is out of bounds and not at the rewind position
                const atRewindPosition = bodyNode.body.positionProperty.equalsRewindValue();
                return !atRewindPosition && isCollided;
                // return !MorePlanetsSceneView.STAGE_SIZE.intersectsBounds( bodyNode.bounds ) && !atRewindPosition || isCollided;
            } );
            isReturnableProperties.push( isReturnableProperty );

            // Add explosion nodes, which are always in the scene graph but only visible during explosions
            this.addChild( new ExplosionNode( body, scene.transformProperty ) );

        } );

        // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
        const gridNode = new GridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 100 );
        model.showGridProperty.linkAttribute( gridNode, 'visible' );
        this.addChild( gridNode );

        this.addChild( new AlignBox( new TimeCounter( scene.timeFormatter, scene.physicsEngine.clock, tandem.createTandem( 'timeCounter' ), {
            scale: 1.2
        } ), {
            alignBounds: MorePlanetsSceneView.STAGE_SIZE,
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
                bodies[ i ].boundsProperty.set( scene.transformProperty.get().viewToModelBounds( MorePlanetsSceneView.STAGE_SIZE ) );
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
            top: MorePlanetsSceneView.STAGE_SIZE.top + 10,
            right: MorePlanetsSceneView.STAGE_SIZE.right - 10
        } );
        this.addChild( scaleControl );
    }
}

labTatasurya.register( 'MorePlanetsSceneView', MorePlanetsSceneView );
export default MorePlanetsSceneView;