// Copyright 2014-2022, University of Colorado Boulder

import Vector2 from "../../../../dot/js/Vector2.js";
import labTatasurya from "../../labTatasurya.js";
import Body from "./Body.js";

/**
 * Immutable state returned by the physics engine update algorithm, it is applied to the mutable Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * 
 * @author Mario (Software Engineer)
 */

class BodyState {
    public readonly body: Body;
    public readonly position: Vector2;
    public readonly velocity: Vector2;
    public acceleration: Vector2;
    public readonly mass: number;
    public readonly exploded: boolean;
    public rotation: number;
    public readonly rotationPeriod: number | null;
    public readonly timeSpeedScale: number;

    /**
     * @param body - the parent body from which this BodyState was created
     * @param position - in m
     * @param velocity - in m/s
     * @param acceleration - in m/s^2
     * @param mass - in kg
     * @param exploded
     * @param rotation - The rotation of the body about its own origin in radians
     * @param rotationPeriod - in seconds
     */
    public constructor( body: Body, position: Vector2, velocity: Vector2, acceleration: Vector2, mass: number, exploded: boolean, rotation: number, rotationPeriod: number | null, timeSpeedScale: number = 1 ) {

        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.mass = mass;
        this.exploded = exploded;
        this.rotation = rotation;
        this.rotationPeriod = rotationPeriod;
        this.body = body;
        this.timeSpeedScale = timeSpeedScale;
    }
}

labTatasurya.register( 'BodyState', BodyState );
export default BodyState;