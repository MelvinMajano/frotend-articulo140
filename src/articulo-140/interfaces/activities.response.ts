import type { UUID } from "crypto";

export interface ActivitiesResponse {
    message: Message[];
    data:    null;
}

export interface Message {
    id:             UUID;
    title:          string;
    description:    string;
    startDate:      string;
    endDate:        string;
    voaeHours:      number;
    availableSpots: number;
    status:         string;
    isDeleted:      string;
    Supervisor:     string;
    supervisorId:   UUID;
    scopes:         string[];
    isDisable:      number;
}
