
function cleanWMATABusData(data) {
    for (let i = 0; i < data.Predictions.length; i++) {
        const bus = data.Predictions[i];
        if (bus.Minutes) {
            bus.Minutes = bus.Minutes + " Minutes Away";
        }
    }
    return data
}

module.exports = cleanWMATABusData;
