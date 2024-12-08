import asyncio
import sys
from bleak import BleakClient

class ELKBLEDOMController:
    def __init__(self, mac_address):
        self.mac_address = mac_address
        self.characteristic_uuid = "0000fff3-0000-1000-8000-00805f9b34fb"

    async def send_command(self, command):
        async with BleakClient(self.mac_address) as client:
            await client.write_gatt_char(self.characteristic_uuid, command)

    def create_color_command(self, colors):
        command = bytearray([0x7E, 0x07, 0x05, 0x03])
        for color in colors:
            command.extend(color)
        command.extend([0x10, 0xEF])
        return command

    async def set_colors(self, rgb_values):
        colors = [tuple(map(int, rgb_values[i:i+3])) for i in range(0, len(rgb_values), 3)]
        command = self.create_color_command(colors)
        await self.send_command(command)
        print(f"Colors set to: {colors}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 control_color.py <MAC_ADDRESS> <R,G,B,...>")
        sys.exit(1)

    mac_address = sys.argv[1]
    rgb_values = list(map(int, sys.argv[2].split(",")))

    controller = ELKBLEDOMController(mac_address)
    asyncio.run(controller
