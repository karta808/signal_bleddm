import { exec } from "child_process";
import path from "path";

export function Name() { return "BLE RGB Strip"; }
export function Version() { return "1.0.0"; }
export function Type() { return "python-exec"; }
export function Publisher() { return "YourName"; }
export function Size() { return [1, 1]; }

let ledCount = 30; // Number of LEDs on the strip

export function ControllableParameters() {
    return [
        { "property": "deviceMac", "group": "Device", "label": "Device MAC Address", "type": "text", "default": "" },
        { "property": "ledCount", "group": "Device", "label": "Number of LEDs", "type": "slider", "min": 1, "max": 300, "default": 30 }
    ];
}

let macAddress = "";
let pythonScriptPath = "";

export function Initialize() {
    macAddress = device.getParameter("deviceMac");
    ledCount = device.getParameter("ledCount");
    pythonScriptPath = path.join(__dirname, "control_color.py");

    if (!macAddress) {
        device.log("No MAC address provided. Please set one in settings.");
        return;
    }

    device.setName(`BLE RGB Strip: ${macAddress}`);
    setupChannel();
}

function setupChannel() {
    device.addChannel("RGB Strip", ledCount);
    device.channel("RGB Strip").SetLedLimit(ledCount);
    device.SetLedLimit(ledCount);
}

export function Render() {
    if (!macAddress) {
        device.log("MAC address not set.");
        return;
    }

    const colors = device.channel("RGB Strip").getColors("Inline");
    sendColorsToPython(colors);
}

function sendColorsToPython(colors) {
    const colorBytes = colors.flatMap(c => [c.red, c.green, c.blue]).join(",");
    const command = `python3 ${pythonScriptPath} ${macAddress} ${colorBytes}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            device.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            device.log(`stderr: ${stderr}`);
            return;
        }
        device.log(`Output: ${stdout}`);
    });
}
