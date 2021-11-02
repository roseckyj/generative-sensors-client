import React from "react";
import screenfull from "screenfull";
import "./App.css";
import { Sender } from "./Sender";
import { isDefined } from "./utils/isDefined";

interface IAppState {}

export default class App extends React.Component<{}, IAppState> {
    state: IAppState = {};

    constructor(props: {}) {
        super(props);

        Sender.create();
    }

    componentDidMount() {
        setInterval(() => {
            this.forceUpdate();
        }, 1000);
    }

    render() {
        return (
            <div
                className="wrapper"
                onClick={() => {
                    if (screenfull.isEnabled) {
                        screenfull.request();
                    }
                }}
            >
                <div className="status">
                    <div
                        className={
                            isDefined(Sender.sensors.Accelerometer.x)
                                ? "accepted"
                                : undefined
                        }
                    >
                        Accelerometer
                    </div>
                    <div
                        className={
                            isDefined(Sender.sensors.Gyroscope.x)
                                ? "accepted"
                                : undefined
                        }
                    >
                        Gyroscope
                    </div>
                    <div
                        className={
                            isDefined(Sender.sensors.LinearAccelerationSensor.x)
                                ? "accepted"
                                : undefined
                        }
                    >
                        LinearAccelerationSensor
                    </div>
                    <div
                        className={
                            isDefined(
                                Sender.sensors.AbsoluteOrientationSensor
                                    .quaternion
                            )
                                ? "accepted"
                                : undefined
                        }
                    >
                        AbsoluteOrientationSensor
                    </div>
                    <div
                        className={
                            isDefined(
                                Sender.sensors.RelativeOrientationSensor
                                    .quaternion
                            )
                                ? "accepted"
                                : undefined
                        }
                    >
                        RelativeOrientationSensor
                    </div>
                </div>
                <div className="id">
                    {Sender.id ? Sender.id : "Connecting..."}
                </div>
            </div>
        );
    }
}
