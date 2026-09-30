/* ============================================================
   Emmitec.health — fundos vivos
   - glGradient: gradiente líquido em WebGL (hero). Ruído com
     "domain warping": as cores do ciano escorrem como seda, num
     fluxo lento e contínuo. Meia resolução, pausa fora da tela.
   - blobsField: sem WebGL, manchas desfocadas que passeiam.
   - softShader: gradiente 2D suave (rodapé, CTA).
   Todas devolvem uma função de limpeza (troca de rota).
   ============================================================ */
import { RM, damp, lerp } from './motion'

type Cleanup = () => void
type RGB = [number, number, number]

function hex(c: string): RGB {
  c = (c || '').trim()
  if (c[0] !== '#') return [17, 211, 211]
  if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
}

function tokenColor(cs: CSSStyleDeclaration, name: string, fallback: string) {
  return hex(cs.getPropertyValue(name) || fallback)
}

/** Observa visibilidade e tamanho; devolve a limpeza dos observers. */
function observe(el: Element, onResize: () => void, onVisible: (v: boolean) => void): Cleanup {
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null
  ro?.observe(el)
  const io =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver((en) => onVisible(!!en[0]?.isIntersecting))
      : null
  io?.observe(el)
  return () => {
    ro?.disconnect()
    io?.disconnect()
  }
}

/**
 * Na troca de página o Vue desmonta os componentes assim que a página começa a sair,
 * mas ela continua visível (subindo) até a animação terminar. Por isso seguimos
 * animando até o elemento sair do documento e só então liberamos os recursos.
 */
function whenDetached(el: Element, kill: () => void) {
  const t0 = performance.now()
  const check = () => {
    if (!el.isConnected || performance.now() - t0 > 5000) kill()
    else window.setTimeout(check, 200)
  }
  window.setTimeout(check, 200)
}

function trackPointer(host: HTMLElement, set: (x: number, y: number) => void): Cleanup {
  const fn = (e: PointerEvent) => {
    const r = host.getBoundingClientRect()
    set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)
  }
  host.addEventListener('pointermove', fn)
  return () => host.removeEventListener('pointermove', fn)
}

/* ---------------------------------------------------------------
   WebGL
   --------------------------------------------------------------- */
const GL_FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;
uniform vec3 c_brand, c_light, c_tint, c_blue, c_white, c_bg, c_deep;
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
 vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx); vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
 vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
 vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
 vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
 vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
 m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
 vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g);}
float fbm(vec2 p){float f=0.0; float a=0.55; mat2 r=mat2(0.8,-0.6,0.6,0.8);
 for(int i=0;i<3;i++){f+=a*snoise(p); p=r*p*1.9; a*=0.4;} return f;}
void main(){
 vec2 uv=gl_FragCoord.xy/u_res; float asp=u_res.x/u_res.y;
 vec2 p=vec2(uv.x*asp,uv.y)*0.36 + (u_mouse-0.5)*vec2(0.12,-0.08);
 float t=u_time*0.022;
 vec2 q=vec2(fbm(p+vec2(0.0,t)), fbm(p+vec2(3.1,1.7)-t*0.8));
 vec2 r=vec2(fbm(p+1.3*q+vec2(1.7,9.2)+t*0.6), fbm(p+1.3*q+vec2(8.3,2.8)-t*0.5));
 float f=fbm(p+1.5*r+t*0.15);
 vec3 col=mix(c_white,c_bg,0.35);
 col=mix(col,c_tint,smoothstep(-0.45,0.25,f));
 col=mix(col,c_blue,smoothstep(-0.1,0.6,r.y)*0.6);
 col=mix(col,c_light,smoothstep(-0.1,0.65,r.x)*0.7);
 col=mix(col,c_brand,smoothstep(0.08,0.72,f+q.x*0.35)*0.72);
 col=mix(col,c_deep,smoothstep(0.4,0.95,f+q.x*0.35)*0.25);
 col=mix(col,c_white,smoothstep(0.1,0.6,-f-q.y*0.4)*0.6);
 float sheen=smoothstep(0.0,1.0,0.5+0.5*sin(f*3.0+r.x*2.0+t*1.5));
 col+=pow(sheen,6.0)*0.035;
 col=mix(col,c_bg,smoothstep(0.22,0.0,uv.y)*0.55);
 gl_FragColor=vec4(col,1.0);
}`

export function glGradient(canvas: HTMLCanvasElement): Cleanup | null {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}')
  const fs = sh(gl.FRAGMENT_SHADER, GL_FRAG)
  if (!vs || !fs) return null
  const pr = gl.createProgram()
  if (!pr) return null
  gl.attachShader(pr, vs)
  gl.attachShader(pr, fs)
  gl.linkProgram(pr)
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null
  gl.useProgram(pr)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const loc = gl.getAttribLocation(pr, 'a')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const U = (n: string) => gl.getUniformLocation(pr, n)
  const uRes = U('u_res')
  const uTime = U('u_time')
  const uMouse = U('u_mouse')
  const cs = getComputedStyle(canvas)
  const set = (n: string, v: string, f: string) => {
    const c = tokenColor(cs, v, f)
    gl.uniform3f(U(n), c[0] / 255, c[1] / 255, c[2] / 255)
  }
  set('c_brand', '--cyan-500', '#11d3d3')
  set('c_light', '--cyan-300', '#67ddef')
  set('c_tint', '--cyan-100', '#d8f8f8')
  set('c_blue', '--pastel-blue', '#dbe9ff')
  set('c_white', '--surface-000', '#ffffff')
  set('c_bg', '--surface-100', '#f4f6f7')
  set('c_deep', '--cyan-600', '#0db7ba')

  const scale = 0.5
  let raf = 0
  let visible = true
  let alive = true
  let last = 0
  const t0 = performance.now()
  let mx = 0.5
  let my = 0.5
  let tmx = 0.5
  let tmy = 0.5

  function size() {
    const r = canvas.getBoundingClientRect()
    canvas.width = Math.max(2, Math.round(r.width * scale))
    canvas.height = Math.max(2, Math.round(r.height * scale))
    gl!.viewport(0, 0, canvas.width, canvas.height)
    gl!.uniform2f(uRes, canvas.width, canvas.height)
  }
  function draw(now: number) {
    if (!alive) return
    const dt = Math.min(0.05, (now - (last || now)) / 1000)
    last = now
    mx = damp(mx, tmx, 0.8, dt)
    my = damp(my, tmy, 0.8, dt)
    gl!.uniform1f(uTime, RM ? 12 : (now - t0) / 1000 + 12)
    gl!.uniform2f(uMouse, mx, my)
    gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    if (visible && !RM) raf = requestAnimationFrame(draw)
    else {
      raf = 0
      last = 0
    }
  }
  size()
  draw(performance.now())

  const offObs = observe(
    canvas,
    () => {
      size()
      if (!raf) draw(performance.now())
    },
    (v) => {
      visible = v
      if (v && !raf && !RM) raf = requestAnimationFrame(draw)
    },
  )
  const offPtr = canvas.parentElement
    ? trackPointer(canvas.parentElement, (x, y) => {
        tmx = x
        tmy = y
      })
    : () => {}
  const onLost = (e: Event) => {
    e.preventDefault()
    visible = false
  }
  canvas.addEventListener('webglcontextlost', onLost)

  return () => {
    offObs()
    offPtr()
    // segue desenhando enquanto a página que sai ainda aparece (sem ficar branco)
    visible = true
    if (!raf && !RM) raf = requestAnimationFrame(draw)
    whenDetached(canvas, () => {
      alive = false
      if (raf) cancelAnimationFrame(raf)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    })
  }
}

/* ---------------------------------------------------------------
   Manchas desfocadas (fallback sem WebGL)
   --------------------------------------------------------------- */
const PATHS = [
  {
    bx: 0.22,
    by: 0.35,
    ax: 0.3,
    ay: 0.22,
    ax2: 0.1,
    ay2: 0.1,
    fx: 0.145,
    fy: 0.118,
    fx2: 0.071,
    fy2: 0.093,
    ph: 0,
  },
  {
    bx: 0.78,
    by: 0.3,
    ax: 0.28,
    ay: 0.26,
    ax2: 0.12,
    ay2: 0.08,
    fx: 0.121,
    fy: 0.137,
    fx2: 0.089,
    fy2: 0.064,
    ph: 1.7,
  },
  {
    bx: 0.55,
    by: 0.7,
    ax: 0.34,
    ay: 0.2,
    ax2: 0.09,
    ay2: 0.12,
    fx: 0.108,
    fy: 0.152,
    fx2: 0.077,
    fy2: 0.101,
    ph: 3.1,
  },
  {
    bx: 0.15,
    by: 0.75,
    ax: 0.26,
    ay: 0.24,
    ax2: 0.11,
    ay2: 0.09,
    fx: 0.133,
    fy: 0.112,
    fx2: 0.058,
    fy2: 0.083,
    ph: 4.4,
  },
  {
    bx: 0.88,
    by: 0.72,
    ax: 0.24,
    ay: 0.22,
    ax2: 0.1,
    ay2: 0.1,
    fx: 0.116,
    fy: 0.129,
    fx2: 0.095,
    fy2: 0.069,
    ph: 5.6,
  },
  {
    bx: 0.45,
    by: 0.25,
    ax: 0.32,
    ay: 0.18,
    ax2: 0.12,
    ay2: 0.08,
    fx: 0.139,
    fy: 0.104,
    fx2: 0.066,
    fy2: 0.088,
    ph: 2.4,
  },
  null, // a última segue o cursor
]

export function blobsField(el: HTMLElement): Cleanup {
  const items = Array.from(el.querySelectorAll<HTMLElement>('i'))
  let W = 0
  let H = 0
  let raf = 0
  let visible = true
  let alive = true
  let last = 0
  const t0 = performance.now()
  let mx = 0.6
  let my = 0.4
  let tmx = 0.6
  let tmy = 0.4

  const size = () => {
    const r = el.getBoundingClientRect()
    W = r.width
    H = r.height
  }
  function frame(now: number) {
    if (!alive) return
    const dt = Math.min(0.05, (now - (last || now)) / 1000)
    last = now
    const t = RM ? 0 : (now - t0) / 1000
    mx = damp(mx, tmx, 0.9, dt)
    my = damp(my, tmy, 0.9, dt)
    items.forEach((b, i) => {
      const p = PATHS[i % PATHS.length]
      const s = b.offsetWidth || 1
      let x: number
      let y: number
      if (!p) {
        x = mx
        y = my
      } else {
        x = p.bx + p.ax * Math.sin(t * p.fx + p.ph) + p.ax2 * Math.sin(t * p.fx2 + p.ph * 1.3)
        y = p.by + p.ay * Math.cos(t * p.fy + p.ph) + p.ay2 * Math.sin(t * p.fy2 + p.ph * 0.7)
      }
      const sc = 1 + 0.09 * Math.sin(t * 0.21 + i * 1.1)
      b.style.transform = `translate3d(${(x * W - s / 2).toFixed(1)}px,${(y * H - s / 2).toFixed(1)}px,0) scale(${sc.toFixed(3)})`
    })
    if (visible && !RM) raf = requestAnimationFrame(frame)
    else {
      raf = 0
      last = 0
    }
  }
  size()
  frame(performance.now())
  const offObs = observe(
    el,
    () => {
      size()
      if (!raf) frame(performance.now())
    },
    (v) => {
      visible = v
      if (v && !raf && !RM) raf = requestAnimationFrame(frame)
    },
  )
  const offPtr = el.parentElement
    ? trackPointer(el.parentElement, (x, y) => {
        tmx = x
        tmy = y
      })
    : () => {}
  return () => {
    offObs()
    offPtr()
    visible = true
    if (!raf && !RM) raf = requestAnimationFrame(frame)
    whenDetached(el, () => {
      alive = false
      if (raf) cancelAnimationFrame(raf)
    })
  }
}

/* ---------------------------------------------------------------
   Gradiente 2D suave (rodapé, CTA)
   --------------------------------------------------------------- */
export function softShader(canvas: HTMLCanvasElement, veil = 0.75): Cleanup {
  const g2 = canvas.getContext('2d')
  if (!g2) return () => {}
  const cs = getComputedStyle(canvas)
  const bg = tokenColor(cs, '--surface-100', '#f4f6f7')
  const pal: RGB[] = [
    tokenColor(cs, '--cyan-500', '#11d3d3'),
    tokenColor(cs, '--cyan-100', '#d8f8f8'),
    tokenColor(cs, '--cyan-300', '#67ddef'),
    tokenColor(cs, '--pastel-mint', '#d2f4e8'),
    tokenColor(cs, '--surface-000', '#ffffff'),
    tokenColor(cs, '--pastel-blue', '#dbe9ff'),
  ]
  const alpha = [0.55, 0.95, 0.45, 0.8, 0.9, 0.7]
  const BX = [0.18, 0.78, 0.62, 0.3, 0.5, 0.88]
  const BY = [0.3, 0.22, 0.78, 0.8, 0.5, 0.62]
  const R = [0.6, 0.55, 0.42, 0.48, 0.38, 0.4]
  const blobs = pal.map((c, i) => ({
    c: c.join(','),
    bx: BX[i]!,
    by: BY[i]!,
    r: R[i]!,
    ax: 0.14 + i * 0.02,
    ay: 0.11 + i * 0.015,
    fx: 0.00015 + i * 0.00003,
    fy: 0.00012 + i * 0.00004,
    ph: i * 1.7,
    a: alpha[i]!,
  }))
  const bgs = bg.join(',')
  const mouse = { x: 0.6, y: 0.4, tx: 0.6, ty: 0.4 }
  let w = 0
  let h = 0
  let raf = 0
  let visible = true
  let alive = true
  let last = 0
  const t0 = performance.now()
  const scale = 0.3

  function size() {
    const r = canvas.getBoundingClientRect()
    w = Math.max(2, Math.round(r.width * scale))
    h = Math.max(2, Math.round(r.height * scale))
    canvas.width = w
    canvas.height = h
  }
  // o movimento é lentíssimo: 30 quadros/s bastam e poupam bateria e GPU
  const frameMs = 1000 / 30
  let lastDraw = -Infinity
  function draw(now: number) {
    if (!alive || !g2) return
    if (visible && !RM && now - lastDraw < frameMs - 1) {
      raf = requestAnimationFrame(draw)
      return
    }
    lastDraw = now
    const dt = Math.min(0.05, (now - (last || now)) / 1000)
    last = now
    const t = now - t0
    mouse.x = damp(mouse.x, mouse.tx, 1.4, dt)
    mouse.y = damp(mouse.y, mouse.ty, 1.4, dt)
    g2.fillStyle = `rgb(${bgs})`
    g2.fillRect(0, 0, w, h)
    const m = Math.max(w, h)
    blobs.forEach((b, i) => {
      let x = (b.bx + Math.sin(t * b.fx + b.ph) * b.ax) * w
      let y = (b.by + Math.cos(t * b.fy + b.ph) * b.ay) * h
      if (i === 0) {
        x = lerp(x, mouse.x * w, 0.45)
        y = lerp(y, mouse.y * h, 0.45)
      }
      const r = b.r * m * (1 + Math.sin(t * 0.00025 + i) * 0.06)
      const g = g2.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(${b.c},${b.a})`)
      g.addColorStop(0.55, `rgba(${b.c},${b.a * 0.45})`)
      g.addColorStop(1, `rgba(${b.c},0)`)
      g2.fillStyle = g
      g2.fillRect(0, 0, w, h)
    })
    if (veil > 0) {
      const fade = g2.createLinearGradient(0, h * 0.45, 0, h)
      fade.addColorStop(0, `rgba(${bgs},0)`)
      fade.addColorStop(1, `rgba(${bgs},${veil})`)
      g2.fillStyle = fade
      g2.fillRect(0, 0, w, h)
    }
    if (visible && !RM) raf = requestAnimationFrame(draw)
    else {
      raf = 0
      last = 0
    }
  }
  size()
  draw(performance.now())
  const offObs = observe(
    canvas,
    () => {
      size()
      if (!raf) draw(performance.now())
    },
    (v) => {
      visible = v
      if (v && !raf && !RM) raf = requestAnimationFrame(draw)
    },
  )
  const offPtr = canvas.parentElement
    ? trackPointer(canvas.parentElement, (x, y) => {
        mouse.tx = x
        mouse.ty = y
      })
    : () => {}
  return () => {
    offObs()
    offPtr()
    visible = true
    if (!raf && !RM) raf = requestAnimationFrame(draw)
    whenDetached(canvas, () => {
      alive = false
      if (raf) cancelAnimationFrame(raf)
    })
  }
}

/* ---------------------------------------------------------------
   Raios de luz (hero das páginas internas)
   Um brilho vem de cima e se abre em feixes que ondulam devagar,
   como luz atravessando água: o ângulo de cada feixe é ruído que
   anda no tempo, e uma leve ondulação com a distância faz o
   "reflexo". A origem acompanha o cursor bem de leve.
   Cores: --rays-bg (fundo), --rays-top (céu do topo),
   --rays-deep (sombra entre os feixes) e --rays-core (a luz).
   --------------------------------------------------------------- */
const RAYS_FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_ox;
uniform vec3 c_bg, c_top, c_deep, c_core;
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float vn(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(h2(i),h2(i+vec2(1.0,0.0)),f.x),mix(h2(i+vec2(0.0,1.0)),h2(i+vec2(1.0,1.0)),f.x),f.y);}
/* feixes largos: ruído no ângulo que também muda no tempo (acendem, apagam e deslizam) */
float beams(float a,float t){
 float n=vn(vec2(a*4.2+t*0.16,t*0.55))*0.55;
 n+=vn(vec2(a*8.0-t*0.22,t*0.75+3.0))*0.30;
 n+=vn(vec2(a*15.0+t*0.30,t*1.05+7.0))*0.15;
 return n;
}
void main(){
 vec2 uv=gl_FragCoord.xy/u_res; float asp=u_res.x/u_res.y;
 vec2 p=vec2((uv.x-0.5)*asp,1.0-uv.y);
 vec2 o=vec2((u_ox-0.5)*asp+(u_mouse.x-0.5)*0.10,-0.34);
 vec2 d=p-o; float dist=length(d);
 float a=atan(d.x,d.y);
 float t=u_time;
 /* ondulação de reflexo: os feixes se curvam de leve, variando com a distância */
 a+=sin(dist*5.0-t*1.3)*0.022+sin(dist*1.8+t*0.6)*0.03;
 float b=smoothstep(0.26,0.90,beams(a,t));
 float cone=smoothstep(1.1,0.05,abs(a));
 float fall=exp(-dist*1.0);
 float shim=0.78+0.22*sin(t*1.9+a*8.0+dist*3.5);
 float lit=b*cone*fall*shim;
 float glow=exp(-dist*1.9)*(0.88+0.12*sin(t*1.4));
 float top=pow(smoothstep(1.05,0.0,p.y),1.3);
 vec3 col=mix(c_bg,c_top,top);
 col=mix(col,c_deep,(1.0-b)*cone*fall*0.40);
 col=mix(col,c_deep,smoothstep(0.35,1.3,abs(a))*top*0.38);
 col=mix(col,c_core,clamp(lit*1.05+glow*0.85,0.0,1.0));
 col=mix(col,c_bg,smoothstep(0.66,1.0,p.y));
 gl_FragColor=vec4(col,1.0);
}`

/** Raios de luz vindos de cima. `ox` = posição horizontal da origem (0–1). */
export function glRays(canvas: HTMLCanvasElement, ox = 0.5): Cleanup | null {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}')
  const fs = sh(gl.FRAGMENT_SHADER, RAYS_FRAG)
  if (!vs || !fs) return null
  const pr = gl.createProgram()
  if (!pr) return null
  gl.attachShader(pr, vs)
  gl.attachShader(pr, fs)
  gl.linkProgram(pr)
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null
  gl.useProgram(pr)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const loc = gl.getAttribLocation(pr, 'a')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const U = (n: string) => gl.getUniformLocation(pr, n)
  const uRes = U('u_res')
  const uTime = U('u_time')
  const uMouse = U('u_mouse')
  gl.uniform1f(U('u_ox'), ox)
  const cs = getComputedStyle(canvas)
  const set = (n: string, v: string, f: string) => {
    const c = tokenColor(cs, v, f)
    gl.uniform3f(U(n), c[0] / 255, c[1] / 255, c[2] / 255)
  }
  set('c_bg', '--rays-bg', '#f4f6f7')
  set('c_top', '--rays-top', '#9ce8ef')
  set('c_deep', '--rays-deep', '#35cdd6')
  set('c_core', '--rays-core', '#ffffff')

  const scale = 0.5
  let raf = 0
  let visible = true
  let alive = true
  let last = 0
  const t0 = performance.now()
  let mx = 0.5
  let tmx = 0.5

  function size() {
    const r = canvas.getBoundingClientRect()
    canvas.width = Math.max(2, Math.round(r.width * scale))
    canvas.height = Math.max(2, Math.round(r.height * scale))
    gl!.viewport(0, 0, canvas.width, canvas.height)
    gl!.uniform2f(uRes, canvas.width, canvas.height)
  }
  function draw(now: number) {
    if (!alive) return
    const dt = Math.min(0.05, (now - (last || now)) / 1000)
    last = now
    mx = damp(mx, tmx, 0.9, dt)
    gl!.uniform1f(uTime, RM ? 20 : (now - t0) / 1000 + 20)
    gl!.uniform2f(uMouse, mx, 0.5)
    gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    if (visible && !RM) raf = requestAnimationFrame(draw)
    else {
      raf = 0
      last = 0
    }
  }
  size()
  draw(performance.now())

  const offObs = observe(
    canvas,
    () => {
      size()
      if (!raf) draw(performance.now())
    },
    (v) => {
      visible = v
      if (v && !raf && !RM) raf = requestAnimationFrame(draw)
    },
  )
  const offPtr = canvas.parentElement
    ? trackPointer(canvas.parentElement, (x) => {
        tmx = x
      })
    : () => {}
  const onLost = (e: Event) => {
    e.preventDefault()
    visible = false
  }
  canvas.addEventListener('webglcontextlost', onLost)

  return () => {
    offObs()
    offPtr()
    visible = true
    if (!raf && !RM) raf = requestAnimationFrame(draw)
    whenDetached(canvas, () => {
      alive = false
      if (raf) cancelAnimationFrame(raf)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    })
  }
}
