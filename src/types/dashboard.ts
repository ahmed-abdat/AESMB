export interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  totalRounds: number;
  pointsSystem: {
    win: number;
    draw: number;
    loss: number;
  };
} 