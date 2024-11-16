export type ErrorCode =
  | "duplicate_name"
  | "logo_upload_failed"
  | "not_found"
  | "team_in_use"
  | "duplicate_number"
  | "invalid_teams"
  | "unknown";

export interface ActionError {
  message: string;
  code: ErrorCode;
}

export class TeamActionError extends Error {
  constructor(message: string, public code?: ErrorCode) {
    super(message);
    this.name = "TeamActionError";
  }
}
