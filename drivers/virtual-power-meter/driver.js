'use strict';

const Homey = require('homey');

class MyDriver extends Homey.Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('MyDriver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
    onPairListDevices(data, callback) {

        const devices = [
            {
                // Required properties:
                "data": { "id": "my-device" },

                // Optional properties, these overwrite those specified in app.json:
                // "name": "My Device",
                // "icon": "/my_icon.svg", // relative to: /drivers/<driver_id>/assets/
                // "capabilities": [ "onoff", "dim" ],
                // "capabilitiesOptions: { "onoff": {} },

                // Optional properties, device-specific:
                // "store": { "foo": "bar" },
                // "settings": { "my_setting": "my_value" },

            }
        ]
    callback(null, devices);
    }
}

module.exports = MyDriver;