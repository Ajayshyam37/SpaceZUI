export interface Spacecraft {
    spaceCraft_ID: string;
    name: string;
    state: number;
    spaceCraftTelemetry:boolean;
    payloadname:string;
    payloadid:string;
    orbitRadius:number;
    totalTImeToOrbit:number;
}

export interface TelemetryData {
    id: string;
    altitude: string;
    longitude: string;
    latitude: string;
    temperature: string;
    timeToOrbit: string;
}

export interface ExpandedState {
    [key: string]: boolean;
}