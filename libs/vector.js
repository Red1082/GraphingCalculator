class Vector {
    /**
     * Creates a 2D vector.
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0) {
        handleNaN(x, y);
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {number} The magnitude of the vector.
     */
    mag() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Normalizes the vector, by seting its magnitude to 1.
     * @returns {Vector}
     */
    normalize() {
        const mag = this.mag();
        return this.div(mag);
    }

    /**
     * Sets the magnitude of the vector to a new value.
     * @param {number} value 
     * @returns {Vector}
     */
    setMag(value) {
        handleNaN(value);
        return this.normalize().mult(value);
    }

    /**
     * Adds one or more vectors to this one and returns the result.
     * @param {Vector[]} args
     * @returns {Vector}.
     */
    add(...args) {
        args.forEach(elem => {
            if (!(elem instanceof Vector))
                return console.error(`'${elem}' is not a Vector.`);
            this.x += elem.x;
            this.y += elem.y;
        });
        return this;
    }

    /**
     * Subtracts one or more vectors from this one and returns the result.
     * @param  {Vector[]} args 
     * @returns {Vector}
     */
    sub(...args) {
        args.forEach(elem => {
            if (!(elem instanceof Vector)) {
                return console.error(`'${elem}' is not a Vector.`);
            }
            this.x -= elem.x;
            this.y -= elem.y;
        });
        return this;
    }

    /**
     * Multiplies the vector by a scalar.
     * @param {number} value 
     * @returns {Vector}
     */
    mult(value) {
        handleNaN(value);
        this.x *= value;
        this.y *= value;
        return this;
    }

    /**
     * Divides the vector by a scalar.
     * @param {number} value 
     * @returns {Vector}
     */
    div(value) {
        handleNaN(value);
        if (value === 0) {
            console.warn(`/ 0`);
        } else {
            this.x /= value;
            this.y /= value;
        }
        return this;
    }

    /**
     * Returns a copy of this vector.;
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.x, this.y);
    }

    /**
     * Returns the angle (radians) of the vector.
     * @returns {number} A numeric expression representing the angle of the vector.
     */
    heading() {
        return Math.atan2(this.y, this.x);
    }

    set(...args) {
        if (args[0] instanceof Vector) {
            this.x = args[0].x;
            this.y = args[0].y;
        } else {
            this.x = args[0];
            this.y = args[1];
        }
        return this;
    }

    /**
     * Returns an object containing the components of the vector.
     * Example: {x:3, y:4}
     * @returns {object}
     */
    asObject() {
        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Returns the vector given by the input angle (radians).
     * @param {number} value 
     * @returns {Vector}
     */
    static fromAngle(value) {
        return new Vector(Math.cos(value), Math.sin(value));
    }

    /**
     * Returns the sum of the input vectors.
     * @param  {Vector[]} args 
     * @returns {Vector}
     */
    static add(...args) {
        return new Vector().add(...args);
    }

    /**
     * Subtracts one or more vectors from the first vector and returns the result.
     * @param {Vector[]} args 
     * @returns {Vector}
     */
    static sub(...args) {
        return args[0].copy().sub(...args.splice(1));
    }

    static div(a, b) {
        return new Vector(
            a.x / b.x,
            a.y / b.y,
        );
    }

    /**
     * Linearly interpolates between two vectors.
     * @param {Vector} a
     * @param {Vector} b
     * @param {number} t
     * @returns {Vector}
     */
    static lerp(a, b, t) {
        return new Vector(
            (1 - t) * a.x + t * b.x,
            (1 - t) * a.y + t * b.y
        );
    }
}

const handleNaN = (...args) =>
    args.filter(elem =>
        typeof elem !== 'number'
            ? console.error(`'${elem}' is NaN.`)
            : true
    );

export default Vector;