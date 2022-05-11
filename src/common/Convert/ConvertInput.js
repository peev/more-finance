import '../styles.css'
import '../../routes/vaults/vaults.css'

const ConvertInput = (props) => {
    const { symbol, bal, showMax, setValue, value } = props

    function onChange(e) {
        setValue(e.target.value)
    }

    function onBlur() {
        if (!value) {
            setValue('0')
        }
    }

    function onMaxPress() {
        setValue(bal)
    }

    return (
        <div className='Input-Container'>
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
                {!showMax && <div style={{ width: 80, backgroundColor: '#ffefd3' }} />}
                <div className="Max-Btn Input-Symbol">{symbol?.toUpperCase()}</div>
                <div style={{ width: 10, backgroundColor: '#ffefd3' }} />
                {showMax ? <div
                    onClick={onMaxPress}
                    className="Input-Btn">
                    {'MAX'}
                </div> : <div style={{ width: 10, backgroundColor: '#ffefd3', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />}
            </div>
        </div>
    )
}

export default ConvertInput;