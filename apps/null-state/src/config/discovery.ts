export interface DiscoveryStateConfig {
  label: string;
  nodeSpeedMultiplier: number;
  nodeOpacity: number;
  connectionOpacity: number;
  signalOpacity: number;
  threatOpacity: number;
  telemetryLogs: string[];
}

export const discoveryConfig: DiscoveryStateConfig[] = [
  {
    label: 'NULL_STATE',
    nodeSpeedMultiplier: 0.08,
    nodeOpacity: 0.1,
    connectionOpacity: 0.0,
    signalOpacity: 0.0,
    threatOpacity: 0.0,
    telemetryLogs: [
      'SYSTEM DORMANT. LEVEL 0 MONITOR ACTIVE.',
      'READING ZERO STIMULI. DAMPING ALL CENTROIDS.',
      'AWAITING INPUT SIGNATURES...'
    ]
  },
  {
    label: 'OBSERVER_DETECTED',
    nodeSpeedMultiplier: 0.35,
    nodeOpacity: 0.5,
    connectionOpacity: 0.05,
    signalOpacity: 0.0,
    threatOpacity: 0.0,
    telemetryLogs: [
      'INPUT STIMULI LOCATED. POINTER SIGNATURE INTERCEPTED.',
      'BIAS VECTORS INITIATED TOWARDS COORDINATES.',
      'MONITORING POINTER DWELL TIMERS.'
    ]
  },
  {
    label: 'NETWORK_AWAKENING',
    nodeSpeedMultiplier: 0.8,
    nodeOpacity: 0.85,
    connectionOpacity: 0.25,
    signalOpacity: 0.6,
    threatOpacity: 0.0,
    telemetryLogs: [
      'SUSTAINED INTERACTION CONFIRMED. AWAKENING ANCHORS.',
      'PROPAGATING WAVEFRONT PULSES ACROSS NODES.',
      'ESTABLISHING SHUNT ROUTINGS...'
    ]
  },
  {
    label: 'ANOMALY_DETECTED',
    nodeSpeedMultiplier: 1.0,
    nodeOpacity: 1.0,
    connectionOpacity: 0.5,
    signalOpacity: 1.0,
    threatOpacity: 0.7,
    telemetryLogs: [
      'CRITICAL WARN: FOREIGN VECTOR IDENTIFIED.',
      'SPAWNING COMPRESSION GLITCH ANOMALIES.',
      'ISOLATING THREAT COORDINATES.'
    ]
  },
  {
    label: 'ARCHITECTURE_REVEALED',
    nodeSpeedMultiplier: 1.0,
    nodeOpacity: 1.0,
    connectionOpacity: 0.9,
    signalOpacity: 1.0,
    threatOpacity: 1.0,
    telemetryLogs: [
      'EXPOSING SYSTEM ARCHITECTURE SCHEMATICS.',
      'LAYERS ACTIVATED: CLUSTER // SIGNAL // OBSERVER // THREAT.',
      'TRANSLATING RAW VECTORS TO HIGH-FREQUENCY UNIFORMS.'
    ]
  },
  {
    label: 'FULL_AWARENESS',
    nodeSpeedMultiplier: 1.0,
    nodeOpacity: 1.0,
    connectionOpacity: 1.0,
    signalOpacity: 1.0,
    threatOpacity: 1.0,
    telemetryLogs: [
      'NETWORK FULLY SYNCHRONIZED.',
      'DYNAMIC EQUILIBRIUM ACHIEVED. FREESPAN LOAD COMPLETED.',
      'SYSTEM AWARE. OBSERVATION LOOP NOMINAL.'
    ]
  }
];
