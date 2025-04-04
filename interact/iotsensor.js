import fs from 'fs';

export class IoTSensor {
    constructor(type, gpsLocation) {
        this.type = type;
        this.gpsLocation = gpsLocation;
        this.humidity = this.getRandomValue(30, 90);
        this.temperature = this.getRandomValue(-10, 40);
    }

    getRandomValue(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    }

    getNextValue(currentValue, variationRange) {
        const variation = (Math.random() * (variationRange * 2) - variationRange).toFixed(2);
        const newValue = parseFloat(currentValue) + parseFloat(variation);
        return newValue.toFixed(2);
    }

    generateSensorData() {
        const currentTime = new Date().toISOString();
        this.humidity = this.getNextValue(this.humidity, 0.5);
        this.temperature = this.getNextValue(this.temperature, 0.2);

        return {
            time: currentTime,
            type: this.type,
            latitude: this.gpsLocation.lat,
            longitude: this.gpsLocation.lon,
            humidity: this.humidity,
            temperature: this.temperature
        };
    }

    appendToFile(data, filename) {
        const dataString = `${data.time}, ${data.type}, ${data.latitude}, ${data.longitude}, ${data.humidity}, ${data.temperature}\n`;
        fs.appendFile(filename, dataString, (err) => {
            if (err) {
                console.error("Error appending data to file", err);
            } else {
                // console.log("Data appended to file");
            }
        });
    }

    start(intervalInSeconds, filename, durationInSeconds) {
        console.log("Starting IoT sensor simulation...");

        // Overwrite file with new headers
        fs.writeFileSync(filename, "Time, Type, Latitude, Longitude, Humidity, Temperature\n");

        let elapsedTime = 0;
        this.intervalId = setInterval(() => {
            if (elapsedTime >= durationInSeconds) {
                this.stop();
                return;
            }
            const sensorData = this.generateSensorData();
            // console.log(sensorData);
            this.appendToFile(sensorData, filename);
            elapsedTime += intervalInSeconds;
        }, intervalInSeconds * 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log("IoT sensor simulation stopped.");
        }
    }
}

// const sensor = new IoTSensor("Temp-Humid Sensor", { lat: 67.1256, lon: 48.2364 });
// sensor.start(1, 'iots.csv', 10);

export function obtainData() {
    return new Promise((resolve, reject) => {
        const sensor = new IoTSensor("Temp-Humid Sensor", { lat: 67.1256, lon: 48.2364 });
        sensor.start(1, 'iots.csv', 10);

        setTimeout(() => {
            try {
                const data = fs.readFileSync('iots.csv', 'utf8');
                resolve(data);
            } catch (error) {
                reject(error);
            }
        }, 11000);
    });
}