import { useState } from 'react'
import { connect } from 'react-redux'
import { toFixed } from '../utils/helper'
import './styles.css'
import '../routes/vaults/vaults.css'

const Input = (props) => {
    const { btnTitle, onBtnPress, symbol, ofType, loading, id, userBorrowPart, borrowLeftParsed, balance, tokenPrice, maxWithdraw } = props
    const [value, setValue] = useState('0')

    function onChange(e) {
        setValue(e.target.value)
    }

    function onBlur() {
        if (!value) {
            setValue('0')
        }
    }

    function onMaxPress() {
        if (id === 1) {
            const number = toFixed(balance, 2)
            setValue(number)
        }
        if (id === 2) {
            const number = toFixed(userBorrowPart, 2)
            setValue(number)
        }
        if (id === 3) {
            const number = toFixed(borrowLeftParsed, 2)
            setValue(number)
        }
        if (id === 4) {
            const number = toFixed(maxWithdraw, 2)
            setValue(number)
        }
    }

    const isLoading = loading === `${ofType}-${btnTitle}`

    return (
        <div
            style={loading && !isLoading ? { pointerEvents: 'none', opacity: '0.6' } : {}}
            className='Input-Container'
        >
            <div style={{ marginLeft: 8, height: 8, marginTop: 0, marginBottom: 6 }} className='Vault-Sub'>
                {id === 1 ? `BAL: ${toFixed(balance || 0, 3)} ${symbol}` : ''}
                {id === 4 ? `YOU CAN WITHDRAW ~${toFixed(maxWithdraw || 0, 3)} ${symbol}` : ''}
            </div>
            <div
                style={{ display: 'flex', flexDirection: 'row' }}>
                <input
                    className="Input"
                    type="number"
                    name=""
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                />
                <div className="Max-Btn Input-Symbol">{symbol?.toUpperCase()}</div>
                <div
                    onClick={onMaxPress}
                    className="Max-Btn">
                    {'MAX'}
                </div>
                <div
                    onClick={isLoading ? null : onBtnPress?.bind(null, value, `${ofType}-${btnTitle}`)}
                    className="Input-Btn">
                    {isLoading ? 'In Progress' : btnTitle}
                </div>
            </div>
            <div style={{ marginLeft: 8, height: 8, marginTop: 6 }} className='Vault-Sub'>
                {id === 3 ? `BORROW FEE = $${toFixed(value * 0.003, 2)}` : ''}
                {id === 1 ? `YOU WILL RECEIVE ~${toFixed((value/tokenPrice), 3)} AUSD` : ''}
            </div>

        </div>
    )
}

const mapStateToProps = ({ loader }) => {
    return {
        loading: loader.loading
    }
}

export default connect(mapStateToProps)(Input);