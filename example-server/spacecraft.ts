
export type TelemetryType = "prop.fuel" | 
                    "prop.thrusters" |
                    "comms.recd" |
                    "comms.sent" |
                    "pwr.temp" |
                    "pwr.c" |
                    "pwr.v";

export type TelemetryRecord = {
    "prop.fuel": number,
    "prop.thrusters": "ON" | "OFF",
    "comms.recd": number,
    "comms.sent": number,
    "pwr.temp": number,
    "pwr.c": number,
    "pwr.v": number,
};

export type TelemetryRecordHistory = Record<TelemetryType, Array<State>>;

export interface State {
    timestamp: number, 
    value: number | string, 
    id: string
}

export type Listerer = (point : State) => void;

export class Spacecraft {

    state : TelemetryRecord = {
        "prop.fuel": 77,
        "prop.thrusters": "OFF",
        "comms.recd": 0,
        "comms.sent": 0,
        "pwr.temp": 245,
        "pwr.c": 8.15,
        "pwr.v": 30,
    };

    history : TelemetryRecordHistory = {
        "prop.fuel": [],
        "prop.thrusters": [],
        "comms.recd": [],
        "comms.sent": [],
        "pwr.temp": [],
        "pwr.c": [],
        "pwr.v": [],
    };
    listeners : Array<Listerer> = [];

    constructor() {
        let _this : Spacecraft = this;
        // Object.keys(this.state).forEach(function (k : string) {
        //     _this.history[k] = [];
        // }, this);

        setInterval(function () {
            _this.updateState();
            _this.generateTelemetry();
        }.bind(_this), 1000);        
        console.log("Example spacecraft launched!");
        console.log("Press Enter to toggle thruster state.");
        process.stdin.on('data', function () {
            _this.state['prop.thrusters'] = (_this.state['prop.thrusters'] === "OFF") ? "ON" : "OFF";
            _this.state['comms.recd'] += 32;
            console.log("Thrusters " + _this.state["prop.thrusters"]);
            _this.generateTelemetry();
        }.bind(_this));    
    }

    updateState() {
        this.state["prop.fuel"] = Math.max(
            0,
            this.state["prop.fuel"] -
                (this.state["prop.thrusters"] === "ON" ? 0.5 : 0)
        );

        this.state["pwr.temp"] = this.state["pwr.temp"] * 0.985
            + Math.random() * 0.25 + Math.sin(Date.now());

        if (this.state["prop.thrusters"] === "ON") {
            this.state["pwr.c"] = 8.15;
        } else {
            this.state["pwr.c"] = this.state["pwr.c"] * 0.985;
        }

        this.state["pwr.v"] = 30 + Math.pow(Math.random(), 3);    
        
    }

    /**
     * Takes a measurement of spacecraft state, stores in history, and notifies 
     * listeners.
     */    
    generateTelemetry() {
        let timestamp : number = Date.now(), sent = 0;
        Object.keys(this.state).forEach(function (id : string) {
            let state : State = { timestamp: timestamp, value: this.state[id], id: id};
            this.notify(state);
            this.history[id].push(state);
            let sent = this.state["comms.sent"];
            sent += JSON.stringify(state).length;

        }, this);
    };

    notify(point : State) {
        this.listeners.forEach(function (l) {
            l(point);
        });
    };
    
    listen = function (listener : Listerer) {
        this.listeners.push(listener);
        let _this = this;
        return function () {
            _this.listeners = _this.listeners.filter(function (l : Listerer) {
                return l !== listener;
            });
        }.bind(this);
    };    
}