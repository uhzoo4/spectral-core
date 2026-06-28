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
      'Dormant.',
      'Listening.',
      'Awaiting presence...'
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
      'Observer Linked.',
      'Attention focused.',
      'Presence detected.'
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
      'Signal Acquired.',
      'Awakening network.',
      'Flow initialized.'
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
      'Integrity compromised.',
      'Isolating anomalous vector.',
      'Restrained tension.'
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
      'Architecture Revealed.',
      'Exposing connection vectors.',
      'Symmetric harmony.'
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
      'Awareness Rising.',
      'System fully synchronized.',
      'Equilibrium achieved.'
    ]
  }
];
