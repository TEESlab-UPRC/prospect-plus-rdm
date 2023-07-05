import LogoImg from '@/../img/logos/LogoImg';
import Websites from '@/Constants/Websites';

const Logo = ({ logo, website, ...props }) => (
    <a {...props} href={website} target="_blank">
        <img {...props} src={logo}/>
    </a>
);

export const TEESlabLogo = ({ ...props }) => (<Logo {...props} logo={LogoImg.TEESlab} website={Websites.TEESlab}/>);
export const PROSPECTplusLogo = ({ ...props }) => (<Logo {...props} logo={LogoImg.PROSPECTplus} website={Websites.PROSPECTplus}/>);

export default Logo;
