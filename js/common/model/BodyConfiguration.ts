// Copyright 2014-2022, University of Colorado Boulder

import Vector2 from "../../../../dot/js/Vector2.js";
import optionize from "../../../../phet-core/js/optionize.js";
import labTatasurya from "../../labTatasurya.js";

/**
 * Class that facilitates configuration of body instances for a GravityAndOrbitsScene; a data structure that describes
 * a body's parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * 
 * @author Mario (Software Engineer)
 */


type BodyConfigurationOptions = {
    rotationPeriod?: null | number;
    bodyName?: string;
}

class BodyConfiguration {
    public mass: number;
    public radius: number;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public isMovable: boolean;
    public readonly rotationPeriod: null | number;

    public bodyName: string;

    public constructor( mass: number, radius: number, x: number, y: number, vx: number, vy: number, providedOptions?: BodyConfigurationOptions ) {
        const options = optionize<BodyConfigurationOptions>()( {
            rotationPeriod: null, // period of rotation, in seconds - null corresponds to no rotation
            bodyName: 'Planet',
        }, providedOptions ) as Required<BodyConfigurationOptions>;

        this.isMovable = true;  // True if the object moves based on physics (even non-isMovable things can be dragged though)
        this.mass = mass;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rotationPeriod = options.rotationPeriod;

        this.bodyName = options.bodyName;
    }

    public getMomentum(): Vector2 {
        return new Vector2( this.vx * this.mass, this.vy * this.mass );
    }
}

labTatasurya.register( 'BodyConfiguration', BodyConfiguration );
export default BodyConfiguration;