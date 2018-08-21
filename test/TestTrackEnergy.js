const TrackEnergy = artifacts.require('TrackEnergy')

contract('TrackEnergy', async (accounts) => {
  let instance
  const powerplantId = 0
  const ts = Date.now()
  const kwh = 123
  const errorThrowRevert = 'Error: VM Exception while processing transaction: revert'

  beforeEach(async () => {
    instance = await TrackEnergy.deployed()
  })

  it(`should create new powerplant with id ${powerplantId}`, async () => {
    let id = await instance.newPowerplant.call()

    assert.equal(id, powerplantId)
  })

  it(`should count up powerplant ids`, async () => {
    await instance.newPowerplant()
    let id = await instance.newPowerplant.call()

    assert.equal(id, powerplantId + 1)
  })

  it(`should return correct powerplant total number`, async () => {
    let num = await instance.numPowerplants.call()

    assert.equal(num, 1)
  })

  it(`should get powerplant with id ${powerplantId}`, async () => {
    let pp = await instance.getPowerplant.call(powerplantId)

    assert.equal(pp.length, 3)
    assert.equal(pp[0], 0)
    assert.equal(pp[1], 0)
    assert.equal(pp[2], 0)
  })

  it('should write to power meter', async () => {
    let result = await instance.writeMeter.call(powerplantId, ts, kwh)

    assert.equal(result.length, 0)
  })

  it('should get latest power meter values', async () => {
    await instance.writeMeter(powerplantId, ts, kwh)
    let res = await instance.getLatestMeter.call(powerplantId)

    assert.equal(res.length, 2)
    assert.equal(res[0], ts)
    assert.equal(res[1], kwh)
  })

  it('should get latest meter id', async () => {
    let res = await instance.getMeterID.call(powerplantId)

    assert.equal(res, 1)
  })

  it(`should get latest powerplant (id: ${powerplantId}) data`, async () => {
    let res = await instance.getPowerplant.call(powerplantId)
    assert.equal(res.length, 3)
    assert.equal(res[0], 1)
    assert.equal(res[1], ts)
    assert.equal(res[2], kwh)
  })

  it(`should toggle toggleContractActive`, async () => {
    const result = await instance.toggleContractActive.call()
    assert.equal(result.length, 0)
  })

  it(`should not allow newPowerplant cause toggleContractActive`, async () => {
    let errorString = undefined
    await instance.toggleContractActive()

    try {
      await instance.newPowerplant.call()
    } catch (error) {
      errorString = error.toString()
    } finally {
      await instance.toggleContractActive() //revert global state
      assert.equal(errorString, errorThrowRevert)
    }
  })

  it(`should not allow writeMeter cause toggleContractActive`, async () => {
    let errorString = undefined
    await instance.toggleContractActive()

    try {
      await instance.writeMeter.call(powerplantId, ts, kwh)
    } catch (error) {
      errorString = error.toString()
    } finally {
      await instance.toggleContractActive() //revert global state
      assert.equal(errorString, errorThrowRevert)
    }
  })

})
