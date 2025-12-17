export interface ActivityResponseByID {
    message: Message[];
    data:    null;
}

export interface Message {
    id:             string;
    title:          string;
    description:    string;
    startDate:      Date;
    endDate:        Date;
    voaeHours:      number;
    availableSpots: number;
    status:         string;
    isDeleted:      string;
    isDisabled:     string;
    Supervisor:     string;
    SupervisorId:   string;
    scopes:         string;
}
