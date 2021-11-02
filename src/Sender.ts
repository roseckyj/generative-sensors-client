import {
    Accelerometer,
    Gyroscope,
    LinearAccelerationSensor,
    AbsoluteOrientationSensor,
    RelativeOrientationSensor,
} from "motion-sensors-polyfill";
import { io, Socket } from "socket.io-client";
import { isDefined } from "./utils/isDefined";

export type Sensors = {
    Accelerometer: Accelerometer;
    Gyroscope: Gyroscope;
    LinearAccelerationSensor: LinearAccelerationSensor;
    AbsoluteOrientationSensor: AbsoluteOrientationSensor;
    RelativeOrientationSensor: RelativeOrientationSensor;
};

type Vector3 = {
    x: number;
    y: number;
    z: number;
};
type Quaternion = {
    x: number;
    y: number;
    z: number;
    w: number;
};

type SensorData = {
    Accelerometer: null | Vector3;
    Gyroscope: null | Vector3;
    LinearAccelerationSensor: null | Vector3;
    AbsoluteOrientationSensor: null | Quaternion;
    RelativeOrientationSensor: null | Quaternion;
};

const permissions: PermissionName[] = [
    "accelerometer",
    "gyroscope",
    "magnetometer",
] as any;

export class Sender {
    static sensors: Sensors;

    private static socket: Socket | null = null;
    public static id: string | null;

    public static get exists() {
        return this.socket !== null;
    }

    private static send() {
        if (!this.socket) return;

        console.log(this.sensors);

        const data: SensorData = {
            Accelerometer: isDefined(this.sensors.Accelerometer.x)
                ? {
                      x: this.sensors.Accelerometer.x,
                      y: this.sensors.Accelerometer.y,
                      z: this.sensors.Accelerometer.z,
                  }
                : null,
            Gyroscope: isDefined(this.sensors.Gyroscope.x)
                ? {
                      x: this.sensors.Gyroscope.x,
                      y: this.sensors.Gyroscope.y,
                      z: this.sensors.Gyroscope.z,
                  }
                : null,
            LinearAccelerationSensor: isDefined(
                this.sensors.LinearAccelerationSensor.x
            )
                ? {
                      x: this.sensors.LinearAccelerationSensor.x,
                      y: this.sensors.LinearAccelerationSensor.y,
                      z: this.sensors.LinearAccelerationSensor.z,
                  }
                : null,
            AbsoluteOrientationSensor: isDefined(
                this.sensors.AbsoluteOrientationSensor.quaternion
            )
                ? {
                      x: this.sensors.AbsoluteOrientationSensor.quaternion[0],
                      y: this.sensors.AbsoluteOrientationSensor.quaternion[1],
                      z: this.sensors.AbsoluteOrientationSensor.quaternion[2],
                      w: this.sensors.AbsoluteOrientationSensor.quaternion[3],
                  }
                : null,
            RelativeOrientationSensor: isDefined(
                this.sensors.RelativeOrientationSensor.quaternion
            )
                ? {
                      x: this.sensors.RelativeOrientationSensor.quaternion[0],
                      y: this.sensors.RelativeOrientationSensor.quaternion[1],
                      z: this.sensors.RelativeOrientationSensor.quaternion[2],
                      w: this.sensors.RelativeOrientationSensor.quaternion[3],
                  }
                : null,
        };

        this.socket.send("data", data);
    }

    public static create() {
        if (this.socket) {
            return;
        }
        this.socket = io("http://192.168.0.145:8080");

        this.socket.on("connect", () => {
            console.log("[Socket] connected");
        });
        this.socket.on("disconnect", () => {
            console.log("[Socket] disconnected");
        });
        this.socket.on("message", (message, data) => {
            switch (message) {
                case "id":
                    this.id = data;
            }
        });
        this.socket.connect();

        this.sensors = {
            Accelerometer: new Accelerometer({ frequency: 60 }),
            Gyroscope: new Gyroscope(),
            LinearAccelerationSensor: new LinearAccelerationSensor({
                frequency: 60,
            }),
            AbsoluteOrientationSensor: new AbsoluteOrientationSensor({
                frequency: 60,
            }),
            RelativeOrientationSensor: new RelativeOrientationSensor({
                frequency: 60,
            }),
        };

        Promise.all(
            permissions.map(async (perm) => {
                try {
                    const result = await navigator.permissions.query({
                        name: perm,
                    });
                    return result;
                } catch (error) {
                    console.warn(error);
                }
            })
        )
            .then((result) => {
                Object.values(this.sensors).forEach((sensor) => sensor.start());
            })
            .catch((error) => console.warn(error));

        setInterval(() => this.send(), 50);

        return this.socket;
    }
}
