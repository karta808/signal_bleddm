import QtQuick 2.15
import QtQuick.Controls 2.15
import SignalRGB.Controls 1.0

SignalRGBAddon {
    id: addon

    Column {
        spacing: 10
        anchors.centerIn: parent

        Label {
            text: "Enter MAC Address"
            font.pixelSize: 16
        }

        TextField {
            id: macField
            placeholderText: "XX:XX:XX:XX:XX:XX"
            font.pixelSize: 14
            width: 300
            onTextChanged: addon.updateParameter("deviceMac", text)
        }

        Label {
            text: "Number of LEDs"
            font.pixelSize: 16
        }

        Slider {
            id: ledCountSlider
            from: 1
            to: 300
            value: 30
            stepSize: 1
            width: 300
            onValueChanged: addon.updateParameter("ledCount", value)
        }

        Label {
            text: `LED Count: ${ledCountSlider.value}`
            font.pixelSize: 14
        }
    }
}
