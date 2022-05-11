import { ethers } from "ethers";
import poly from '../assets/poly.svg'
import artha from '../assets/arthaLogo.svg'
import ma from '../assets/ma.svg'
import aa from '../assets/aa.svg'
import ba from '../assets/ba.svg'
import ea from '../assets/ea.svg'
import btc from '../assets/btc.svg'
import eth from '../assets/eth.svg'
import dfyn from '../assets/dfynlogo.svg'
import usdc from '../assets/usdc.svg'

export function decimalToBig(number, decimals) {
    return ethers.utils.parseUnits(number, decimals)
}

export function bigToDecimal(bigNumber, decimals) {
    return ethers.utils.formatUnits(bigNumber, decimals)
}

export function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

export function getLogo(name) {
    if (name === 'POLYGON') {
        return poly
    }
    else if (name === 'ARTHA') {
        return artha
    }
    else if (name === 'MATIC-AUSD') {
        return ma
    }
    else if (name === 'WETH-AUSD') {
        return ea
    }
    else if (name === 'WBTC-AUSD') {
        return ba
    }
    else if (name === 'ARTHA-AUSD') {
        return aa
    }
    else if (name === 'BITCOIN') {
        return btc
    }
    else if (name === 'ETHEREUM') {
        return eth
    }
    else if (name === 'DFYN') {
        return dfyn
    }
    else if (name === 'USDC') {
        return usdc
    }
    return poly
}

export function openUrlInTab(url) {
    window.open(url, "_blank")
}