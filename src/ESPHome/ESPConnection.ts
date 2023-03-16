import { BluetoothLEAdvertisementResponse, Connection } from '@2colors/esphome-native-api';
import EventEmitter from 'events';
import { BluetoothLEAdvertisement, IESPConnection } from './IESPConnection';

export class ESPConnection extends EventEmitter implements IESPConnection {
  private subscribedToBLEAdvertisements = false;
  constructor(private connection: Connection) {
    super();
  }

  private bluetoothLEAdvertisementListener({ address, name, ...message }: BluetoothLEAdvertisementResponse) {
    const mac = address.toString(16);
    if (!!name) name = Buffer.from(name, 'base64').toString('ascii');
    const advertisement: BluetoothLEAdvertisement = { mac, name, ...message };
    this.emit('BluetoothLEAdvertisement', advertisement);
  }

  subscribeToBLEAdvertisements() {
    if (this.subscribedToBLEAdvertisements) return;
    this.connection.bluetoothAdvertisementService(this.bluetoothLEAdvertisementListener.bind(this));
    this.subscribedToBLEAdvertisements = true;
  }
}
