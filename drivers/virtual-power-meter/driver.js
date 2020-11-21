'use strict';

const Homey = require('homey');

class MyDriver extends Homey.Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
      this.log('MyDriver has been initialized');
      this.registerFlowCardAction_sensor('set_sensor_value', false);
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

    registerFlowCardAction_sensor(card_name) {
        let flowCardAction = new Homey.FlowCardAction(card_name);
        flowCardAction
            .register()
            .registerRunListener((args, state) => {
                try {
                    this.log('args: ' + simpleStringify(args));
                    let device = validateItem('device', args.device);
                    let sensor = validateItem('sensor', args.sensor);
                    let value = validateItem('value', args.value);

                    this.log(device.getName() + ' -> Sensor: ' + sensor);

                    var valueToSet;
                    if (isNaN(value)) {
                        if (value.toLowerCase() === 'true') {
                            valueToSet = true;
                        } else if (value.toLowerCase() === 'false') {
                            valueToSet = false;
                        } else {
                            valueToSet = value;
                        }
                    } else {
                        valueToSet = parseFloat(value, 10);
                    }

                    this.log(device.getName() + ' -> Value:  ' + valueToSet);
                    device.setCapabilityValue(sensor, valueToSet) // Fire and forget
                        .catch(this.error);

                    return Promise.resolve(true);
                }
                catch (error) {
                    this.log('Device triggered with missing information: ' + error.message)
                    this.log('args: ' + simpleStringify(args));
                    return Promise.reject(error);
                }
            })
    }
}

module.exports = MyDriver;

function validateItem(item, value) {
    if (typeof (value) == 'undefined' || value == null) {
        throw new ReferenceError(item + ' is null or undefined');
    }
    return value;
}

function cleanJson(object) {
    var simpleObject = {};
    for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        if (typeof (object[prop]) == 'object') {
            continue;
        }
        if (typeof (object[prop]) == 'function') {
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return simpleObject; // returns cleaned up Object
};

function simpleStringify(object) {
    var simpleObject = cleanJson(object);
    return JSON.stringify(simpleObject);
};