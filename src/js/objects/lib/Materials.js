const THREE = require(`three`);
import Colors from './Colors';

const Materials = {
  paddle1Material() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.white
      });
  },
  paddle2Material() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.white
      });
  },
  // create the plane's material
  planeMaterial() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.black
      });
  },
  // create the ground's material
  groundMaterial() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.black
      });
  },
  // // create the sphere's material
  sphereMaterial() {
    return new THREE.MeshLambertMaterial(
      {
        color: Colors.white
      });
  }
};

export default Materials;
