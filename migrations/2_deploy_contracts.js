var TrackEnergy = artifacts.require("TrackEnergy");

module.exports = function(deployer, network, accounts) {
  console.log('Deploying to network', network);

  deployer.deploy(TrackEnergy).then(() => {
    console.log('Deployed TrackEnergy with address:', TrackEnergy.address);
  });
};
