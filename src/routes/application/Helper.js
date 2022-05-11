import Onboard from 'bnc-onboard'
import Notify from "bnc-notify"

const BLOCKNATIVE_APIKEY = 'd2743784-ee30-4761-9943-0842c983dd45'
const SUPPORTED_NETWORK_ID = 137

var notifyRef = Notify({
    dappId: BLOCKNATIVE_APIKEY,
    networkId: SUPPORTED_NETWORK_ID
});

export function notify(hash, onConfirmed) {
    const { emitter } = notifyRef.hash(hash)
    emitter.on('txConfirmed', onConfirmed)
}

export function initializeOnboard({ setAddress, setWallet, updateNetworkId, setOnboard }) {
    try {
        const onboard = Onboard({
            dappId: BLOCKNATIVE_APIKEY,
            networkId: SUPPORTED_NETWORK_ID,
            subscriptions: {
                address: setAddress,
                network: updateNetworkId,
                wallet: wallet => {
                    if (wallet?.provider) {
                        setWallet(wallet)
                        window.localStorage.setItem('selectedWallet', wallet.name)
                        console.log(`${wallet.name} is now connected`)
                    } else {
                        setWallet({})
                    }
                }
            }
        });
        setOnboard(onboard)
        return onboard
    } catch (e) {
        console.log(e)
        return null
    }
}

export function addListeners() {
    window.addEventListener("load", function () {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload()
            });
            // window.ethereum.on('networkChanged', function (networkId) {
            //     window.location.reload()
            // });
        } else {
            // ToDo: Add fall back option
        }
    });
}