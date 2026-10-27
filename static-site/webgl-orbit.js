/* A real WebGL 3D latitude/longitude sculpture. No runtime CDN, no fake video.
   Graceful degradation: original CSS dimensional rings remain when WebGL is unavailable. */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.querySelector('#webgl-orbit');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: false, powerPreference: 'low-power' });
  if (!gl) return;
  const vert = `
    attribute vec3 aPosition;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uAspect;
    varying float vDepth;
    void main() {
      float ay = uTime * 0.12 + uPointer.x * 0.30;
      float ax = 0.29 + sin(uTime * 0.15) * 0.10 + uPointer.y * 0.19;
      mat3 ry = mat3(cos(ay),0.0,sin(ay), 0.0,1.0,0.0, -sin(ay),0.0,cos(ay));
      mat3 rx = mat3(1.0,0.0,0.0, 0.0,cos(ax),-sin(ax), 0.0,sin(ax),cos(ax));
      vec3 p = rx * ry * aPosition;
      float projection = 2.70/(3.80-p.z);
      vec2 position = p.xy * projection * 0.76;
      position.x /= max(1.0,uAspect);
      gl_Position = vec4(position,0.0,1.0);
      vDepth = p.z;
    }`;
  const frag = `
    precision mediump float;
    varying float vDepth;
    void main() {
      float alpha = 0.10 + (vDepth + 1.0) * 0.18;
      vec3 color = mix(vec3(0.37,0.58,0.44), vec3(0.76,0.87,0.70), smoothstep(-1.0,1.0,vDepth));
      gl_FragColor = vec4(color,alpha);
    }`;
  function compile(type, src) {
    const shader=gl.createShader(type);gl.shaderSource(shader,src);gl.compileShader(shader);
    if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  const vs=compile(gl.VERTEX_SHADER,vert),fs=compile(gl.FRAGMENT_SHADER,frag);
  if(!vs||!fs)return;
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  gl.useProgram(program);
  const coords=[];
  function sphere(theta,phi){return [Math.cos(phi)*Math.sin(theta),Math.sin(phi),Math.cos(phi)*Math.cos(theta)];}
  function line(a,b){coords.push(...a,...b);}
  const lon=54,lat=21;
  for(let j=-lat/2;j<=lat/2;j++){
    const phi=(j/(lat/2))*Math.PI*.47;
    for(let k=0;k<lon;k++)line(sphere(k*2*Math.PI/lon,phi),sphere((k+1)*2*Math.PI/lon,phi));
  }
  for(let k=0;k<20;k++){
    const theta=k*2*Math.PI/20;
    for(let j=0;j<lat;j++){
      const a=(-.5+j/lat)*Math.PI,b=(-.5+(j+1)/lat)*Math.PI;
      line(sphere(theta,a),sphere(theta,b));
    }
  }
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(coords),gl.STATIC_DRAW);
  const ap=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,0,0);
  const time=gl.getUniformLocation(program,'uTime'),pointer=gl.getUniformLocation(program,'uPointer'),aspect=gl.getUniformLocation(program,'uAspect');
  const observer=new IntersectionObserver(entries=>visible=entries[0].isIntersecting,{threshold:0});
  let visible=true,last=0,px=0,py=0,tx=0,ty=0,raf=0;
  observer.observe(canvas);
  const scene=document.querySelector('.hero-scene');
  scene?.addEventListener('pointermove',e=>{
    if(matchMedia('(pointer:coarse)').matches)return;
    const r=scene.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*2;ty=((e.clientY-r.top)/r.height-.5)*2;
  },{passive:true});
  scene?.addEventListener('pointerleave',()=>{tx=0;ty=0});
  const mobile=matchMedia('(pointer:coarse)').matches;
  function frame(ms){
    raf=requestAnimationFrame(frame);
    if(!visible||document.hidden||ms-last<(mobile?42:25))return;
    last=ms;const rect=canvas.getBoundingClientRect();
    if(rect.width<1||rect.height<1)return;
    const dpr=Math.min(devicePixelRatio||1,mobile?1.2:1.5);
    const width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
    px+=(tx-px)*.065;py+=(ty-py)*.065;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(time,ms/1000);gl.uniform2f(pointer,px,py);gl.uniform1f(aspect,Math.max(.8,rect.width/rect.height));
    gl.drawArrays(gl.LINES,0,coords.length/3);
  }
  raf=requestAnimationFrame(frame);
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);observer.disconnect();},{once:true});
})();
