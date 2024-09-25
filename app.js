window.onload = function () {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program with uniform color input
    const fsSource = `
        precision mediump float;
        uniform vec4 uFragColor;
        void main() {
            gl_FragColor = uFragColor;
        }
    `;

    // Initialize a shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Get the attribute and uniform locations
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const fragColor = gl.getUniformLocation(shaderProgram, 'uFragColor');

    // Create a buffer for the rectangle's positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.7,  0.5,
         0.7,  0.5,
        -0.7, -0.5,
         0.7, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Tell WebGL how to pull out the positions from the buffer
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Use the shader program
    gl.useProgram(shaderProgram);

    // Function to render the shape with the selected color
    function render(color) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform4fv(fragColor, color);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Initial rendering with the default color (red)
    render([1.0, 0.0, 0.0, 1.0]);

    // Button event listeners to change colors
    document.getElementById('color1').addEventListener('click', () => {
        render([1.0, 0.0, 0.0, 1.0]); // Red
    });

    document.getElementById('color2').addEventListener('click', () => {
        render([0.0, 1.0, 0.0, 1.0]); // Green
    });

    document.getElementById('color3').addEventListener('click', () => {
        render([0.0, 0.0, 1.0, 1.0]); // Blue
    });

    document.getElementById('resetColor').addEventListener('click', () => {
        render([1.0, 0.0, 0.0, 1.0]); // (Reset)
    });
};

// Initialize a shader program
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader, uploads the source and compiles it
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}