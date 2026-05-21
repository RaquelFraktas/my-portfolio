import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos,0.,1.); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform float u_speed;
uniform float u_cover;
uniform float u_tod;

float hash(vec2 p){
  p = fract(p * vec2(127.1,311.7));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.-2.*f);
  float a=hash(i), b=hash(i+vec2(1.,0.)),
        c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,amp=0.5;
  for(int i=0;i<6;i++){ v+=amp*noise(p); p*=2.1; amp*=0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  uv.y = 1.-uv.y;
  float t = u_time * u_speed;
  vec2 q = vec2(fbm(uv+vec2(0.,0.)), fbm(uv+vec2(5.2,1.3)));
  vec2 r = vec2(fbm(uv+4.*q+vec2(1.7,9.2)+t*0.15),
                fbm(uv+4.*q+vec2(8.3,2.8)+t*0.12));
  float f = fbm(uv+4.*r+t*0.1);
  float cloud = smoothstep((1.-u_cover)-.1,(1.-u_cover)+.2,f);
  vec3 skyTop = mix(vec3(.02,.02,.08),vec3(.05,.2,.6),smoothstep(0.,.5,u_tod));
  skyTop = mix(skyTop,vec3(.35,.6,.85),smoothstep(.4,.7,u_tod));
  skyTop = mix(skyTop,vec3(.05,.1,.4),smoothstep(.85,1.,u_tod));
  vec3 skyBot = mix(vec3(.02,.02,.1),vec3(.65,.35,.15),smoothstep(.2,.55,u_tod));
  skyBot = mix(skyBot,vec3(.55,.75,.95),smoothstep(.5,.75,u_tod));
  skyBot = mix(skyBot,vec3(.07,.15,.5),smoothstep(.85,1.,u_tod));
  vec3 sky = mix(skyBot,skyTop,pow(uv.y,.5));
  float sunLight = clamp(u_tod*1.3-.1,0.,1.);
  vec3 cloudLight = mix(vec3(.4,.35,.55),vec3(1.,1.,1.),sunLight);
  vec3 cloudShadow = mix(vec3(.1,.1,.15),vec3(.65,.68,.75),sunLight);
  float depth = fbm(uv*3.+r*2.+t*0.08);
  vec3 cloudColor = mix(cloudShadow,cloudLight,smoothstep(.3,.8,depth));
  gl_FragColor = vec4(mix(sky,cloudColor,cloud),1.);
}
`;

function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function CloudShader({
  speed = 1,
  coverage = 0.5,
  timeOfDay = 0.6,
  style = {},
}) {
  const canvasRef = useRef(null);
  const propsRef  = useRef({ speed, coverage, timeOfDay });

  // Keep latest prop values accessible inside the RAF loop without restarting it
  useEffect(() => {
    propsRef.current = { speed, coverage, timeOfDay };
  }, [speed, coverage, timeOfDay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uSpeed = gl.getUniformLocation(prog, "u_speed");
    const uCover = gl.getUniformLocation(prog, "u_cover");
    const uTod   = gl.getUniformLocation(prog, "u_tod");

    function resize() {
      canvas.width  = canvas.clientWidth  * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rafId;
    let startTime = null;

    function frame(ts) {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;
      const { speed, coverage, timeOfDay } = propsRef.current;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uCover, coverage);
      gl.uniform1f(uTod, timeOfDay);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []); // runs once — props flow through propsRef

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
