import { connect } from 'react-redux'
import { updateError } from './Actions'
import '../styles.css'
import { useEffect } from 'react'

let timer = null

const Notification = (props) => {

    const { updateError, error } = props

    function clearError() {
        updateError(null)
    }

    useEffect(() => {
        if (error) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                updateError(null)
            }, 4000);
        }
    }, [error])

    return (
        <div className="Fixed-Container  Notification">
            {!!error &&
                <div>
                    <div
                        className="NotificationView"
                        onClick={clearError}
                    >
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                            {error?.toUpperCase()}
                        </div>
                        <div className="NotificationCrossContainer">
                            <div className="NotificationCross">
                                {'X'}
                            </div>
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}

const mapStateToProps = ({ notification }) => {
    return {
        error: notification.error
    }
}

export default connect(mapStateToProps, { updateError })(Notification)