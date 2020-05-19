const { expectRevert } = require('@openzeppelin/test-helpers');

const TestERC20 = artifacts.require('TestERC20')
const TestRDai = artifacts.require('TestRDai')
const PermafundFactory = artifacts.require('PermafundFactory')

contract('PermafundFactory', async accounts  => {
    
    let dai
    let rDai
    let factory

    let recipient = accounts[1]

    let ZERO_ADDR = '0x0000000000000000000000000000000000000000'

    beforeEach(async () => {
        dai = await TestERC20.new('DAI', 'DAI')
        rDai = await TestRDai.new(dai.address)
        factory = await PermafundFactory.new(dai.address, rDai.address)
    })

    it('should deploy new permafund', async () => {
        assert.equal(await factory.permafunds.call(accounts[0]), ZERO_ADDR, 'should not have permafund')
        await factory.deployPermafund(recipient)
        assert.notEqual(await factory.permafunds.call(recipient), ZERO_ADDR, 'should have permafund')
    })

    it('should not create same permafund twice', async () => {
        assert.equal(await factory.permafunds.call(accounts[0]), ZERO_ADDR, 'should not have permafund')
        await factory.deployPermafund(recipient)
        assert.notEqual(await factory.permafunds.call(recipient), ZERO_ADDR, 'should have permafund')
        await expectRevert(factory.deployPermafund(recipient), 'permafund exists already')
    })
})