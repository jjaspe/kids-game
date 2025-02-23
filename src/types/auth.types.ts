export interface AuthorizedDevice {
  id: string;
  name: string;
  token: string;
  createdAt: Date;
  lastUsed: Date;
}

export interface GameSession {
  id: string;
  playerDevices: string[]; // Array of device tokens
  startedAt: Date;
  gameMode: "single" | "battle";
  status: "waiting" | "in-progress" | "completed";
  scores: {
    [deviceToken: string]: number;
  };
}
