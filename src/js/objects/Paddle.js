const THREE = require(`three`);

class Paddle {
  constructor(paddleWidth, paddleHeight, paddleDepth, paddleMaterial) {
    // this.paddleMaterial = paddleMaterial;
    const paddle = new THREE.Mesh(

      new THREE.CubeGeometry(
      paddleWidth,
      paddleHeight,
      paddleDepth,
      1,
      1,
      1),

      paddleMaterial);
    paddle.receiveShadow = true;
    paddle.castShadow = true;
    return paddle;
  }
}
export default Paddle;
