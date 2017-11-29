const THREE = require(`three`);

import Materials from './lib/Materials';

class Ground {
  constructor() {
    const ground = new THREE.Mesh(
      new THREE.CubeGeometry(
      1000,
      1000,
      3,
      1,
      1,
      1),
      Materials.groundMaterial()
    );

    ground.position.z = - 132;
    ground.receiveShadow = true;
    return ground;
  }
}

export default Ground;
