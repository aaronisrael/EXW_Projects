const THREE = require(`three`);

import Materials from './lib/Materials';

class Ball {
  constructor(RADIUS, SEGMENTS, RINGS) {

    const ball = new THREE.Mesh(

      new THREE.SphereGeometry(
      RADIUS,
      SEGMENTS,
      RINGS),

      Materials.sphereMaterial());
    return ball;
  }
}

export default Ball;
