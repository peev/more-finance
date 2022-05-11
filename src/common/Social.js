import './styles.css'
import discord from '../assets/discord.svg'
import gitbook from '../assets/gitbook.svg'
import medium from '../assets/medium.svg'
import twitter from '../assets/twitter.svg'
import { openUrlInTab } from '../utils/helper'

const discordUrl = 'https://discord.com/invite/UMeXcc54JJ'
const gitbookUrl = 'https://docs.artha.finance/'
const mediumUrl = 'https://arthafinance.medium.com/'
const twitterUrl = 'https://twitter.com/arthaprotocol'


const Social = () => {
    return (
        <div className="Social">
            <img
                onClick={() => openUrlInTab(gitbookUrl)}
                src={gitbook}
                alt={'gitbook'}
                className="Social-Img"
            />
            <img
                onClick={() => openUrlInTab(twitterUrl)}
                src={twitter}
                alt={'twitter'}
                className="Social-Img"
            />
            <img
                onClick={() => openUrlInTab(mediumUrl)}
                src={medium}
                alt={'medium'}
                className="Social-Img"
            />
            <img
                onClick={() => openUrlInTab(discordUrl)}
                src={discord}
                alt={'discord'}
                className="Social-Img"
            />
        </div>
    )
}

export default Social;