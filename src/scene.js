/**
 *
 * @author slouppetr@gmail.com (Petr Sloup)
 *
 */

goog.provide('cool3d.Scene');

var mat4 = window['mat4'];



/**
 * @param {!WebGLRenderingContext} context .
 * @constructor
 */
cool3d.Scene = function(context) {
  this.context_ = context;

  var gl = this.context_;

  //gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // init shaders
  var compShader = function(type, str) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }
  var fragmentShader = compShader(gl.FRAGMENT_SHADER,
      'precision mediump float;varying vec4 vColor;' +
      'void main(void) {gl_FragColor = vColor;}');
  var vertexShader = compShader(gl.VERTEX_SHADER,
      'attribute vec3 aVertexPosition;attribute vec4 aVertexColor;' +
      'uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec4 vColor;' +
      'void main(void) {vColor = aVertexColor;' +
      'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);}');

  this.shaderProgram = gl.createProgram();
  var shaderProgram = this.shaderProgram;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Could not initialise shaders');
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute =
      gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute =
      gl.getAttribLocation(shaderProgram, 'aVertexColor');
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  shaderProgram.pMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'uPMatrix');
  shaderProgram.mvMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'uMVMatrix');

  // init buffers
  this.pyramidVertexPositionBuffer_ = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexPositionBuffer_);
  var vertices = [
    // Front face
    0.0, 1.0, 0.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,

    // Right face
    0.0, 1.0, 0.0,
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0,

    // Back face
    0.0, 1.0, 0.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,

    // Left face
    0.0, 1.0, 0.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  this.pyramidVertexPositionBuffer_.itemSize = 3;
  this.pyramidVertexPositionBuffer_.numItems = 12;

  this.pyramidVertexColorBuffer_ = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexColorBuffer_);
  var colors = [
    // Front face
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // Right face
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,

    // Back face
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // Left face
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  this.pyramidVertexColorBuffer_.itemSize = 4;
  this.pyramidVertexColorBuffer_.numItems = 12;


  this.cubeVertexPositionBuffer_ = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer_);
  vertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  this.cubeVertexPositionBuffer_.itemSize = 3;
  this.cubeVertexPositionBuffer_.numItems = 24;

  this.cubeVertexColorBuffer_ = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer_);
  colors = [
    [0.5, 0.3, 0.3, 0.7], // Front face
    [0.6, 0.6, 0.6, 1.0], // Back face
    [0.0, 1.0, 0.0, 1.0], // Top face
    [1.0, 0.5, 0.5, 1.0], // Bottom face
    [1.0, 0.0, 1.0, 1.0], // Right face
    [0.0, 0.0, 1.0, 1.0]  // Left face
  ];
  var unpackedColors = [];
  for (var i in colors) {
    var color = colors[i];
    for (var j = 0; j < 4; j++) {
      unpackedColors = unpackedColors.concat(color);
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(unpackedColors), gl.STATIC_DRAW);
  this.cubeVertexColorBuffer_.itemSize = 4;
  this.cubeVertexColorBuffer_.numItems = 24;

  this.cubeVertexIndexBuffer_ = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer_);
  var cubeVertexIndices = [
    4, 5, 6, 4, 6, 7,    // Back face
    8, 9, 10, 8, 10, 11,  // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23,  // Left face
    0, 1, 2, 0, 2, 3    // Front face
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  this.cubeVertexIndexBuffer_.itemSize = 1;
  this.cubeVertexIndexBuffer_.numItems = 36;

  this.eyeAngleX_ = 0;
  this.eyeAngleY_ = 0;

  this.mvMatrix = mat4['create']();

  this.pMatrix = mat4['create']();
};


/**
 */
cool3d.Scene.prototype.setMatrixUniforms = function() {
  this.context_.uniformMatrix4fv(
      this.shaderProgram.pMatrixUniform, false, this.pMatrix);
  this.context_.uniformMatrix4fv(
      this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
};


/**
 * @param {number} x [-0.5; 0.5].
 * @param {number} y [-0.5; 0.5].
 * @param {number} distance Distance of the user from webcamera in scene units.
 * @param {number} fovy Vertical field-of-view of the webcam (in degrees).
 * @param {number} aspect Aspect ratio of the webcamera pictures.
 */
cool3d.Scene.prototype.setEye = function(x, y, distance, fovy, aspect) {
  fovy = fovy / 180 * Math.PI;

  //tune sensitivity
  x *= 1.5;
  y *= 2;

  var ysize = Math.tan(fovy / 2) * distance;
  var xsize = aspect * ysize;
  var angleY = Math.atan((y * ysize) / distance);
  var angleX = Math.atan((x * xsize) / distance);

  this.eyeAngleX_ = angleX;
  this.eyeAngleY_ = angleY;
};


/**
 */
cool3d.Scene.prototype.draw = function() {
  var gl = this.context_;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4['perspective'](45, gl.canvas.width / gl.canvas.height,
                      0.1, 100.0, this.pMatrix);

  //mat4['ortho'](-4, 4, -3, 3, 0.1, 100.0, this.pMatrix);

  //this.mvMatrix = mat4['lookAt']([0 + 1.5, 0 + 0.5, 7.5],
  //                               [1.5, 0.5, 0], [0, 1, 0]);
  mat4['identity'](this.mvMatrix);

  mat4['translate'](this.pMatrix, [-1.5, -1, -6.5]);
  mat4['multiply'](this.pMatrix,
      [1, 0, 0, 0,
       0, 1, 0, 0,
       Math.tan(this.eyeAngleX_), Math.tan(this.eyeAngleY_), 1, 0,
       0, 0, 0, 1], this.pMatrix);
  mat4['translate'](this.pMatrix, [0, 0, -1]);

  //mat4['rotateY'](this.mvMatrix, this.eyeAngleX_);
  //mat4['rotateX'](this.mvMatrix, -this.eyeAngleY_);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexPositionBuffer_);
  gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
      this.pyramidVertexPositionBuffer_.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexColorBuffer_);
  gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
      this.pyramidVertexColorBuffer_.itemSize, gl.FLOAT, false, 0, 0);

  this.setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, this.pyramidVertexPositionBuffer_.numItems);

  mat4['translate'](this.mvMatrix, [3.0, 0.0, 0.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer_);
  gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
      this.cubeVertexPositionBuffer_.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer_);
  gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
      this.cubeVertexColorBuffer_.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer_);
  this.setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer_.numItems,
                  gl.UNSIGNED_SHORT, 0);
};
