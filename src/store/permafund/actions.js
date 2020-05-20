import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import PermafundFactoryArtifact from '../../../build/contracts/PermafundFactory'
import Permafund from '../../../build/contracts/Permafund'
import IRDai from '../../../build/contracts/IRDai'
import IERC20 from '../../../build/contracts/IERC20'

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'
const RDAI_ADDR = '0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0'
const DAI_ADDR = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

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
    await factory.methods.deployPermafund.send(recipientAddress)
  } catch (ex) {
    throw new Error('Transaction failed')
  }
}

export async function donate (context, params) {
  const web3 = await tryCreateWeb3()
  if (!web3) {
    throw new Error('Failed to connect to wallet')
  }

  const amountAsFloat = parseFloat(params.amount.trim())
  if (isNaN(amountAsFloat) || amountAsFloat <= 0.0) {
    throw new Error('Amount must be greater than zero')
  }

  const recipientAddress = params.recipientAddress.trim()
  // web3 bn cannot handle numbers with decimals
  const amount = new web3.utils.BN(new BigNumber(params.amount.trim()).multipliedBy(new BigNumber('10').exponentiatedBy(new BigNumber('18'))).toString())
  console.log(params.amount, amount.toString())
  if (amount.eq(new web3.utils.BN('0'))) {
    throw new Error('Amount must be greater than zero')
  }

  if (!web3.utils.isAddress(recipientAddress)) {
    throw new Error('Invalid recipient address')
  }

  const factory = new web3.eth.Contract(PermafundFactoryArtifact.abi, PermafundFactoryArtifact.networks['1'].address)
  const dai = new web3.eth.Contract(IERC20.abi, DAI_ADDR)
  const permafund = await factory.methods.permafunds.call(recipientAddress)

  if (permafund === ZERO_ADDR) {
    throw new Error('Recipient does not have a Permafund')
  }

  const allowance = await dai.methods.allowance(web3.defaultAccount.address, permafund)
  if (allowance.lt(amount)) {
    try {
      await dai.methods.approve.send(permafund, amount)
    } catch (ex) {
      throw new Error('Transaction failed')
    }
  }

  try {
    const permafundContract = new web3.eth.Contract(Permafund.abi, permafund)
    await permafundContract.methods.deposit.send(amount)
  } catch (ex) {
    throw new Error('Transaction failed')
  }
}

export async function payInterest (context, recipientAddress) {
  const web3 = await tryCreateWeb3()
  if (!web3) {
    throw new Error('Failed to connect to wallet')
  }

  recipientAddress = recipientAddress.trim()
  if (!web3.utils.isAddress(recipientAddress)) {
    throw new Error('Invalid recipient address')
  }

  const factory = new web3.eth.Contract(PermafundFactoryArtifact.abi, PermafundFactoryArtifact.networks['1'].address)
  const rDai = new web3.eth.Contract(IRDai.abi, RDAI_ADDR)
  const permafund = await factory.methods.permafunds.call(recipientAddress)

  if (permafund === ZERO_ADDR) {
    throw new Error('Recipient does not have a Permafund')
  }

  try {
    await rDai.methods.payInterest.send(permafund)
  } catch (ex) {
    throw new Error('Transaction failed')
  }
}
