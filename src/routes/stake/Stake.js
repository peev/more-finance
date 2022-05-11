import './stake.css';
import { lpsInfo, arthaInfo } from './data'
import StakeCard from './StakeCard';
import FarmLpsCard from './FarmLpsCard';

const Stake = () => {
    return (
        <div className="Stake">
            <div>
                {'STAKE'}
                <StakeCard
                    key={arthaInfo.name}
                    {...arthaInfo}
                />
            </div>
            <div style={{ height: 20 }} />
            <div>
                {'FARM LPS'}
                {lpsInfo?.length && lpsInfo.map((lps) => <FarmLpsCard
                    key={lps.name}
                    subtitle={lps.exchange}
                    {...lps}
                />)}
            </div>
        </div>
    );
}

export default Stake;
