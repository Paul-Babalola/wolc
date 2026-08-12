<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './Ferrofluid.css'

const MAX_COLORS = 8

type FlowDirection = 'up' | 'down' | 'left' | 'right'

interface Props {
  className?: string
  dpr?: number
  paused?: boolean
  colors?: string[]
  speed?: number
  scale?: number
  turbulence?: number
  fluidity?: number
  rimWidth?: number
  sharpness?: number
  shimmer?: number
  glow?: number
  flowDirection?: FlowDirection
  opacity?: number
  mouseInteraction?: boolean
  mouseStrength?: number
  mouseRadius?: number
  mouseDampening?: number
  mixBlendMode?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  paused: false,
  colors: () => ['#2563EB', '#38bdf8', '#E0F2FE'],
  speed: 0.5,
  scale: 1,
  turbulence: 1,
  fluidity: 0.1,
  rimWidth: 0.2,
  sharpness: 3,
  shimmer: 1,
  glow: 2,
  flowDirection: 'down',
  opacity: 1,
  mouseInteraction: true,
  mouseStrength: 1,
  mouseRadius: 0.3,
  mouseDampening: 0.15,
})

const containerRef = ref<HTMLElement | null>(null)

const containerStyle = computed(() =>
  props.mixBlendMode ? { mixBlendMode: props.mixBlendMode } : undefined,
)

function hexToRGB(hex: string): [number, number, number] {
  const c = hex.replace('#', '').padEnd(6, '0')
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ]
}

function prepColors(input: string[]) {
  const base = (input?.length ? input : ['#2563EB', '#38bdf8', '#E0F2FE']).slice(0, MAX_COLORS)
  const count = base.length
  const arr: [number, number, number][] = []
  for (let i = 0; i < MAX_COLORS; i++) {
    arr.push(hexToRGB(base[Math.min(i, base.length - 1)]))
  }
  const avg: [number, number, number] = [0, 0, 0]
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0]
    avg[1] += arr[i][1]
    avg[2] += arr[i][2]
  }
  avg[0] /= count
  avg[1] /= count
  avg[2] /= count
  return { arr, count, avg }
}

function flowVec(direction: FlowDirection): [number, number] {
  switch (direction) {
    case 'up':
      return [0, 1]
    case 'down':
      return [0, -1]
    case 'left':
      return [-1, 0]
    case 'right':
      return [1, 0]
    default:
      return [0, -1]
  }
}

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uMouseColor;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

#define PI 3.14159265

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = iTime;

  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);

  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }

  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 col = palette(h);

  vec3 outc = col * ltn;
  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
  fragColor = vec4(outc, a * uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`

type Uniforms = Record<string, { value: number | number[] | Int32Array }>

let renderer: Renderer | null = null
let program: Program | null = null
let mesh: Mesh | null = null
let uniforms: Uniforms | null = null
let resizeObserver: ResizeObserver | null = null
let raf = 0
let lastTime = 0
let mouseTarget: [number, number] = [0, 0]
let cleanupPointer: (() => void) | null = null

function applyUniforms() {
  if (!uniforms) return

  const { arr, count, avg } = prepColors(props.colors)
  const colorKeys = ['uColor0', 'uColor1', 'uColor2', 'uColor3', 'uColor4', 'uColor5', 'uColor6', 'uColor7']
  for (let i = 0; i < MAX_COLORS; i++) {
    uniforms[colorKeys[i]].value = arr[i]
  }
  uniforms.uColorCount.value = count
  uniforms.uMouseColor.value = avg
  uniforms.uFlow.value = flowVec(props.flowDirection)
  uniforms.uSpeed.value = props.speed
  uniforms.uScale.value = props.scale
  uniforms.uTurbulence.value = props.turbulence
  uniforms.uFluidity.value = props.fluidity
  uniforms.uRimWidth.value = props.rimWidth
  uniforms.uSharpness.value = props.sharpness
  uniforms.uShimmer.value = props.shimmer
  uniforms.uGlow.value = props.glow
  uniforms.uOpacity.value = props.opacity
  uniforms.uMouseEnabled.value = props.mouseInteraction ? 1 : 0
  uniforms.uMouseStrength.value = props.mouseStrength
  uniforms.uMouseRadius.value = props.mouseRadius
}

function resize(container: HTMLElement) {
  if (!renderer || !uniforms) return
  const rect = container.getBoundingClientRect()
  renderer.setSize(rect.width, rect.height)
  uniforms.iResolution.value = [
    renderer.gl.drawingBufferWidth,
    renderer.gl.drawingBufferHeight,
    1,
  ]
}

function loop(t: number) {
  raf = requestAnimationFrame(loop)
  if (!uniforms || !renderer || !mesh) return

  uniforms.iTime.value = t * 0.001

  if (props.mouseDampening > 0) {
    if (!lastTime) lastTime = t
    const dt = (t - lastTime) / 1000
    lastTime = t
    const tau = Math.max(1e-4, props.mouseDampening)
    let factor = 1 - Math.exp(-dt / tau)
    if (factor > 1) factor = 1
    const cur = uniforms.iMouse.value as number[]
    cur[0] += (mouseTarget[0] - cur[0]) * factor
    cur[1] += (mouseTarget[1] - cur[1]) * factor
  } else {
    lastTime = t
  }

  if (!props.paused) {
    try {
      renderer.render({ scene: mesh })
    } catch (error) {
      console.error(error)
    }
  }
}

function initWebGL(container: HTMLElement) {
  destroyWebGL(container)

  renderer = new Renderer({
    dpr: props.dpr ?? Math.min(window.devicePixelRatio || 1, 2),
    alpha: true,
    antialias: true,
  })

  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)
  const canvas = gl.canvas as HTMLCanvasElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  container.appendChild(canvas)

  const { arr, count, avg } = prepColors(props.colors)

  uniforms = {
    iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
    iMouse: { value: [0, 0] },
    iTime: { value: 0 },
    uColor0: { value: arr[0] },
    uColor1: { value: arr[1] },
    uColor2: { value: arr[2] },
    uColor3: { value: arr[3] },
    uColor4: { value: arr[4] },
    uColor5: { value: arr[5] },
    uColor6: { value: arr[6] },
    uColor7: { value: arr[7] },
    uColorCount: { value: count },
    uMouseColor: { value: avg },
    uFlow: { value: flowVec(props.flowDirection) },
    uSpeed: { value: props.speed },
    uScale: { value: props.scale },
    uTurbulence: { value: props.turbulence },
    uFluidity: { value: props.fluidity },
    uRimWidth: { value: props.rimWidth },
    uSharpness: { value: props.sharpness },
    uShimmer: { value: props.shimmer },
    uGlow: { value: props.glow },
    uOpacity: { value: props.opacity },
    uMouseEnabled: { value: props.mouseInteraction ? 1 : 0 },
    uMouseStrength: { value: props.mouseStrength },
    uMouseRadius: { value: props.mouseRadius },
  }

  program = new Program(gl, { vertex, fragment, uniforms })
  const geometry = new Triangle(gl)
  mesh = new Mesh(gl, { geometry, program })

  resize(container)

  const updateMouse = (clientX: number, clientY: number) => {
    if (!renderer || !uniforms) return
    const rect = container.getBoundingClientRect()
    const sc = renderer.dpr || 1
    const x = (clientX - rect.left) * sc
    const y = (rect.height - (clientY - rect.top)) * sc
    mouseTarget = [x, y]
    if (props.mouseDampening <= 0) {
      uniforms.iMouse.value = [x, y]
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!props.mouseInteraction) return
    updateMouse(e.clientX, e.clientY)
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  cleanupPointer = () => {
    window.removeEventListener('pointermove', onPointerMove)
  }

  resizeObserver = new ResizeObserver(() => resize(container))
  resizeObserver.observe(container)

  lastTime = 0
  raf = requestAnimationFrame(loop)
}

function destroyWebGL(container: HTMLElement | null) {
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
  cleanupPointer?.()
  cleanupPointer = null
  resizeObserver?.disconnect()
  resizeObserver = null

  if (renderer && container) {
    try {
      if (renderer.gl.canvas.parentElement === container) {
        container.removeChild(renderer.gl.canvas)
      }
    } catch {
      // canvas may already be removed
    }
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  program = null
  mesh = null
  uniforms = null
  renderer = null
  lastTime = 0
}

onMounted(() => {
  if (containerRef.value) {
    initWebGL(containerRef.value)
  }
})

watch(
  () => [
    props.dpr,
    props.colors,
    props.speed,
    props.scale,
    props.turbulence,
    props.fluidity,
    props.rimWidth,
    props.sharpness,
    props.shimmer,
    props.glow,
    props.flowDirection,
    props.opacity,
    props.mouseInteraction,
    props.mouseStrength,
    props.mouseRadius,
    props.mouseDampening,
  ],
  () => {
    if (containerRef.value) {
      initWebGL(containerRef.value)
    } else {
      applyUniforms()
    }
  },
  { deep: true },
)

onBeforeUnmount(() => {
  destroyWebGL(containerRef.value)
})
</script>

<template>
  <div
    ref="containerRef"
    :class="['ferrofluid-container', className]"
    :style="containerStyle"
  />
</template>
