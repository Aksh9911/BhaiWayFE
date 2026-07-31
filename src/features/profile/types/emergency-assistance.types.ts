export type EmergencyContactAction = 'call' | 'alarm';

export interface EmergencyContact {
  id: string;
  label: string;
  number?: string;
  action: EmergencyContactAction;
  actionLabel: string;
  icon: 'shield' | 'medkit' | 'people';
  tone: 'error' | 'primary';
}

export interface EmergencyRideSummary {
  driverName: string;
  vehicleLabel: string;
  plateNumber: string;
  locationLabel: string;
  avatarUri: string;
  statusLabel: string;
}
