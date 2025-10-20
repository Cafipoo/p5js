import * as THREE from 'three';

export default class Bullet extends THREE.Group {
    constructor(robot) {
        super();
        this.robot = robot;
         // Create a bullet
        this.bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshLambertMaterial({ color: 0xff0000 })
        );
        this.bullet.rotateX(Math.PI / 2);
        this.bullet.castShadow = true;
        this.bullet.name = "bullet";
        this.add(this.bullet);
        this.visible = false;
    }

    fire() {
        // Removed anti-spam protection for continuous firing
        this.bullet.position.copy(this.robot.position);
        this.bullet.position.y += 5;
        this.bullet.position.x -= 2.3;
        this.bullet.position.z += 2.3;
        // Make the bullet point in the same direction as the robot
        this.bullet.rotation.y = this.robot.rotation.y;
        console.log(this.bullet.rotation.y);
        this.visible = true;
        this.count = 0;
    }

    update() {
        if (!this.visible) return;
        this.count++;
        this.bullet.position.x += Math.sin(this.bullet.rotation.y);
        this.bullet.position.z += Math.cos(this.bullet.rotation.y);
        if (this.count > 100) {
            this.visible = false;
        }
    }
}