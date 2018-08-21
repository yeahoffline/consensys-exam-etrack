pragma solidity ^0.4.24;

import "own3d/owned.sol";

/** @title TrackEnergy */
contract TrackEnergy is owned {

    /* stores public number of powerplants */
    uint public numPowerplants;

    /* emergency stop */
    bool private stopped = false;

    /* stores timestamp and kwh (kilowatt per hour) */
     struct ElectricMeter {
        uint ts;
        uint kwh;
    }

    /* stores powerplant data */
    struct Powerplant {
        address owner;
        uint meterIndex;
        mapping (uint => ElectricMeter) electricMeter;
    }

    /* powerplant holder, stores powerplants by ID */
    mapping (uint => Powerplant) private powerplants;

    /** @dev Requires the stopped variable to be false.
        In case of an emergency stop the modifier does not allow execution
      */
      modifier stopInEmergency {
          require(!stopped);
          _;
      }

    /** @dev Event logger vor power meters
      * @param powerplantID The ID stored to powerplants mapping.
      * @return meterIndex The latest powermeter index.
      * @return ts The timestamp the powermeter was updated.
      * @return kwh The kWh value stored.
      */
    event LogMeter(uint powerplantID, uint meterIndex, uint ts, uint kwh);


    /* init contract */
    constructor() public {
        //init powerplant counter
        numPowerplants = 0;
     }


    /** @dev Creates a new powerplant
      * @return powerplantID The ID stored to powerplants mapping.
      */
    function newPowerplant() public stopInEmergency onlyowner  returns (uint powerplantID) {
        //Count up ID
        powerplantID = numPowerplants++;

        // Creates new struct and saves in storage
        powerplants[powerplantID] = Powerplant(owner, 0);

        return powerplantID;
    }

    /** @dev Query a powerplant by powerplantID and returns meter data
      * @param powerplantID The ID of the powerplant
      * @return meterIndex The latest powermeter index.
      * @return ts The timestamp the powermeter was updated.
      * @return kwh The kWh value stored.
      */
    function getPowerplant(uint powerplantID) public onlyowner view returns (uint meterIndex, uint ts, uint kwh) {
        Powerplant storage p = powerplants[powerplantID];
        return (p.meterIndex, p.electricMeter[p.meterIndex].ts, p.electricMeter[p.meterIndex].kwh);
    }


    /** @dev Writes energy data to power meter
      * @param powerplantID The ID of the powerplant
      * @param ts The timestamp right now
      * @param kwh The kWh produced right now
      */
    function writeMeter(uint powerplantID, uint ts, uint kwh) public stopInEmergency onlyowner  {
        Powerplant storage p = powerplants[powerplantID];

        //Count up ID
        p.meterIndex++;

        //Store power meter data
        p.electricMeter[p.meterIndex] = ElectricMeter(ts, kwh);

        //Send event to logs
        emit LogMeter(powerplantID, p.meterIndex, ts, kwh);
    }

    /** @dev Query the latest power meter data
      * @param powerplantID The ID of the powerplant
      * @return ts The timestamp the powermeter was updated.
      * @return kwh The kWh value stored.
      */
    function getLatestMeter(uint powerplantID) public onlyowner view returns (uint ts, uint kwh) {
        Powerplant storage p = powerplants[powerplantID];
        return (p.electricMeter[p.meterIndex].ts, p.electricMeter[p.meterIndex].kwh);
    }

    /** @dev Query the latest power meter ID
      * @param powerplantID The ID of the powerplant
      * @return id The latest meter index
      */
    function getMeterID(uint powerplantID) public onlyowner view returns (uint id) {
        Powerplant storage p = powerplants[powerplantID];
        return (p.meterIndex);
    }

    /** @dev Toggles the emergency stop
      */
    function toggleContractActive() onlyowner public {
        stopped = !stopped;
    }

}
