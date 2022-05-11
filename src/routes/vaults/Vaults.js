import { useEffect } from 'react';
import { connect } from 'react-redux';
import './vaults.css';
import VaultCard from './VaultCard';
import { createPools, addCollateral, borrowAUSD, repayAUSD, removeCollateral, getMaticBalance } from './Actions'
import OpenVaultCard from './OpenVaultCard';
import { updateError } from '../../common/Notification/Actions';
import NotConnectedCard from './NotConnectedCard';
import { CONNECTION } from '../../utils/Constants';
import WrongConnectionCard from './WrongConnectionCard';
import LoadingCard from './LoadingCard';

const Vaults = (props) => {
    const { connection, createPools, pools, addCollateral, borrowAUSD, repayAUSD, removeCollateral, address, loading, getMaticBalance } = props

    useEffect(() => {
        if (connection === CONNECTION.CONNECTED && address) {
            createPools()
            getMaticBalance()
        }
    }, [connection, address])

    const openPositions = []
    const otherVaults = []

    pools?.forEach((pool) => {
        console.log(pool)
        if (!pool) { }
        else if (pool.userCollateralShare > 0) openPositions.push(pool)
        else otherVaults.push(pool)
    })

    if (connection === CONNECTION.NOT_CONNECTED) {

        return (
            <div className="Vaults">
                <NotConnectedCard />
            </div>
        )
    }

    if (connection === CONNECTION.WRONG_NETWORK) {
        return (
            <div className="Vaults">
                <WrongConnectionCard />
            </div>
        )
    }

    if(connection === CONNECTION.CONNECTED && loading){
        return (
            <div className="Vaults">
                <LoadingCard />
            </div>
        )
    }

    return (
        <div className="Vaults">
            {openPositions?.length > 0 && <div>
                {'YOUR OPEN POSITIONS'}
                {openPositions?.map((vault) => {
                    return <OpenVaultCard
                        key={vault.name}
                        {...vault}
                        addCollateral={addCollateral}
                        borrowAUSD={borrowAUSD}
                        repayAUSD={repayAUSD}
                        removeCollateral={removeCollateral}
                    />
                })}
            </div>}
            {openPositions?.length > 0 && otherVaults?.length > 0 && <div style={{ height: 20 }} />}
            {otherVaults?.length > 0 && <div>
                {openPositions?.length > 0 ? 'OTHER VAULTS' : 'VAULTS'}
                {otherVaults?.map((vault) => {
                    return <VaultCard
                        key={vault.name}
                        {...vault}
                        addCollateral={addCollateral}
                    />
                })}
            </div>}
        </div>
    );
}

const mapStateToProps = ({ vaults, session }) => {
    return {
        pools: vaults.pools || [],
        connection: session.connection,
        address: session.address,
        loading: vaults.loading
    }
}

export default connect(mapStateToProps, {
    createPools, addCollateral, updateError,
    borrowAUSD, repayAUSD, removeCollateral,
    getMaticBalance
})(Vaults);
