<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './LightTunnel.css'

type FlowDirection = 'inward' | 'outward'

interface Props {
  className?: string
  cableColor?: string
  pulseColor?: string
  tunnelColor?: string
  tunnelOpacity?: number
  speed?: number
  flowDirection?: FlowDirection
  pulseSpeed?: number
  pulseLength?: number
  pulseBlend?: number
  pulseWidth?: number
  cableCount?: number
  thickness?: number
  rimWidth?: number
  waviness?: number
  sway?: number
  size?: number
  centerX?: number
  centerY?: number
  glow?: number
  fadeNear?: number
  fadeFar?: number
  brightness?: number
  colorVariance?: boolean
  grain?: boolean
  grainIntensity?: number
  opacity?: number
  mouseInteraction?: boolean
  mouseStrength?: number
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  cableColor: '#2563EB',
  pulseColor: '#38bdf8',
  tunnelColor: '#1d4ed8',
  tunnelOpacity: 0,
  speed: 0.1,
  flowDirection: 'outward',
  pulseSpeed: 2,
  pulseLength: 0.28,
  pulseBlend: 1,
  pulseWidth: 1,
  cableCount: 20,
  thickness: 0.35,
  rimWidth: 0.15,
  waviness: 0.3,
  sway: 0.5,
  size: 1,
  centerX: 0,
  centerY: 0,
  glow: 1,
  fadeNear: 0.5,
  fadeFar: 2,
  brightness: 1,
  colorVariance: true,
  grain: true,
  grainIntensity: 0.05,
  opacity: 1,
  mouseInteraction: true,
  mouseStrength: 0.1,
})

const containerRef = ref<HTMLElement | null>(null)

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uFlowDir;
uniform float uPulseSpeed;
uniform float uPulseLength;
uniform float uPulseBlend;
uniform float uPulseWidth;
uniform float uCableCount;
uniform float uThickness;
uniform float uRimWidth;
uniform float uWaviness;
uniform float uSway;
uniform float uSize;
uniform vec2 uCenter;
uniform vec2 uMouseOffset;
uniform float uGlow;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uBrightness;
uniform float uColorVariance;
uniform float uOpacity;
uniform vec3 uCableColor;
uniform vec3 uPulseColor;
uniform vec3 uTunnelColor;
uniform float uTunnelOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
out vec4 fragColor;

void mainImage(out vec4 o, in vec2 fragCoord) {
  float size = uSize * 2.0;
  float flowDir = uFlowDir;
  float speedBase = uSpeed * 4.0 * flowDir;
  float waviness = uWaviness * 0.15;
  float rotationOsc = uSway * 0.5;
  float baseThick = uThickness * 0.35 + 0.05;
  float borderWeight = uRimWidth * 0.15 + 0.01;
  float cablesCount = floor(uCableCount);

  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord - 0.5 * res) / min(res.y, res.x);
  uv -= (uCenter + uMouseOffset);
  uv /= (size + 0.0001);

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float depth = -log(r + 0.0001);

  float swing = sin(iTime * (uSpeed * 0.5 + 0.1)) * rotationOsc;
  float waveOffset = sin(depth * 1.2 + iTime * speedBase * 0.25) * waviness;

  float angleNormalized = (angle / 6.2831853) + 0.5;
  float finalAngle = fract(angleNormalized + waveOffset + swing);

  float cableID = floor(finalAngle * cablesCount);
  float gvX = (fract(finalAngle * cablesCount) - 0.5);

  float rand = fract(sin(cableID * 12.9898) * 43758.5453);
  float randSpeed = (0.4 + rand * 0.6) * speedBase * uPulseSpeed;
  float cableThick = baseThick * (0.6 + rand * 0.4);

  vec3 cableCol = uCableColor;
  cableCol *= 1.0 + (rand - 0.5) * 0.4 * uColorVariance;
  cableCol = mix(cableCol, uPulseColor, rand * 0.25 * uColorVariance);

  float scroll = depth + (iTime * randSpeed);
  float pulseFact = fract(scroll);

  float distToCore = abs(gvX);
  float wireMask = smoothstep(cableThick, cableThick - 0.05, distToCore);
  float rimGlow = smoothstep(borderWeight, 0.0, abs(distToCore - cableThick));

  float pulseThick = cableThick * uPulseWidth;
  float pulseMask = smoothstep(pulseThick, pulseThick - 0.05 * uPulseWidth, distToCore);

  float pulseDist = abs(pulseFact - 0.5);
  float pulseTotal = uPulseLength;
  float pulseCore = pulseTotal * (1.0 - uPulseBlend);
  float pulseLo = min(pulseCore, pulseTotal - max(fwidth(scroll), 1e-4));
  float dataPulse = 1.0 - smoothstep(pulseLo, pulseTotal, pulseDist);

  float aBody = wireMask * uTunnelOpacity;
  float aRim = rimGlow;
  float aPulse = clamp(dataPulse * pulseMask, 0.0, 1.0);

  vec3 fiberCol = uTunnelColor * aBody
    + cableCol * aRim * 1.3 * uGlow
    + uPulseColor * dataPulse * 3.0 * pulseMask;

  float distFade = smoothstep(0.0, uFadeNear, r) * smoothstep(uFadeFar, uFadeFar - 0.9, r);
  float inten = clamp(aBody + aRim + aPulse, 0.0, 1.0) * distFade;

  vec3 finalCol = fiberCol * uBrightness;
  float alpha = clamp(inten, 0.0, 1.0) * uOpacity;
  vec3 outRgb = finalCol * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }

  o = vec4(outRgb, alpha);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  fragColor = o;
}
`

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ]
}

type ProgramUniforms = Record<string, { value: number | Float32Array }>

let renderer: Renderer | null = null
let program: Program | null = null
let mesh: Mesh | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let raf = 0
let isVisible = true
let isPageVisible = true
let currentMouse: [number, number] = [0.5, 0.5]
let targetMouse: [number, number] = [0.5, 0.5]
const t0 = performance.now()

function applyUniforms(u: ProgramUniforms) {
  u.uSpeed.value = props.speed
  u.uFlowDir.value = props.flowDirection === 'outward' ? -1 : 1
  u.uPulseSpeed.value = props.pulseSpeed
  u.uPulseLength.value = props.pulseLength
  u.uPulseBlend.value = props.pulseBlend
  u.uPulseWidth.value = props.pulseWidth
  u.uCableCount.value = props.cableCount
  u.uThickness.value = props.thickness
  u.uRimWidth.value = props.rimWidth
  u.uWaviness.value = props.waviness
  u.uSway.value = props.sway
  u.uSize.value = props.size
  const center = u.uCenter.value as Float32Array
  center[0] = props.centerX
  center[1] = props.centerY
  u.uGlow.value = props.glow
  u.uFadeNear.value = props.fadeNear
  u.uFadeFar.value = props.fadeFar
  u.uBrightness.value = props.brightness
  u.uColorVariance.value = props.colorVariance ? 1 : 0
  u.uGrain.value = props.grain ? 1 : 0
  u.uGrainIntensity.value = props.grainIntensity
  u.uOpacity.value = props.opacity
  u.uTunnelOpacity.value = props.tunnelOpacity

  const cable = hexToRgb(props.cableColor)
  const cableU = u.uCableColor.value as Float32Array
  cableU[0] = cable[0]
  cableU[1] = cable[1]
  cableU[2] = cable[2]

  const pulse = hexToRgb(props.pulseColor)
  const pulseU = u.uPulseColor.value as Float32Array
  pulseU[0] = pulse[0]
  pulseU[1] = pulse[1]
  pulseU[2] = pulse[2]

  const tunnel = hexToRgb(props.tunnelColor)
  const tunnelU = u.uTunnelColor.value as Float32Array
  tunnelU[0] = tunnel[0]
  tunnelU[1] = tunnel[1]
  tunnelU[2] = tunnel[2]
}

function setSize(container: HTMLElement) {
  if (!renderer || !program) return

  const rect = container.getBoundingClientRect()
  const w = Math.max(1, Math.floor(rect.width))
  const h = Math.max(1, Math.floor(rect.height))
  renderer.setSize(w, h)
  const res = program.uniforms.iResolution.value as Float32Array
  res[0] = renderer.gl.drawingBufferWidth
  res[1] = renderer.gl.drawingBufferHeight
  renderer.render({ scene: mesh! })
}

function tryStart() {
  if (isVisible && isPageVisible && raf === 0) {
    raf = requestAnimationFrame(loop)
  }
}

function tryStop() {
  if (raf !== 0) {
    cancelAnimationFrame(raf)
    raf = 0
  }
}

function loop(t: number) {
  if (!program || !renderer || !mesh) return

  program.uniforms.iTime.value = (t - t0) * 0.001

  if (props.mouseInteraction) {
    currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0])
    currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1])
  } else {
    currentMouse[0] += 0.05 * (0.5 - currentMouse[0])
    currentMouse[1] += 0.05 * (0.5 - currentMouse[1])
  }

  const off = program.uniforms.uMouseOffset.value as Float32Array
  off[0] = (currentMouse[0] - 0.5) * props.mouseStrength
  off[1] = (currentMouse[1] - 0.5) * props.mouseStrength

  renderer.render({ scene: mesh })
  raf = requestAnimationFrame(loop)
}

let cleanupMouse: (() => void) | null = null
let onVisibility: (() => void) | null = null

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  renderer = new Renderer({
    webgl: 2,
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  })

  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)
  const canvas = gl.canvas as HTMLCanvasElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  container.appendChild(canvas)

  const geometry = new Triangle(gl)
  program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uSpeed: { value: 0.1 },
      uFlowDir: { value: -1 },
      uPulseSpeed: { value: 2 },
      uPulseLength: { value: 0.28 },
      uPulseBlend: { value: 1 },
      uPulseWidth: { value: 1 },
      uCableCount: { value: 20 },
      uThickness: { value: 0.35 },
      uRimWidth: { value: 0.15 },
      uWaviness: { value: 0.3 },
      uSway: { value: 0.5 },
      uSize: { value: 1 },
      uCenter: { value: new Float32Array([0, 0]) },
      uMouseOffset: { value: new Float32Array([0, 0]) },
      uGlow: { value: 1 },
      uFadeNear: { value: 0.5 },
      uFadeFar: { value: 2 },
      uBrightness: { value: 1 },
      uColorVariance: { value: 1 },
      uOpacity: { value: 1 },
      uCableColor: { value: new Float32Array([0.145, 0.388, 0.922]) },
      uPulseColor: { value: new Float32Array([0.22, 0.741, 0.973]) },
      uTunnelColor: { value: new Float32Array([0.114, 0.306, 0.847]) },
      uTunnelOpacity: { value: 0 },
      uGrain: { value: 1 },
      uGrainIntensity: { value: 0.05 },
    },
  })

  mesh = new Mesh(gl, { geometry, program })
  applyUniforms(program.uniforms as ProgramUniforms)

  const handleMouseMove = (e: MouseEvent) => {
    if (!props.mouseInteraction) return
    const rect = container.getBoundingClientRect()
    if (
      e.clientX < rect.left
      || e.clientX > rect.right
      || e.clientY < rect.top
      || e.clientY > rect.bottom
    ) {
      return
    }
    targetMouse = [
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height,
    ]
  }

  const handleMouseLeave = () => {
    targetMouse = [0.5, 0.5]
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('mouseleave', handleMouseLeave)
  cleanupMouse = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseleave', handleMouseLeave)
  }

  resizeObserver = new ResizeObserver(() => setSize(container))
  resizeObserver.observe(container)
  setSize(container)

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) tryStart()
      else tryStop()
    },
    { threshold: 0 },
  )
  intersectionObserver.observe(container)

  onVisibility = () => {
    isPageVisible = !document.hidden
    if (isPageVisible) tryStart()
    else tryStop()
  }
  document.addEventListener('visibilitychange', onVisibility)

  tryStart()
})

watch(
  () => [
    props.cableColor,
    props.pulseColor,
    props.tunnelColor,
    props.tunnelOpacity,
    props.speed,
    props.flowDirection,
    props.pulseSpeed,
    props.pulseLength,
    props.pulseBlend,
    props.pulseWidth,
    props.cableCount,
    props.thickness,
    props.rimWidth,
    props.waviness,
    props.sway,
    props.size,
    props.centerX,
    props.centerY,
    props.glow,
    props.fadeNear,
    props.fadeFar,
    props.brightness,
    props.colorVariance,
    props.grain,
    props.grainIntensity,
    props.opacity,
  ],
  () => {
    if (!program) return
    applyUniforms(program.uniforms as ProgramUniforms)
  },
)

onBeforeUnmount(() => {
  tryStop()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  if (onVisibility) {
    document.removeEventListener('visibilitychange', onVisibility)
  }
  cleanupMouse?.()

  const container = containerRef.value
  if (renderer && container) {
    try {
      container.removeChild(renderer.gl.canvas)
    } catch {
      // canvas may already be removed
    }
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  renderer = null
  program = null
  mesh = null
})
</script>

<template>
  <div
    ref="containerRef"
    :class="['light-tunnel-container', className]"
  />
</template>
