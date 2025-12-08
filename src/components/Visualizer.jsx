import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { PerspectiveCamera, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ============== GEOMETRY CONFIGURATIONS ==============
const GEOMETRY_CONFIGS = {
    session1: {
        type: 'icosahedron',
        detail: 32,
        size: 0.9,
        hueBase: 0.75, // Purple/Violet
        hueRange: 0.2,
        saturation: 0.7,
    },
    session2: {
        type: 'torusKnot',
        detail: 128,
        size: 0.6,
        hueBase: 0.55, // Cyan/Teal
        hueRange: 0.15,
        saturation: 0.65,
    }
};

// ============== SHADER MATERIAL ==============
const BlobShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uBassAmplitude: 0,
        uMidAmplitude: 0,
        uHighAmplitude: 0,
        uIsPlaying: 0,
        uHueBase: 0.75,
        uHueRange: 0.2,
        uSaturation: 0.7,
        uMorphProgress: 0,
        uTouchPoint: new THREE.Vector3(0, 0, 0),
        uTouchStrength: 0,
        uScale: 1.0,
    },
  // Vertex Shader
  /*glsl*/ `
    uniform float uTime;
    uniform float uBassAmplitude;
    uniform float uMidAmplitude;
    uniform float uHighAmplitude;
    uniform float uIsPlaying;
    uniform float uMorphProgress;
    uniform vec3 uTouchPoint;
    uniform float uTouchStrength;
    uniform float uScale;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;
    varying float vNoise;
    varying vec3 vWorldPosition;
    
    // Simplex Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    void main() {
      vNormal = normal;
      vPosition = position;
      
      float slowTime = uTime * 0.15;
      float fastTime = uTime * 0.4;
      
      float breathe = sin(uTime * 0.5) * 0.03;
      
      vec3 noisePos = position * 1.2;
      
      float noise1 = fbm(noisePos + vec3(slowTime, 0.0, slowTime * 0.5), 4);
      float noise2 = fbm(noisePos * 2.0 + vec3(0.0, fastTime, 0.0), 3) * 0.5;
      float noise3 = snoise(noisePos * 4.0 + vec3(fastTime * 0.3)) * 0.15;
      
      float combinedNoise = noise1 + noise2 + noise3;
      
      float audioInfluence = 0.0;
      if (uIsPlaying > 0.5) {
        float bassNoise = snoise(noisePos * 0.8 + vec3(uTime * 0.5)) * uBassAmplitude * 1.5;
        float midNoise = snoise(noisePos * 2.0 + vec3(uTime * 0.8)) * uMidAmplitude * 0.8;
        float highNoise = snoise(noisePos * 4.0 + vec3(uTime * 1.5)) * uHighAmplitude * 0.4;
        audioInfluence = bassNoise + midNoise + highNoise;
      }
      
      // Touch interaction - glitch distortion effect
      float touchDist = distance(position, uTouchPoint);
      float touchRipple = sin(touchDist * 8.0 - uTime * 5.0) * exp(-touchDist * 2.0) * uTouchStrength;
      
      // Glitch effect - random offsets when touched
      float glitchIntensity = uTouchStrength * 0.3;
      vec3 glitchOffset = vec3(
        sin(position.y * 50.0 + uTime * 20.0) * glitchIntensity,
        cos(position.x * 40.0 + uTime * 15.0) * glitchIntensity * 0.5,
        sin(position.z * 30.0 + uTime * 25.0) * glitchIntensity * 0.7
      );
      
      float displacement = combinedNoise * 0.4 + breathe + audioInfluence + touchRipple;
      
      vDisplacement = displacement;
      vNoise = combinedNoise;
      
      vec3 newPosition = position + normal * displacement + glitchOffset;
      newPosition *= uScale;
      
      vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  /*glsl*/ `
    uniform float uTime;
    uniform float uBassAmplitude;
    uniform float uMidAmplitude;
    uniform float uHighAmplitude;
    uniform float uIsPlaying;
    uniform float uHueBase;
    uniform float uHueRange;
    uniform float uSaturation;
    uniform float uTouchStrength;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;
    varying float vNoise;
    varying vec3 vWorldPosition;
    
    vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    }
    
    void main() {
      vec3 light = normalize(vec3(0.5, 1.0, 0.8));
      vec3 light2 = normalize(vec3(-0.8, -0.2, 0.5));
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      float dX = dFdx(vDisplacement);
      float dY = dFdy(vDisplacement);
      vec3 perturbedNormal = normalize(vNormal + vec3(dX, dY, 0.0) * 2.0);
      
      float diffuse1 = max(dot(perturbedNormal, light), 0.0);
      float diffuse2 = max(dot(perturbedNormal, light2), 0.0) * 0.5;
      float diffuse = diffuse1 + diffuse2;
      diffuse = diffuse * 0.5 + 0.5;
      
      float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
      fresnel = pow(fresnel, 3.0);
      
      vec3 halfDir = normalize(light + viewDir);
      float specular = pow(max(dot(perturbedNormal, halfDir), 0.0), 64.0) * 0.8;
      
      // Dynamic colors based on uniforms - DARKER for better contrast
      float hueShift = vPosition.y * 0.15 + vPosition.x * 0.1;
      float hueTime = sin(uTime * 0.1) * 0.05;
      float hueNoise = vNoise * uHueRange;
      
      float hue = mod(uHueBase + hueShift + hueTime + hueNoise, 1.0);
      
      float saturation = uSaturation + vDisplacement * 0.3;
      saturation = clamp(saturation, 0.3, 0.8);
      
      // Reduced lightness for darker colors
      float lightness = 0.18 + diffuse * 0.22;
      
      vec3 baseColor = hsl2rgb(vec3(hue, saturation, lightness));
      
      float hue2 = mod(hue + 0.15, 1.0);
      vec3 secondaryColor = hsl2rgb(vec3(hue2, saturation * 0.9, lightness * 1.1));
      
      float hue3 = mod(hue - 0.1, 1.0);
      vec3 accentColor = hsl2rgb(vec3(hue3, 0.7, 0.35));
      
      float blendFactor = smoothstep(-0.5, 0.5, vPosition.y + vNoise * 0.5);
      vec3 color = mix(baseColor, secondaryColor, blendFactor);
      
      float peakHighlight = smoothstep(0.2, 0.5, vDisplacement);
      color = mix(color, accentColor, peakHighlight * 0.4);
      
      vec3 fresnelColor = hsl2rgb(vec3(mod(uHueBase + 0.2, 1.0), 0.6, 0.4));
      color = mix(color, fresnelColor, fresnel * 0.5);
      
      color += specular * vec3(0.6, 0.55, 0.5) * 0.5;
      
      // Glitch color effect on touch - chromatic aberration style
      if (uTouchStrength > 0.01) {
        float glitchColor = sin(vPosition.y * 100.0 + uTime * 30.0) * uTouchStrength;
        color.r += glitchColor * 0.15;
        color.g -= glitchColor * 0.1;
        color.b += glitchColor * 0.2;
        
        // Random brightness flicker
        float flicker = sin(uTime * 50.0) * uTouchStrength * 0.3;
        color *= 1.0 + flicker;
      }
      
      if (uIsPlaying > 0.5) {
        float bassPulse = uBassAmplitude * 0.3;
        color *= 1.0 + bassPulse;
        
        float midShift = uMidAmplitude * 0.08;
        color = mix(color, accentColor, midShift);
        
        float sparkle = uHighAmplitude * fresnel * 0.3;
        color += vec3(sparkle);
      }
      
      float innerShadow = smoothstep(-0.3, 0.1, vDisplacement);
      color *= 0.6 + innerShadow * 0.4;
      
      color = pow(color, vec3(1.1));
      color = clamp(color, 0.0, 1.0);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ BlobShaderMaterial });

// ============== TOUCH CONTROLS COMPONENT ==============
const TouchControls = ({ meshRef, onPinch, onTouchPoint }) => {
    const { gl, camera } = useThree();
    const isDragging = useRef(false);
    const previousTouch = useRef({ x: 0, y: 0 });
    const pinchDistance = useRef(0);
    const raycaster = useRef(new THREE.Raycaster());
    const pointer = useRef(new THREE.Vector2());

    useEffect(() => {
        const canvas = gl.domElement;

        const getPointerPosition = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: ((clientX - rect.left) / rect.width) * 2 - 1,
                y: -((clientY - rect.top) / rect.height) * 2 + 1
            };
        };

        const handleStart = (e) => {
            if (e.touches && e.touches.length === 2) {
                // Pinch start
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                pinchDistance.current = Math.sqrt(dx * dx + dy * dy);
            } else {
                isDragging.current = true;
                const pos = getPointerPosition(e);
                previousTouch.current = pos;

                // Raycast for touch point
                pointer.current.set(pos.x, pos.y);
                raycaster.current.setFromCamera(pointer.current, camera);
                if (meshRef.current) {
                    const intersects = raycaster.current.intersectObject(meshRef.current);
                    if (intersects.length > 0) {
                        onTouchPoint(intersects[0].point, 1.0);
                    }
                }
            }
        };

        const handleMove = (e) => {
            if (e.touches && e.touches.length === 2) {
                // Pinch move
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const newDistance = Math.sqrt(dx * dx + dy * dy);
                const delta = (newDistance - pinchDistance.current) * 0.01;
                onPinch(delta);
                pinchDistance.current = newDistance;
            } else if (isDragging.current && meshRef.current) {
                const pos = getPointerPosition(e);
                const deltaX = pos.x - previousTouch.current.x;
                const deltaY = pos.y - previousTouch.current.y;

                meshRef.current.rotation.y += deltaX * 2;
                meshRef.current.rotation.x += deltaY * 2;

                previousTouch.current = pos;
            }
        };

        const handleEnd = () => {
            isDragging.current = false;
            onTouchPoint(new THREE.Vector3(0, 0, 0), 0);
        };

        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('touchstart', handleStart, { passive: true });
        canvas.addEventListener('touchmove', handleMove, { passive: true });
        canvas.addEventListener('touchend', handleEnd);

        return () => {
            canvas.removeEventListener('mousedown', handleStart);
            canvas.removeEventListener('mousemove', handleMove);
            canvas.removeEventListener('mouseup', handleEnd);
            canvas.removeEventListener('touchstart', handleStart);
            canvas.removeEventListener('touchmove', handleMove);
            canvas.removeEventListener('touchend', handleEnd);
        };
    }, [gl, camera, meshRef, onPinch, onTouchPoint]);

    return null;
};

// ============== BLOB VISUALIZER ==============
const BlobVisualizer = ({ audioData, isPlaying, currentSession, onClick, globalRipple }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    const [scale, setScale] = useState(1);
    const [touchPoint, setTouchPoint] = useState({ point: new THREE.Vector3(0, 0, 0), strength: 0 });
    const targetScale = useRef(1);
    const touchStrength = useRef(0);
    const globalRippleStrength = useRef(0);
    const lastRippleTime = useRef(0);

    const config = GEOMETRY_CONFIGS[currentSession] || GEOMETRY_CONFIGS.session1;

    const geometry = useMemo(() => {
        let geo;
        if (config.type === 'torusKnot') {
            geo = new THREE.TorusKnotGeometry(config.size, 0.25, config.detail, 32, 2, 3);
        } else {
            geo = new THREE.IcosahedronGeometry(config.size, config.detail);
        }
        geo.computeVertexNormals();
        return geo;
    }, [config.type, config.size, config.detail]);

    // Handle global ripple from screen touch - TEMPORARY effect
    useEffect(() => {
        if (globalRipple) {
            if (globalRipple.active) {
                // Active press - full strength glitch
                const ripplePos = new THREE.Vector3(globalRipple.x * 2, globalRipple.y * 2, 0);
                setTouchPoint({ point: ripplePos, strength: 1.2 });
                globalRippleStrength.current = 1.2;
            } else {
                // Released - reset immediately
                setTouchPoint({ point: new THREE.Vector3(0, 0, 0), strength: 0 });
                globalRippleStrength.current = 0;
            }
        }
    }, [globalRipple]);

    const handlePinch = (delta) => {
        targetScale.current = Math.max(0.5, Math.min(2, targetScale.current + delta));
    };

    const handleTouchPoint = (point, strength) => {
        setTouchPoint({ point, strength });
    };

    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return;

        const material = materialRef.current;

        material.uTime += delta;

        // Smooth scale interpolation
        const currentScale = THREE.MathUtils.lerp(scale, targetScale.current, 0.1);
        setScale(currentScale);
        material.uScale = currentScale;

        // Fast decay for glitch effect when not pressing
        const targetStrength = globalRipple?.active ? globalRippleStrength.current : 0;
        touchStrength.current = THREE.MathUtils.lerp(touchStrength.current, targetStrength, 0.2);
        material.uTouchStrength = touchStrength.current;
        material.uTouchPoint = touchPoint.point;

        // Update color uniforms
        material.uHueBase = THREE.MathUtils.lerp(material.uHueBase, config.hueBase, 0.05);
        material.uHueRange = THREE.MathUtils.lerp(material.uHueRange, config.hueRange, 0.05);
        material.uSaturation = THREE.MathUtils.lerp(material.uSaturation, config.saturation, 0.05);

        // Audio reactivity
        if (audioData && audioData.length > 0) {
            let bass = 0;
            for (let i = 0; i < 8; i++) bass += audioData[i] || 0;
            material.uBassAmplitude = THREE.MathUtils.lerp(material.uBassAmplitude, bass / (8 * 255), 0.15);

            let mids = 0;
            for (let i = 8; i < 24; i++) mids += audioData[i] || 0;
            material.uMidAmplitude = THREE.MathUtils.lerp(material.uMidAmplitude, mids / (16 * 255), 0.12);

            let highs = 0;
            for (let i = 24; i < Math.min(64, audioData.length); i++) highs += audioData[i] || 0;
            material.uHighAmplitude = THREE.MathUtils.lerp(material.uHighAmplitude, highs / (40 * 255), 0.1);
        }

        material.uIsPlaying = isPlaying ? 1.0 : 0.0;

        // Slow auto-rotation (when not being touched)
        if (touchStrength.current < 0.1) {
            meshRef.current.rotation.y += delta * 0.05;
            meshRef.current.rotation.x += delta * 0.02;
        }

        if (isPlaying && materialRef.current) {
            meshRef.current.rotation.y += delta * material.uBassAmplitude * 0.2;
        }
    });

    return (
        <>
            <TouchControls
                meshRef={meshRef}
                onPinch={handlePinch}
                onTouchPoint={handleTouchPoint}
            />
            <mesh
                ref={meshRef}
                onClick={onClick}
                geometry={geometry}
            >
                <blobShaderMaterial
                    ref={materialRef}
                    key={`${BlobShaderMaterial.key}-${currentSession}`}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    );
};

// ============== MAIN VISUALIZER ==============
const Visualizer = ({ audioData, isPlaying, onTogglePlay, currentSession, ripplePoint }) => {
    return (
        <div className="canvas-container">
            <Canvas
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: true
                }}
                style={{ background: '#050505' }}
            >
                <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 4.5]}
                    fov={45}
                    near={0.1}
                    far={100}
                />
                <BlobVisualizer
                    audioData={audioData}
                    isPlaying={isPlaying}
                    currentSession={currentSession}
                    onClick={onTogglePlay}
                    globalRipple={ripplePoint}
                />
            </Canvas>

            {/* Touch hints */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2"
                    style={{ zIndex: 5 }}
                >
                    <div className="touch-hint text-white/50 text-xs tracking-widest uppercase">
                        Toca para reproducir
                    </div>
                    <div className="text-white/30 text-[10px] tracking-wide text-center px-4">
                        Toca en cualquier parte para crear ondas
                    </div>
                </div>
            )}
        </div>
    );
};

export default Visualizer;

