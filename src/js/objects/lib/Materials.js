const THREE = require(`three`);
import Colors from './Colors';

const Materials = {
  paddle1Material() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.blue
      });
  },
  paddle2Material() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.red
      });
  },
  // create the plane's material
  planeMaterial() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.green
      });
  },
  // create the ground's material
  groundMaterial() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.grey
      });
  },
  // // create the sphere's material
  sphereMaterial() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.red
      });
  }
};

export default Materials;
