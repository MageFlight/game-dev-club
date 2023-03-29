import { log } from "merlin-game-engine";
import { RigidBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { Utils } from "merlin-game-engine/dist/utils";

export class MovementParameters { // TODO: Make this an interface or type (Probally interface)
    maxSpeed;
  
    maxAcceleration;
    maxAirAcceleration;
    deccelerationRate;
    airDeccelerationRate;
    airFriction;
    turnRate;
  
    jumpHeight;
    maxAirJumps;
    temporaryAirJumps = 0;
    jumpBuffer;
    coyoteTime;
  
    upwardGravity;
    downwardGravity;
  
    /**
     * The base set of movement contstraints for a movement controller.
     * @param {Number} maxSpeed The maximum speed of the object
     * @param {Number} maxAcceleration The maximum rate at which the object will speed up while grounded
     * @param {Number} maxAirAcceleration The maximum rate at which the object will speed up while airborne
     * @param {Number} deccelerationRate The maximum rate at which the object will slow down while grounded
     * @param {Number} airDeccelerationRate The maximum rate at which the object will slow down while airborne
     * @param {Number} airFriction The friction of the air: While airborne, the acceleration is divided by this value 
     * @param {Number} turnRate Multiplies the acceleration by this value when the targeted horizontal velocity is not the same sign as the actual velocity.
     * @param {Number} jumpHeight The height of the object's jump
     * @param {Number} maxAirJumps The maximum amount of jumps in the air
     * @param {Number} jumpBuffer The amount of time a jump is held down
     * @param {Number} coyoteTime The amount of time after walking off of a platform when a jump is allowed
     * @param {Number} upwardGravity The multiplier on gravity on the object when its velocity is upwards.
     * @param {Number} downwardGravity The multiplier on gravity on the object when its velocity is 0 or downwards.
     */
    constructor(
      maxSpeed: number,
      maxAcceleration: number,
      maxAirAcceleration: number,
      deccelerationRate: number,
      airDeccelerationRate: number,
      airFriction: number,
      turnRate: number,
      jumpHeight: number,
      maxAirJumps: number,
      jumpBuffer: number,
      coyoteTime: number,
      upwardGravity: number,
      downwardGravity: number
    ) {
      this.maxSpeed = maxSpeed;
      
      this.maxAcceleration = maxAcceleration;
      this.maxAirAcceleration = maxAirAcceleration;
      this.deccelerationRate = deccelerationRate;
      this.airDeccelerationRate = airDeccelerationRate;
      this.airFriction = airFriction;
      this.turnRate = turnRate;
  
      this.jumpHeight = jumpHeight;
      this.maxAirJumps = maxAirJumps;
  
      this.jumpBuffer = jumpBuffer;
      this.coyoteTime = coyoteTime;
      
      this.upwardGravity = upwardGravity;
      this.downwardGravity = downwardGravity;
    }
  
    clone() {
      return new MovementParameters(
        this.maxSpeed,
        this.maxAcceleration,
        this.maxAirAcceleration,
        this.deccelerationRate,
        this.airDeccelerationRate,
        this.airFriction,
        this.turnRate,
        this.jumpHeight,
        this.maxAirJumps,
        this.upwardGravity,
        this.jumpBuffer,
        this.upwardGravity,
        this.downwardGravity
      );
    }
  }
  
  export class MovementController {
    private movementParameters: MovementParameters;
  
    private velocity = Vector2.zero();
    private gravityMultiplier = 1;
  
    private jumpsUsed = 0;
  
    private jumped = false;
    private coyoteJumpAllowed: boolean = false;
    private coyoteJumpLocked: boolean = false;
  
    private attemptingJump = false;
  
    /**
     * A movement controller computes what an object's velocity should be based on the player input and the movement parameters.
     * @param {MovementParameters} movementParameters The initial movement parameters that constrain the object's movement
     */
    constructor(movementParameters: MovementParameters) {
      this.movementParameters = movementParameters;
    }
  
    getMovementParameters(): MovementParameters {
      return this.movementParameters;
    }
  
    setMovementParameters(newParameters: MovementParameters) {
      this.movementParameters = newParameters;
    }
  
    /**
     * Calculates the new velocity for the object, using the constraints and current velocity.
     * @param {Number} desiredHorizontalDirection The direction to accelerate towards. -1 is left, 1 is right, and 0 is stop
     * @param {boolean} jumpDesired Determines whether a jump should be attempted.
     * @param {RigidBody | null} groundPlatform The RigidBody that the object is standing on. If airborne, this is null.
     * @param {Number} downDirection The direction of the ground. -1 is up relative to the screen, and 1 is down relative to the screen
     * @param {Number} dt The elapsed time since the start of the previous frame
     * @param {PhysicsEngine} physics The physics engine used in physics calculations
     * @returns The desired velocity after taking into account the current velocity and constraits.
     */
    computeVelocity(desiredHorizontalDirection: number, jumpDesired: boolean, groundPlatform: RigidBody | null, downDirection: number, physics: PhysicsEngine, dt: number) {
      const onGround = groundPlatform != null;
      log("onGround: ", onGround);
      this.jumped = this.jumped && !onGround;
      log("jumped: ", this.jumped);
  
      // Coyote time
      this.coyoteJumpLocked = !onGround && this.coyoteJumpLocked;
      log("coyoteJumpAllowed: ", this.coyoteJumpAllowed);
      log("coyoteJumpLocked: ", this.coyoteJumpLocked);
      if (!this.jumped && !onGround && !this.coyoteJumpAllowed && !this.coyoteJumpLocked) {
        this.coyoteJumpAllowed = true;
        Utils.timer(() => {
          log("resetCoyote");
          this.coyoteJumpAllowed = false;
          this.coyoteJumpLocked = true;
        }, this.movementParameters.coyoteTime, false);
      }
  
      // Horizontal Movement
      let acceleration = 0;
      if (desiredHorizontalDirection == 0) { // Deceleration
        acceleration = onGround ? this.movementParameters.deccelerationRate : this.movementParameters.airDeccelerationRate;
      } else {
        acceleration = onGround ? this.movementParameters.maxAcceleration : this.movementParameters.maxAirAcceleration;
  
        if (desiredHorizontalDirection != Math.sign(this.velocity.x)) { // Turning
          acceleration *= this.movementParameters.turnRate;
        }
      }
  
      acceleration /= onGround ? groundPlatform.getFriction() : this.movementParameters.airFriction;
      this.velocity.x = Utils.moveTowards(this.velocity.x, desiredHorizontalDirection * this.movementParameters.maxSpeed, acceleration * dt);
  
      //// Vertical Movement ////
      // Jumping
      if (onGround) this.jumpsUsed = 0;
  
      if (!this.attemptingJump && jumpDesired) {
        this.attemptingJump = true;
        Utils.timer(() => this.attemptingJump = false, this.movementParameters.jumpBuffer, false);
      }
  
      log("jumping: ", this.jumped);
      log("jumpDesired: " + jumpDesired);
      log("atteptingJump: " + this.attemptingJump);
      if (((onGround || this.coyoteJumpAllowed) || this.jumpsUsed < this.movementParameters.maxAirJumps || ((this.jumpsUsed >= this.movementParameters.maxAirJumps) && this.movementParameters.temporaryAirJumps)) && this.attemptingJump) {
        this.jumped = true;
        this.attemptingJump = false;
  
        if ((this.jumpsUsed >= this.movementParameters.maxAirJumps) && this.movementParameters.temporaryAirJumps > 0 && !(onGround || this.coyoteJumpAllowed)) {
          this.movementParameters.temporaryAirJumps--;
        } else if (!(onGround || this.coyoteJumpAllowed)) {
          this.jumpsUsed++;
        }
  
        let jumpSpeed = -Math.sqrt(-4 * this.movementParameters.jumpHeight * -(physics.getGravity() * this.movementParameters.upwardGravity)) * downDirection; // Gravity is inverted because y-axis is inverted (relative to math direction) in Andromeda Game Engine.
  
        log("jumpSpeed: ", jumpSpeed);
        // Making jump height constant in air jump environments
        if (this.velocity.y < 0) {
          jumpSpeed = jumpSpeed - this.velocity.y;
        } else if (this.velocity.y > 0) {
          jumpSpeed -= this.velocity.y;
        }
  
        this.velocity.y += jumpSpeed;
      }
  
      // Special Gravity
  
      if (this.velocity.y * downDirection < 0) {
        this.gravityMultiplier = this.movementParameters.upwardGravity * downDirection;
      } else if (this.velocity.y * downDirection > 0) {
        this.gravityMultiplier = this.movementParameters.downwardGravity * downDirection;
      } else {
        this.gravityMultiplier = downDirection;
      }
  
      // Apply Gravity
      this.velocity.y += physics.getGravity() * this.gravityMultiplier * dt;
  
      return this.velocity;
    }
    
    reset() {
      this.velocity = Vector2.zero();
      this.gravityMultiplier = 1;
    }
  }