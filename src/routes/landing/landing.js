import './landing.css';

import logo from '../../assets/logo.svg'
import mcsc from '../../assets/mcsc.svg'
import circle1 from '../../assets/circle1.svg'
import circle2 from '../../assets/circle2.svg'
import circle3 from '../../assets/circle3.svg'
import circle4 from '../../assets/circle4.svg'
import dfyn from '../../assets/dfyn.svg'
import polygon from '../../assets/polygon.svg'
import router from '../../assets/router.svg'
import star from '../../assets/star.svg'
import arrow from '../../assets/arrow-down.svg'
import arrowDown from '../../assets/arrow-landing.svg'
import { Link } from 'react-router-dom';


const LearnBtn = () => {
    return (
        <div
            className="Learn-Btn">
            {'LEARN MORE'}
        </div>
    )
}

const OpenVaultBtn = () => {
    return (
        <Link to={'/home'}>
            <div
                className="OpenVault-Btn">
                {'OPEN VAULT'}
            </div>
        </Link>
    )
}

const Landing = () => {
    return (
        <div className="Landing">
           <section className="section-landing" style={{ backgroundImage: `url(/images/More-Finance.jpg)` }}>
                    <div className="shell">
                        <div className="section-content">
                            <h1 className="section-title">
                                LOANS THAT PAY THEMSELVES
                            </h1>

                            <h5 className="section-subtitle">
                                EARN YIELD AND ENJOY LIQUIDITY ALL TOGETHER
                            </h5>

                            <p>
                                More Finance is an open-source project for implementing a lending platform that uses interest- bearing tokens like tToken (tesseract vault token), mooTokens (beefy finance vault tokens) or crvLP (Curve LP tokens) as collateral to borrow a USD pegged stablecoin, that can be used as any other traditional stablecoin.
                            </p>

                            <ul className="socials">
                                <li>
                                    <a href="https://more-finance.gitbook.io/more-finance/"   >
                                        <i className="img-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="34.621" height="25" viewBox="0 0 34.621 25">
                                                <g transform="translate(0.013 -8.875)">
                                                    <path d="M15.57,29.711a1.028,1.028,0,1,1-1.028,1.028,1.027,1.027,0,0,1,1.028-1.028m15.9-6.274A1.028,1.028,0,1,1,32.5,22.409a1.064,1.064,0,0,1-1.028,1.028m0-4.164a3.139,3.139,0,0,0-3.137,3.137,3.063,3.063,0,0,0,.162.974L18.166,28.9a3.134,3.134,0,0,0-2.6-1.352,3.219,3.219,0,0,0-2.812,1.731l-9.3-4.868a4.03,4.03,0,0,1-1.623-3.624,1.958,1.958,0,0,1,.7-1.568.942.942,0,0,1,.919.054l.054.054C6,20.625,14.056,24.843,14.38,25.005a1.678,1.678,0,0,0,1.731-.108l16.658-8.653a.762.762,0,0,0,.541-.7.837.837,0,0,0-.487-.7c-.973-.433-2.434-1.136-3.84-1.785-3.029-1.406-6.49-3.029-8-3.84a2.545,2.545,0,0,0-2.542,0l-.379.162c-6.869,3.461-15.955,7.95-16.5,8.275A3.625,3.625,0,0,0-.006,20.733c-.108,2.217,1.028,4.543,2.65,5.354l9.843,5.084a3.184,3.184,0,0,0,3.083,2.7,3.128,3.128,0,0,0,3.137-3.083l10.817-5.841a3.164,3.164,0,1,0,1.947-5.679" transform="translate(0 0)" fill="#fff" />
                                                </g>
                                            </svg>

                                        </i>
                                    </a>
                                </li>

                                <li>
                                    <a href="https://github.com/More-Finance-DeFi"   >
                                        <i className="img-icon">
                                                 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" style={{"position":"relative", "top":"-5px"}} height="32" x="0px" y="0px" viewBox="0 0 1000 1000"> <g><path fill="#fff" d="M500,25.1c-270.6,0-490,218-490,487c0,215.1,140.4,397.7,335.1,462c24.5,4.5,33.4-10.5,33.4-23.4c0-11.5-0.4-42.1-0.6-82.8c-136.3,29.5-165.1-65.3-165.1-65.3c-22.3-56.2-54.4-71.2-54.4-71.2c-44.5-30.2,3.4-29.6,3.4-29.6c49.2,3.5,75.1,50.2,75.1,50.2c43.7,74.4,114.7,52.9,142.6,40.5c4.4-31.5,17.1-52.9,31.1-65.1c-108.8-12.3-223.2-54.1-223.2-240.6c0-53.2,19.1-96.7,50.4-130.7c-5-12.3-21.9-61.8,4.8-128.8c0,0,41.1-13.1,134.8,50c39.1-10.8,81-16.3,122.7-16.4c41.6,0.2,83.6,5.6,122.7,16.4c93.6-63,134.6-50,134.6-50c26.7,67.1,9.9,116.6,4.9,128.8c31.4,34,50.4,77.5,50.4,130.7c0,187-114.5,228.2-223.7,240.2c17.6,15,33.2,44.8,33.2,90.3c0,65.1-0.6,117.6-0.6,133.5c0,13,8.8,28.2,33.7,23.4C849.7,909.5,990,727.1,990,512C990,243.1,770.6,25.1,500,25.1z" /></g> </svg>

                                        </i>
                                    </a>
                                </li>

                                <li>
                                    <a href="#"  >
                                        <i className="img-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30.781" height="25" viewBox="0 0 30.781 25">
                                                <path d="M27.617,54.312c.02.273.02.547.02.82,0,8.34-6.348,17.949-17.949,17.949A17.828,17.828,0,0,1,0,70.25a13.051,13.051,0,0,0,1.523.078,12.634,12.634,0,0,0,7.832-2.7,6.32,6.32,0,0,1-5.9-4.375,7.956,7.956,0,0,0,1.191.1,6.672,6.672,0,0,0,1.66-.215A6.309,6.309,0,0,1,1.25,56.949v-.078a6.353,6.353,0,0,0,2.852.8,6.318,6.318,0,0,1-1.953-8.438,17.932,17.932,0,0,0,13.008,6.6A7.122,7.122,0,0,1,15,54.391a6.315,6.315,0,0,1,10.918-4.316,12.42,12.42,0,0,0,4-1.523,6.292,6.292,0,0,1-2.773,3.477,12.647,12.647,0,0,0,3.633-.977A13.561,13.561,0,0,1,27.617,54.312Z" transform="translate(0 -48.082)" fill="#fff" />
                                            </svg>

                                        </i>
                                    </a>
                                </li>

                                <li>
                                    <a href="#"  >
                                        <i className="img-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32.812" height="25" viewBox="0 0 32.812 25">
                                                <path d="M53.82,34.111a.084.084,0,0,0-.043-.039A27.068,27.068,0,0,0,47.1,32a.1.1,0,0,0-.107.051,18.829,18.829,0,0,0-.831,1.708,24.992,24.992,0,0,0-7.5,0,17.274,17.274,0,0,0-.845-1.708A.105.105,0,0,0,37.706,32a26.992,26.992,0,0,0-6.679,2.071.1.1,0,0,0-.044.038,27.673,27.673,0,0,0-4.848,18.669.113.113,0,0,0,.043.077,27.214,27.214,0,0,0,8.193,4.14.106.106,0,0,0,.115-.038,19.431,19.431,0,0,0,1.676-2.726.1.1,0,0,0-.057-.144,17.924,17.924,0,0,1-2.56-1.219.105.105,0,0,1-.01-.174c.172-.129.344-.263.508-.4a.1.1,0,0,1,.106-.014,19.411,19.411,0,0,0,16.49,0,.1.1,0,0,1,.107.013c.164.135.336.271.51.4a.105.105,0,0,1-.009.174,16.82,16.82,0,0,1-2.561,1.218.1.1,0,0,0-.056.146,21.823,21.823,0,0,0,1.675,2.724.1.1,0,0,0,.115.039,27.123,27.123,0,0,0,8.207-4.14.1.1,0,0,0,.043-.075A27.49,27.49,0,0,0,53.82,34.111ZM36.965,49.052a3.327,3.327,0,0,1,0-6.612,3.327,3.327,0,0,1,0,6.612Zm10.9,0a3.327,3.327,0,0,1,0-6.612,3.327,3.327,0,0,1,0,6.612Z" transform="translate(-26 -31.999)" fill="#fff" />
                                            </svg>

                                        </i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
        </div>
    );
}

export default Landing;