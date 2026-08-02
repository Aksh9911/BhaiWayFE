export interface ActiveTripPassenger {
  id: string;
  name: string;
  avatarUri: string;
  isOnline: boolean;
}

export interface ActiveTripNavStep {
  instruction: string;
  distanceLabel: string;
  icon: 'arrow-forward' | 'return-up-forward' | 'return-down-back';
}

export interface ActiveTripSummary {
  destinationLabel: string;
  etaMinutes: number;
  distanceLabel: string;
  progress: number;
  mapImageUri: string;
  navStep: ActiveTripNavStep;
  passengers: readonly ActiveTripPassenger[];
}
