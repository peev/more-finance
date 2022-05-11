import '../routes/landing/landing.css'
import { Link } from 'react-router-dom';


 
const LandingHeader = () => {
    return (
        <header className="header">
            <div className="shell">
                <span className="logo">
                    <img src="logo@2x.png" alt="More Finance Logo" />
                </span>

                <Link className="btn" to={'/home'}>
                {'LAUNCH APP'}
                </Link>
            </div>
        </header>
    )
}

export default LandingHeader;