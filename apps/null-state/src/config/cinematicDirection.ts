export interface ActConfig {
  name: string;
  start: number;
  end: number;
  focusRadius: number;
  breathFrequency: number;
  cinematicLog: string;
}

export const cinematicConfig: ActConfig[] = [
  {
    name: 'Silence',
    start: 0.0,
    end: 0.15,
    focusRadius: 4.0,
    breathFrequency: 0.3,
    cinematicLog: 'Dormant void.',
  },
  {
    name: 'Observation',
    start: 0.15,
    end: 0.35,
    focusRadius: 6.0,
    breathFrequency: 0.6,
    cinematicLog: 'Presence detected.',
  },
  {
    name: 'Awakening',
    start: 0.35,
    end: 0.55,
    focusRadius: 10.0,
    breathFrequency: 1.0,
    cinematicLog: 'Signal acquired.',
  },
  {
    name: 'Tension',
    start: 0.55,
    end: 0.75,
    focusRadius: 8.0,
    breathFrequency: 2.2, // Faster nervous breathing
    cinematicLog: 'Integrity compromised.',
  },
  {
    name: 'Understanding',
    start: 0.75,
    end: 0.90,
    focusRadius: 15.0,
    breathFrequency: 0.8,
    cinematicLog: 'Architecture revealed.',
  },
  {
    name: 'Resolution',
    start: 0.90,
    end: 1.0,
    focusRadius: 30.0, // Open focal bounds
    breathFrequency: 0.4, // Return to calm slow breathing
    cinematicLog: 'Awareness rising.',
  },
];
