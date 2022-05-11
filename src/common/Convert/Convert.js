import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getMaticBalance, wrapMatic, unWrapMatic } from '../../routes/vaults/Actions'
import cross from '../../assets/cross.svg'
import reverse from '../../assets/reverse.svg'
import './convert.css'
import ConvertInput from './ConvertInput'
import { toFixed } from '../../utils/helper'
import { updateConvertLoader, updateMaticBalance } from './Actions'

class Convert extends PureComponent {

    constructor(props) {
        super(props)
        this.state = { show: false, isMaticToWmatic: true, value: 0, subtitle: '' }
    }

    showModal = (subtitle) => {
        const { getMaticBalance } = this.props
        getMaticBalance()
        this.setState({ show: true, subtitle })
    }

    closeModal = () => {
        this.setState({ show: false, matic: 0, wmatic: 0, subtitle: '' })
    }

    onReverseClick = () => {
        this.setState({ isMaticToWmatic: !this.state.isMaticToWmatic })
    }

    onConvertClick = () => {
        const { wrapMatic, unWrapMatic } = this.props
        const { isMaticToWmatic, value } = this.state
        if (isMaticToWmatic) {
            wrapMatic(value)
        } else {
            unWrapMatic(value)
        }
    }

    setValue = (value) => {
        this.setState({ value })
    }

    render() {
        const { show, isMaticToWmatic, value, subtitle } = this.state
        const { matic, wmatic, loading } = this.props

        if (!show) return null

        const heading = isMaticToWmatic ? 'Convert MATIC to WMATIC' : 'Convert WMATIC to MATIC'

        return (
            <div onClick={this.closeModal} className='Convert-Container'>
                <div className='Convert-Overlay' />
                <div onClick={(e) => e.stopPropagation()} className='Convert'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className='Convert-Heading'>{heading}</div>
                            {!!subtitle && <div className='Convert-Sub'>{subtitle}</div>}
                        </div>
                        <div onClick={this.closeModal} style={{ display: 'flex', marginLeft: 20, alignItems: 'center' }}>
                            <img src={cross} alt={'cross'} style={{ height: 16, width: 16 }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 40 }}>
                        <div style={{ flexDirection: isMaticToWmatic ? 'column' : 'column-reverse', display: 'flex' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='Convert-Text'>{`You ${isMaticToWmatic ? 'Pay' : 'Receive'}`}</div>
                                    <div className='Convert-Text'>{`Bal: ${matic} MATIC`}</div>
                                </div>
                                <ConvertInput
                                    value={value}
                                    setValue={this.setValue}
                                    bal={matic}
                                    symbol={'MATIC'}
                                    showMax={isMaticToWmatic}
                                />
                            </div>
                            <div
                                onClick={this.onReverseClick}
                                style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 8 }}>
                                <img src={reverse} alt={'reverse'} className='Reverse-Img' />
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='Convert-Text'>{`You ${isMaticToWmatic ? 'Receive' : 'Pay'}`}</div>
                                    <div className='Convert-Text'>{`Bal: ${wmatic} WMATIC`}</div>
                                </div>
                                <ConvertInput
                                    value={value}
                                    setValue={this.setValue}
                                    bal={wmatic}
                                    symbol={'WMATIC'}
                                    showMax={!isMaticToWmatic}
                                />
                            </div>
                        </div>
                        <div style={{ height: 40 }} />
                        <div
                            style={value > 0 ? {} : { opacity: 0.5, pointerEvents: 'none' }}
                            onClick={loading ? null : this.onConvertClick}
                            className="Convert-Btn">
                            {loading ? 'In Progress' : 'Convert'}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ convert }) => {
    return {
        matic: toFixed(convert.matic, 3),
        wmatic: toFixed(convert.wmatic, 3),
        loading: convert.loading
    }
}

export default connect(mapStateToProps, {
    getMaticBalance, wrapMatic, unWrapMatic, updateMaticBalance, updateConvertLoader
}, null, { forwardRef: true })(Convert)