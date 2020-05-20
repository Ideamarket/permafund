import Web3 from 'web3'
import PermafundFactoryArtifact from '../../../build/contracts/PermafundFactory'

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

async function tryCreateWeb3 () {
  let web3
  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    try {
      await window.ethereum.enable()
    } catch (e) {
      return undefined
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
  } else {
    return undefined
  }

  web3.eth.defaultAccount = (await web3.eth.getAccounts())[0]
  return web3
}

export async function create (context, recipientAddress) {
  const web3 = await tryCreateWeb3()
  if (!web3) {
    throw new Error('Failed to connect to wallet')
  }

  recipientAddress = recipientAddress.trim()
  if (!web3.utils.isAddress(recipientAddress)) {
    throw new Error('Invalid recipient address')
  }

  const factory = new web3.eth.Contract(PermafundFactoryArtifact.abi, PermafundFactoryArtifact.networks['1'].address)

  if (await factory.methods.permafunds.call(recipientAddress) !== ZERO_ADDR) {
    throw new Error('Recipient has Permafund already')
  }

  try {
    await factory.methods.deployPermafund(recipientAddress)
  } catch (ex) {
    throw new Error('Transaction failed')
  }
}
