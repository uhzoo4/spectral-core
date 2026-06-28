import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useHardwareTier } from '../../hooks/useHardwareTier';
import { NullStateShader } from '../../shaders/NullStateShader';
import { liveValues } from '../../stores/liveValues';
import { networkState, discoveryState, emotionState, cinematicState } from '@cinematic-engine/core';

// 1. Controller component to handle high-frequency frame ticks inside the Canvas context
const SceneController = ({ instanceCount }: { instanceCount: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { useFrame: r3fUseFrame } = useThree();

  // Create shared temp structures to avoid heap allocations during frame ticks
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Initialize node matrices and indices once on mount
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Seed repeatable pseudorandom nodes
    for (let i = 0; i < instanceCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 5.0 + Math.random() * 8.0;

      // Distribute nodes in a premium atmospheric cluster shell
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * 0.5;

      tempObject.position.set(x, y, z);
      tempObject.scale.setScalar(0.08 + Math.random() * 0.12);
      tempObject.updateMatrix();

      mesh.setMatrixAt(i, tempObject.matrix);

      // Distribute baseline colors (Cyan/Teal theme)
      tempColor.setRGB(0.0, 0.8 + Math.random() * 0.2, 0.6 + Math.random() * 0.4);
      mesh.setColorAt(i, tempColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [instanceCount, tempObject, tempColor]);

  // Tight frame updates loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    liveValues.time = time;

    // Convert mouse NDC to scaled projection bounds
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

    // Update material uniforms directly (0 allocations)
    if (materialRef.current) {
      const mat = materialRef.current;
      mat.uniforms.uTime.value = time;
      mat.uniforms.uMouse.value[0] = liveValues.mouseX;
      mat.uniforms.uMouse.value[1] = liveValues.mouseY;

      // Sync color profiles from emotionState
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

      // Sync opacity triggers from discoveryState
      mat.uniforms.uNodeOpacity.value = discoveryState.nodeOpacity;
      mat.uniforms.uSignalOpacity.value = discoveryState.signalOpacity;
      mat.uniforms.uThreatOpacity.value = discoveryState.threatOpacity;

      // Sync focus dimensions from cinematicState
      mat.uniforms.uFocusPosition.value.copy(cinematicState.focusPosition);
      mat.uniforms.uFocusRadius.value = cinematicState.focusRadius;

      // Sync active uniform arrays
      mat.uniforms.uSignals.value = networkState.signals;
      mat.uniforms.uThreats.value = networkState.threats;
    }
  });

  // Safe manual disposal of meshes
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

// 2. SVG Fallback component for low-tier hardware configurations
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
        {/* Render a grid matrix of clean vector points */}
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

// 3. Main wrapper orchestrating hardware profile selections
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
