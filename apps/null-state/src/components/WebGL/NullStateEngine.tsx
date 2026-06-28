import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useHardwareTier } from '../../hooks/useHardwareTier';
import { NullStateShader } from '../../shaders/NullStateShader';
import { liveValues } from '../../stores/liveValues';
import { 
  engine, 
  networkState, 
  discoveryState, 
  emotionState, 
  cinematicState 
} from '@cinematic-engine/core';
import {
  TimeSystem,
  InteractionSystem,
  ClusterSystem,
  SignalPropagationSystem,
  ObserverSystem,
  ThreatSystem,
  DiscoverySystem,
  NarrativeSystem,
  RevealSystem,
  EmotionSystem,
  VisualLanguageSystem,
  TimelineDirector,
  PacingSystem,
  FocusSystem,
  InteractionLanguageSystem,
  MagneticFieldSystem,
  FocusAttentionSystem,
  InteractionTimelineSystem,
  NodeFieldSystem
} from '@cinematic-engine/systems';

// 1. Controller component to handle high-frequency frame ticks inside the Canvas context
const SceneController = ({ instanceCount }: { instanceCount: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const nodeFieldSystemRef = useRef<NodeFieldSystem | null>(null);

  // Pre-allocated temp structures to avoid heap allocations in frame loops
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Initialize systems and link them with the engine
  useEffect(() => {
    const timeSystem = new TimeSystem();
    const interactionSystem = new InteractionSystem();
    const clusterSystem = new ClusterSystem();
    const signalSystem = new SignalPropagationSystem();
    const observerSystem = new ObserverSystem();
    const threatSystem = new ThreatSystem();
    const discoverySystem = new DiscoverySystem();
    const narrativeSystem = new NarrativeSystem();
    const revealSystem = new RevealSystem();
    const emotionSystem = new EmotionSystem();
    const visualLanguageSystem = new VisualLanguageSystem();
    const timelineDirector = new TimelineDirector();
    const pacingSystem = new PacingSystem();
    const focusSystem = new FocusSystem();
    const interactionLanguageSystem = new InteractionLanguageSystem();
    const magneticSystem = new MagneticFieldSystem();
    const focusAttentionSystem = new FocusAttentionSystem();
    const interactionTimelineSystem = new InteractionTimelineSystem();
    
    const nodeFieldSystem = new NodeFieldSystem(instanceCount);
    nodeFieldSystemRef.current = nodeFieldSystem;

    engine.registerSystem(timeSystem);
    engine.registerSystem(interactionSystem);
    engine.registerSystem(clusterSystem);
    engine.registerSystem(signalSystem);
    engine.registerSystem(observerSystem);
    engine.registerSystem(threatSystem);
    engine.registerSystem(discoverySystem);
    engine.registerSystem(narrativeSystem);
    engine.registerSystem(revealSystem);
    engine.registerSystem(emotionSystem);
    engine.registerSystem(visualLanguageSystem);
    engine.registerSystem(timelineDirector);
    engine.registerSystem(pacingSystem);
    engine.registerSystem(focusSystem);
    engine.registerSystem(interactionLanguageSystem);
    engine.registerSystem(magneticSystem);
    engine.registerSystem(focusAttentionSystem);
    engine.registerSystem(interactionTimelineSystem);
    engine.registerSystem(nodeFieldSystem);

    // Initial node configurations
    if (meshRef.current) {
      const mesh = meshRef.current;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      
      const obj = new THREE.Object3D();
      for (let i = 0; i < instanceCount; i++) {
        const px = nodeFieldSystem.positions[i * 3 + 0];
        const py = nodeFieldSystem.positions[i * 3 + 1];
        const pz = nodeFieldSystem.positions[i * 3 + 2];
        
        obj.position.set(px, py, pz);
        obj.scale.setScalar(0.08 + Math.random() * 0.12);
        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);

        tempColor.setRGB(0.0, 0.8 + Math.random() * 0.2, 0.6 + Math.random() * 0.4);
        mesh.setColorAt(i, tempColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
    }

    return () => {
      engine.dispose();
      nodeFieldSystemRef.current = null;
    };
  }, [instanceCount, tempColor]);

  // Tight frame loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    liveValues.time = time;

    const viewportWidth = state.viewport.width;
    const viewportHeight = state.viewport.height;

    networkState.pointerActive = true;
    networkState.pointerPos.set(
      state.pointer.x * viewportWidth * 0.5,
      state.pointer.y * viewportHeight * 0.5,
      0
    );

    liveValues.mouseX = networkState.pointerPos.x;
    liveValues.mouseY = networkState.pointerPos.y;

    // 1. Run engine systems update ticks (updates all positions and opacities)
    engine.update(time, delta);

    // 2. Direct matrix elements mutation (0 heap allocations)
    const nodeFieldSystem = nodeFieldSystemRef.current;
    if (meshRef.current && nodeFieldSystem) {
      const mesh = meshRef.current;
      for (let i = 0; i < instanceCount; i++) {
        mesh.getMatrixAt(i, tempMatrix);
        
        // Mutate translation coordinates in-place
        tempMatrix.elements[12] = nodeFieldSystem.positions[i * 3 + 0];
        tempMatrix.elements[13] = nodeFieldSystem.positions[i * 3 + 1];
        tempMatrix.elements[14] = nodeFieldSystem.positions[i * 3 + 2];
        
        mesh.setMatrixAt(i, tempMatrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // 3. Update shader material uniforms
    if (materialRef.current) {
      const mat = materialRef.current;
      mat.uniforms.uTime.value = time;
      mat.uniforms.uMouse.value[0] = liveValues.mouseX;
      mat.uniforms.uMouse.value[1] = liveValues.mouseY;

      mat.uniforms.uPrimaryColor.value.setRGB(
        emotionState.primaryColor.r,
        emotionState.primaryColor.g,
        emotionState.primaryColor.b
      );
      mat.uniforms.uGlowColor.value.setRGB(
        emotionState.glowColor.r,
        emotionState.glowColor.g,
        emotionState.glowColor.b
      );

      mat.uniforms.uNodeOpacity.value = discoveryState.nodeOpacity;
      mat.uniforms.uSignalOpacity.value = discoveryState.signalOpacity;
      mat.uniforms.uThreatOpacity.value = discoveryState.threatOpacity;

      mat.uniforms.uFocusPosition.value.copy(cinematicState.focusPosition);
      mat.uniforms.uFocusRadius.value = cinematicState.focusRadius;

      mat.uniforms.uSignals.value = networkState.signals;
      mat.uniforms.uThreats.value = networkState.threats;
    }
  });

  // Manual GPU resource cleanup
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        if (Array.isArray(meshRef.current.material)) {
          meshRef.current.material.forEach((m) => m.dispose());
        } else {
          meshRef.current.material.dispose();
        }
      }
    };
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, instanceCount]}>
      <circleGeometry args={[0.3, 8]} />
      <shaderMaterial
        ref={materialRef}
        args={[
          {
            uniforms: THREE.UniformsUtils.clone(NullStateShader.uniforms),
            vertexShader: NullStateShader.vertexShader,
            fragmentShader: NullStateShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </instancedMesh>
  );
};

const SVGFallback = () => {
  return (
    <div className="absolute inset-0 bg-[#07090b] flex items-center justify-center pointer-events-none select-none">
      <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffb7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#07090b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="40%" fill="url(#grad)" />
        {Array.from({ length: 40 }).map((_, i) => {
          const x = 10 + (i % 8) * 12 + Math.sin(i) * 2;
          const y = 10 + Math.floor(i / 8) * 18 + Math.cos(i) * 2;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r="2"
              fill="#00ffb7"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '3s' }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default function NullStateEngine() {
  const hardwareTier = useHardwareTier();

  if (hardwareTier === 'low') {
    return <SVGFallback />;
  }

  const instanceCount = hardwareTier === 'high' ? 5000 : 2000;
  const enableBloom = hardwareTier === 'high';

  return (
    <div className="absolute inset-0 w-full h-full bg-[#030507] z-0 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 100 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          depth: false,
        }}
      >
        <color attach="background" args={['#030507']} />
        
        <SceneController instanceCount={instanceCount} />

        {enableBloom && (
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
