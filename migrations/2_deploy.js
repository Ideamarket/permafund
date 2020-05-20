const PermafundFactory = artifacts.require('PermafundFactory')

module.exports = async function(deployer, network, accounts) {
    if (network === 'mainnet' || network === 'mainnet-fork') {
      const dai = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
      const rDai = '0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0'

      await deployer.deploy(PermafundFactory, dai, rDai)
    } else {
        throw new Error('Unknown network: ' + network)
    }
}