const TestERC20 = artifacts.require('TestERC20')
const TestRDai = artifacts.require('TestRDai')
const PermafundFactory = artifacts.require('PermafundFactory')
const Permafund = artifacts.require('Permafund')

contract('Permafund', async accounts  => {
    
    let dai
    let rDai
    let factory
    let permafund

    let user = accounts[0]
    let recipient = accounts[1]

    let hundred18Dec = new web3.utils.BN('100000000000000000000')

    async function deployPermafund(recipient) {
        await factory.deployPermafund(recipient)
        return await Permafund.at(await factory.permafunds.call(recipient))
    }

    async function getRDaiHat(user) {
        const id = (await rDai.userHats.call(user)).toString()
        const recipients = await rDai.getHatRecipients.call(id)
        const proportions = await rDai.getHatProportions.call(id)
        return { id, recipients, proportions }
    }

    beforeEach(async () => {
        dai = await TestERC20.new('DAI', 'DAI')
        rDai = await TestRDai.new(dai.address)
        factory = await PermafundFactory.new(dai.address, rDai.address)
        permafund = await deployPermafund(recipient)
    })

    it('should have correct permafund hat', async () => {
        const { recipients, proportions } = await getRDaiHat(permafund.address)

        assert.equal(recipients.length, 1, 'should only have 1 recipient')
        assert.equal(proportions.length, 1, 'should only have 1 proportion')
        assert.equal(recipients[0], recipient, 'should have correct recipient address')
        assert.equal(parseInt(proportions[0].toString()), 100, 'proportion should be 100')
    })

    it('should deposit', async () => {
        await dai.testMint(user, hundred18Dec)
        await dai.approve(permafund.address, hundred18Dec)
        await permafund.deposit(hundred18Dec)

        assert.equal((await dai.balanceOf(user)).toString(), '0', 'user should not have any dai balance')
        assert.equal((await rDai.balanceOf(permafund.address)).toString(), hundred18Dec.toString(), 'permafund should not have rDai balance')
    })
})