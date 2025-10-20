import * as THREE from 'three';

export default class Figure extends THREE.Group{
    constructor(params) {
        super();
        this.params = {
            x: 0,
            y: 1.4,
            z: 0,
            ry: 0,
            armRotation: 0,
            headRotation: 0,
            leftEyeScale: 1,
            walkRotation: 0
        };
        this.position.x = this.params.x;
        this.position.y = this.params.y;
        this.position.z = this.params.z;
        this.headHue = random(0, 360);
        this.bodyHue = random(0, 360);
        this.headLightness = random(40, 65);
        this.headMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)` });
        this.bodyMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.bodyHue}, 85%, 50%)` });
        this.arms = [];
        this.legs = [];
    }

    createBody() {
        this.body = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1.5, 1);
        const bodyMain = new THREE.Mesh(geometry, this.bodyMaterial);
        bodyMain.castShadow = true;
        this.body.add(bodyMain);
        this.add(this.body);
    }

    createHead() {
        this.head = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.8, 32, 32); // Utilisation d'une sphère
        const headMain = new THREE.Mesh(geometry, this.headMaterial);
        headMain.castShadow = true;
        this.head.add(headMain);
        this.add(this.head);
        this.head.position.y = 1.65;
        this.createEyes();

        // Antennes
        const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8); // Customize the size as needed
        const antenna1 = new THREE.Mesh(antennaGeometry, this.headMaterial);
        const antenna2 = new THREE.Mesh(antennaGeometry, this.headMaterial);

        // Position and rotate the antennas
        antenna1.position.set(0.55, 0.8, 0); // Adjust the positions
        antenna2.position.set(-0.55, 0.8, 0); // Adjust the positions
        antenna1.rotation.z = -Math.PI / 6; // Adjust the rotations
        antenna2.rotation.z = Math.PI / 6; // Adjust the rotations

        // Add the antennas to the head
        this.head.add(antenna1);
        this.head.add(antenna2);

    }

    createArms() {
        const height = 0.85;
        for (let i = 0; i < 2; i++) {
            const armGroup = new THREE.Group();
            const geometry = new THREE.BoxGeometry(0.25, height, 0.25);
            const arm = new THREE.Mesh(geometry, this.headMaterial);
            const m = i % 2 === 0 ? 1 : -1;
            arm.castShadow = true;
            armGroup.add(arm);
            this.body.add(armGroup);
            arm.position.y = height * -0.5;
            armGroup.position.x = m * 0.8;
            armGroup.position.y = 0.6;
            armGroup.rotation.z = degreesToRadians(30 * m);
            this.arms.push(armGroup);
        }
    }

    createEyes() {
        const eyes = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.15, 12, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x44445c });
        for (let i = 0; i < 2; i++) {
            const eye = new THREE.Mesh(geometry, material);
            const m = i % 2 === 0 ? 1 : -1;
            eyes.add(eye);
            eye.position.x = 0.36 * m;
            // Store leftEye for idle animation
            if (m == 1) this.leftEye = eye;
        }
        this.head.add(eyes);
        eyes.position.y = -0.1;
        eyes.position.z = 0.7;
    }

    createLegs() {
        const legsGroup = new THREE.Group();
        const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25);
        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(geometry, this.headMaterial);
            const m = i % 2 === 0 ? 1 : -1;
            legsGroup.add(leg);
            leg.position.x = m * 0.22;
            this.legs.push(leg);
        }
        this.add(legsGroup);
        legsGroup.position.y = -1.15;
        this.body.add(legsGroup);
    }

    update() {
        // Vertical position
        this.position.y = this.params.y;
        // Ground position
        this.position.x = this.params.x;
        this.position.z = this.params.z;
        // Vertical rotation
        this.rotation.y = this.params.ry;

        // Arms animation
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            // Jump
            arm.rotation.z = this.params.armRotation * m;
            // Walk
            arm.rotation.x = this.params.walkRotation * -m;
        });

        // Idle animation
        this.leftEye.scale.x = this.leftEye.scale.y = this.leftEye.scale.z = this.params.leftEyeScale;
		this.head.rotation.z = this.params.headRotation;

        // Legs animation (walk)
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            leg.rotation.x = this.params.walkRotation * m;
        });
    }

    init() {
        this.createBody();
        this.createHead();
        this.createArms();
        this.createLegs();
    }
}