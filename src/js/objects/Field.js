const THREE = require(`three`);

import Materials from './lib/Materials';

class Field {
  constructor(tableWidth, planeHeight, planeQuality) {
    const field = new THREE.Mesh(

      new THREE.PlaneGeometry(
      tableWidth * 0.95,  // 95% of table width, since we want to show where the ball goes out-of-bounds
      planeHeight,
      planeQuality,
      planeQuality),
      Materials.planeMaterial());
    return field;
  }
}

export default Field;
