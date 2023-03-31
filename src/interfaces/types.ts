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

export interface PayLoadInfo {
    payloadid: string;
    payloadname: string;
    payloadstate: number;
    payLoadType: number;
    payLoadTelemetery: boolean;
    payLoadData: boolean;
  }

  export interface ApiResponse {
    CommunicationData?: {
        Bandwidth: {
            Uplink: number;
            Downlink: number;
        };
    }[];
    ImageData?: string[];
    ScientificData?: {
        Weather: {
            Rain: number;
            Humidity: number;
            Snow: number;
        };
    }[];
}