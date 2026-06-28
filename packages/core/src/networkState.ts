import { Vector3, Vector4 } from 'three';

export const MAX_CLUSTERS = 16;
export const MAX_SIGNALS = 8;
export const MAX_THREATS = 4;

export interface NetworkState {
  clusterCenters: Vector3[];
  clusterBases: Vector3[];
  clusterCounts: number;
  
  // Signals: xyz = position, w = current radius
  signals: Vector4[];
  signalLifetimes: number[];
  signalActive: boolean[];
  
  // Threats: xyz = position, w = intensity/glitch factor (0..1)
  threats: Vector4[];
  threatRadii: number[];
  threatLifetimes: number[];
  threatActive: boolean[];
  
  // Observer/Pointer state
  pointerPos: Vector3;
  pointerActive: boolean;
  pointerSpeed: number;
}

export const networkState: NetworkState = {
  clusterCenters: Array.from({ length: MAX_CLUSTERS }, () => new Vector3()),
  clusterBases: Array.from({ length: MAX_CLUSTERS }, () => new Vector3()),
  clusterCounts: 8,

  signals: Array.from({ length: MAX_SIGNALS }, () => new Vector4(0, 0, 0, 0)),
  signalLifetimes: Array(MAX_SIGNALS).fill(0),
  signalActive: Array(MAX_SIGNALS).fill(false),

  threats: Array.from({ length: MAX_THREATS }, () => new Vector4(0, 0, 0, 0)),
  threatRadii: Array(MAX_THREATS).fill(0),
  threatLifetimes: Array(MAX_THREATS).fill(0),
  threatActive: Array(MAX_THREATS).fill(false),

  pointerPos: new Vector3(0, 0, 0),
  pointerActive: false,
  pointerSpeed: 0,
};
