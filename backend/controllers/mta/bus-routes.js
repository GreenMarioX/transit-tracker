const xml2js = require('xml2js');
const cleanMTARoutesData = require('./helpers/bus-routes-data-cleaner');

let busNYCTRoutesData = null;
let busBCRoutesData = null;

const parseXML = async (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const fetchNYCTBusRoutesData = async () => {
    try {
        const url = 'https://bustime.mta.info/api/where/routes-for-agency/MTA%20NYCT.xml?key=b1af2818-ea0d-4b2f-b632-5119632b6ae3';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const xml = await response.text();
        busNYCTRoutesData = await parseXML(xml);
        return cleanMTARoutesData(busNYCTRoutesData, "NYCT");
    } catch (error) {
        console.error('Fetching data failed', error);
        throw error;
    }
};

const fetchBCBusRoutesData = async () => {
    try {
        const url = 'https://bustime.mta.info/api/where/routes-for-agency/MTABC.xml?key=b1af2818-ea0d-4b2f-b632-5119632b6ae3';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const xml = await response.text();
        busBCRoutesData = await parseXML(xml);
        return cleanMTARoutesData(busBCRoutesData, "BC");
    } catch (error) {
        console.error('Fetching data failed', error);
        throw error;
    }
};

module.exports = {
    fetchNYCTBusRoutesData,
    fetchBCBusRoutesData
};