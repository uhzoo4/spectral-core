import { Color, Vector4 } from 'three';

export const NullStateShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: [0, 0] },
    uPrimaryColor: { value: new Color(0.12, 0.13, 0.14) },
    uGlowColor: { value: new Color(0.04, 0.04, 0.05) },
    uNodeOpacity: { value: 1.0 },
    uSignalOpacity: { value: 1.0 },
    uThreatOpacity: { value: 1.0 },
    uSignals: { value: Array.from({ length: 8 }, () => new Vector4(0, 0, 0, 0)) },
    uThreats: { value: Array.from({ length: 4 }, () => new Vector4(0, 0, 0, 0)) },
  },

  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec4 uThreats[4];
    
    varying vec3 vWorldPosition;
    varying vec3 vColor;
    varying float vDensity;

    vec3 lissajous(float t, float freqScale) {
      return vec3(
        sin(t * freqScale) * cos(t * freqScale * 0.75),
        sin(t * freqScale * 1.3 + 1.2) * cos(t * freqScale * 0.5),
        cos(t * freqScale * 0.9)
      ) * 0.6;
    }

    void main() {
      vColor = color;
      
      // Calculate active world coordinates of this instance
      vec4 instancePosition = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      
      // Apply procedural organic drift offset
      float offsetTime = uTime * 0.35 + instancePosition.x * 0.02 + instancePosition.y * 0.02;
      vec3 drift = lissajous(offsetTime, 0.4);
      
      vec3 localPosition = position * (1.0 + sin(uTime * 0.8 + instancePosition.z) * 0.08);
      vec4 modelPosition = instanceMatrix * vec4(localPosition + drift * 0.9, 1.0);

      // Mouse/Pointer displacement check
      float distToMouse = distance(modelPosition.xy, uMouse);
      if (distToMouse < 6.0) {
        float pullStrength = (1.0 - distToMouse / 6.0) * 0.35;
        modelPosition.xy += (uMouse - modelPosition.xy) * pullStrength;
      }

      // Threat anomalies vertex displacements
      float glitchFactor = 0.0;
      for (int i = 0; i < 4; i++) {
        if (uThreats[i].w > 0.0) {
          float distToThreat = distance(modelPosition.xyz, uThreats[i].xyz);
          if (distToThreat < 6.0) {
            float localGlitch = (1.0 - distToThreat / 6.0) * uThreats[i].w;
            glitchFactor = max(glitchFactor, localGlitch);
          }
        }
      }

      if (glitchFactor > 0.0) {
        modelPosition.x += sin(modelPosition.y * 80.0 + uTime * 50.0) * 0.12 * glitchFactor;
        modelPosition.z += cos(modelPosition.x * 80.0 + uTime * 50.0) * 0.12 * glitchFactor;
      }

      vWorldPosition = modelPosition.xyz;
      vDensity = clamp((modelPosition.z + 10.0) / 20.0, 0.0, 1.0);

      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;
    }
  `,

  fragmentShader: `
    uniform vec3 uPrimaryColor;
    uniform vec3 uGlowColor;
    uniform float uNodeOpacity;
    uniform float uSignalOpacity;
    uniform float uThreatOpacity;
    
    uniform vec4 uSignals[8];
    uniform vec4 uThreats[4];
    
    varying vec3 vWorldPosition;
    varying vec3 vColor;
    varying float vDensity;

    void main() {
      // 1. Blend background graphite with emotional theme colors
      vec3 finalColor = mix(uGlowColor, uPrimaryColor, vDensity);

      // 2. Pulse signals wavefront animation
      float signalGlow = 0.0;
      for (int i = 0; i < 8; i++) {
        if (uSignals[i].w > 0.0) {
          float dist = distance(vWorldPosition.xyz, uSignals[i].xyz);
          float distToWavefront = abs(dist - uSignals[i].w);
          if (distToWavefront < 1.5) {
            float pulseGlow = (1.0 - distToWavefront / 1.5) * (1.0 - uSignals[i].w / 25.0);
            signalGlow = max(signalGlow, pulseGlow);
          }
        }
      }
      
      finalColor = mix(finalColor, vColor, signalGlow * 0.9 * uSignalOpacity);

      // 3. Threat anomalies color shifts
      float threatFactor = 0.0;
      for (int i = 0; i < 4; i++) {
        if (uThreats[i].w > 0.0) {
          float dist = distance(vWorldPosition.xyz, uThreats[i].xyz);
          if (dist < 6.0) {
            float intensity = (1.0 - dist / 6.0) * uThreats[i].w;
            threatFactor = max(threatFactor, intensity);
          }
        }
      }
      
      if (threatFactor > 0.0) {
        vec3 threatColor = vec3(0.9, 0.45, 0.0); // Amber
        threatColor = mix(threatColor, vec3(0.8, 0.05, 0.12), threatFactor); // Crimson mix
        finalColor = mix(finalColor, threatColor, threatFactor * uThreatOpacity);
      }

      // 4. Circular point alpha mask
      float centerGlow = 1.0 - length(gl_PointCoord - vec2(0.5)) * 2.0;
      centerGlow = clamp(centerGlow, 0.0, 1.0);
      
      gl_FragColor = vec4(finalColor, centerGlow * uNodeOpacity * vDensity);
    }
  `
};
