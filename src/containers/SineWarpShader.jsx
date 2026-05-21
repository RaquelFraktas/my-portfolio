import { useEffect, useRef } from "react";

// ── Vertex shader ─────────────────────────────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0., 1.); }
`;

// ── Fragment shader (ported from Shadertoy) ───────────────────────────────────
// Changes from original:
//   iTime       → u_time
//   iResolution → u_res
//   iChannel0   → u_tex  (supply your own texture, or use the procedural fallback)
const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform sampler2D u_tex;
uniform bool  u_hasTexture;

vec2 W(vec2 p){
    p = (p + 3.)*4.;
    float t = u_time / 2.;
    for(int i = 0; i < 3; i++){
        p += cos(p.yx*3. + vec2(t, 1.57))/3.;
        p += sin(p.yx + t + vec2(1.57, 0.))/2.;
        p *= 1.3;
    }
    p += fract(sin(p + vec2(13., 7.))*5e5)*.03 - .015;
    return mod(p, 2.) - 1.;
}

float bumpFunc(vec2 p){
    return length(W(p))*.7071;
}

vec3 smoothFract(vec3 x){ x = fract(x); return min(x, x*(1.-x)*12.); }

void main(){
    vec2 uv = (gl_FragCoord.xy - u_res*.5) / u_res.y;

    vec3 sp = vec3(uv, 0.);
    vec3 rd = normalize(vec3(uv, 1.));
    vec3 lp = vec3(cos(u_time)*.5, sin(u_time)*.2, -1.);
    vec3 sn = vec3(0., 0., -1.);

    vec2 eps = vec2(4./u_res.y, 0.);
    float f  = bumpFunc(sp.xy);
    float fx = bumpFunc(sp.xy - eps.xy);
    float fy = bumpFunc(sp.xy - eps.yx);

    const float bumpFactor = .05;
    fx = (fx - f)/eps.x;
    fy = (fy - f)/eps.x;
    sn = normalize(sn + vec3(fx, fy, 0.)*bumpFactor);

    vec3 ld = lp - sp;
    float lDist = max(length(ld), .0001);
    ld /= lDist;

    float atten = 1./(1. + lDist*lDist*.15);
    atten *= f*.9 + .1;

    float diff = max(dot(sn, ld), 0.);
    diff = pow(diff, 4.)*.66 + pow(diff, 8.)*.34;
    float spec = pow(max(dot(reflect(-ld, sn), -rd), 0.), 12.);

    vec3 texCol;
    if(u_hasTexture){
        // Wrap texture coords into [0,1] range
        vec2 texUV = fract(sp.xy*0.5 + 0.5 + W(sp.xy)/8.);
        texCol = texture2D(u_tex, texUV).xyz;
        texCol *= texCol;
        texCol = smoothstep(.05, .75, pow(texCol, vec3(.75, .8, .85)));
    } else {
        // Procedural fallback — looks great without any texture
        texCol = smoothFract(W(sp.xy).xyy)*.1 + .2;
    }

    vec3 col = (texCol*(diff*vec3(1., .97, .92)*2. + .5) + vec3(1., .6, .2)*spec*2.)*atten;

    float ref = max(dot(reflect(rd, sn), vec3(1.)), 0.);
    col += col*pow(ref, 4.)*vec3(.25, .5, 1.)*3.;

    gl_FragColor = vec4(sqrt(clamp(col, 0., 1.)), 1.);
}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function loadTexture(gl, url) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // 1×1 placeholder while the image loads
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([128, 128, 128, 255]));

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  };
  img.src = url;
  return tex;
}

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * SineWarpShader
 *
 * Props:
 *   textureUrl  {string}   Optional image URL for iChannel0.
 *                          Leave undefined to use the built-in procedural look.
 *   style       {object}   Extra styles applied to the <canvas>.
 *   className   {string}   CSS class for the <canvas>.
 */
export default function SineWarpShader({ textureUrl, style = {}, className }) {
  const canvasRef    = useRef(null);
  const texUrlRef    = useRef(textureUrl);

  useEffect(() => { texUrlRef.current = textureUrl; }, [textureUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) { console.error("WebGL not supported"); return; }

    // Build program
    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uRes        = gl.getUniformLocation(prog, "u_res");
    const uTime       = gl.getUniformLocation(prog, "u_time");
    const uTex        = gl.getUniformLocation(prog, "u_tex");
    const uHasTex     = gl.getUniformLocation(prog, "u_hasTexture");

    // Texture
    let glTex = null;
    if (texUrlRef.current) {
      glTex = loadTexture(gl, texUrlRef.current);
    }

    // Resize
    function resize() {
      canvas.width  = canvas.clientWidth  * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Render loop
    let rafId, startTime = null;
    function frame(ts) {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);

      if (glTex) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTex);
        gl.uniform1i(uTex, 0);
        gl.uniform1i(uHasTex, 1);
      } else {
        gl.uniform1i(uHasTex, 0);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (glTex) gl.deleteTexture(glTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
