App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    return App.initWeb3()
  },

  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
    }
    web3 = new Web3(App.web3Provider)

    return App.initContract()
  },

  initContract: function () {
    App.bindEvents()

    $.getJSON('TrackEnergy.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TrackEnergyArtifact = data
      App.contracts.TrackEnergy = TruffleContract(TrackEnergyArtifact)

      // Set the provider for our contract
      App.contracts.TrackEnergy.setProvider(App.web3Provider)

      // Use our contract to retrieve powerplant data
      return App.updatePowerplants()
    })
  },

  bindEvents: function () {
    $(document).on('click', '.btn-newPowerplant', App.handleNewPowerplant)
    $(document).on('click', '.btn-writeMeter', App.handleWriteMeter)
  },

  updatePowerplants: function () {
    $('#powerplantRow').empty()
    $('#noPowerplants').hide()
    var trackEnergyInstance

    App.contracts.TrackEnergy.deployed().then(function (instance) {
      trackEnergyInstance = instance

      return trackEnergyInstance.numPowerplants.call()
    }).then(async function (numPowerplants) {
      if (numPowerplants.toNumber() > 0) {
        for (let i = 0; i < numPowerplants; i++) {
          const latestMeter = await trackEnergyInstance.getLatestMeter.call(i)
          if (latestMeter[0].toNumber() === 0) {
            latestMeter[0] = 'never'
          } else {
            latestMeter[0] = moment(latestMeter[0].toNumber()).format('YYYY-MM-DD hh:mm:ss')
          }
          $('#powerplantRow').handlebars('add', '#ppTemplate', {id: i, tsHuman: latestMeter[0], meter: latestMeter[1].toNumber()}, {remove: false})
        }
      } else {
        $('#noPowerplants').show()
      }
    }).catch(function (err) {
      console.log(err.message)
    })
  },

  handleNewPowerplant: function (event) {
    event.preventDefault()

    var contractInstance

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error)
      }

      var account = accounts[0]

      App.contracts.TrackEnergy.deployed().then(function (instance) {
        contractInstance = instance

        return contractInstance.newPowerplant(undefined, {from: account})
      }).then(function (result) {
        return App.insertPowerplant(result)
      }).catch(function (err) {
        console.log(err)
      })
    })
  },

  insertPowerplant: async function (result) {
    setTimeout(function () {
      // wait for mined block
      return App.updatePowerplants()
    }, 5100)
  },

  handleWriteMeter: function (event) {
    event.preventDefault()

    var contractInstance

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error)
      }

      var account = accounts[0]

      App.contracts.TrackEnergy.deployed().then(function (instance) {
        contractInstance = instance
        const id = $(event.target).data('id')
        return contractInstance.writeMeter(id, Date.now(), $('#kwh-' + id).val(), {from: account})
      }).then(function (result) {
        setTimeout(function () {
          // wait for mined block
          return App.updatePowerplants()
        }, 5100)
      }).catch(function (err) {
        console.log(err.message)
      })
    })
  }
}

$(function () {
  $(window).on('load', function () {
    App.init()
  })
})
