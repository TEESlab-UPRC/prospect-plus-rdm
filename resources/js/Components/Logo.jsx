import LogoImg from '@/../img/logos/LogoImg';
import Websites from '@/Constants/Websites';

const CLogoImgs = LogoImg.Consortium;
const CWebsites = Websites.Consortium;

const Logo = ({ logo, website, ...props }) => (
    <a {...props} href={website} target="_blank">
        <img {...props} src={logo}/>
    </a>
);

export const TEESlabLogo =      props => (<Logo {...props} logo={LogoImg.TEESlab}      website={Websites.TEESlab}/>);
export const PROSPECTplusLogo = props => (<Logo {...props} logo={LogoImg.PROSPECTplus} website={Websites.PROSPECTplus}/>);

export const ConsortiumLogo = {
    IEECPLogo:       props => (<Logo {...props} logo={CLogoImgs.IEECP}       website={CWebsites.IEECP}/>),
    FEDARENELogo:    props => (<Logo {...props} logo={CLogoImgs.FEDARENE}    website={CWebsites.FEDARENE}/>),
    InnolidLogo:     props => (<Logo {...props} logo={CLogoImgs.Innolid}     website={CWebsites.Innolid}/>),
    EuroCitiesLogo:  props => (<Logo {...props} logo={CLogoImgs.EuroCities}  website={CWebsites.EuroCities}/>),
    ENCLogo:         props => (<Logo {...props} logo={CLogoImgs.ENC}         website={CWebsites.ENC}/>),
    TEESlabUPRCLogo: props => (<Logo {...props} logo={CLogoImgs.TEESlabUPRC} website={CWebsites.TEESlabUPRC}/>),
    ESVLogo:         props => (<Logo {...props} logo={CLogoImgs.ESV}         website={CWebsites.ESV}/>),
    ENERGAPLogo:     props => (<Logo {...props} logo={CLogoImgs.ENERGAP}     website={CWebsites.ENERGAP}/>),
    TEALogo:         props => (<Logo {...props} logo={CLogoImgs.TEA}         website={CWebsites.TEA}/>),
    SEMMOLogo:       props => (<Logo {...props} logo={CLogoImgs.SEMMO}       website={CWebsites.SEMMO}/>),
    adelphiLogo:     props => (<Logo {...props} logo={CLogoImgs.adelphi}     website={CWebsites.adelphi}/>),
};

export const ConsortiumLogos = ({ className, ...props }) => (
    <div {...props} className={`consortium-logos ${className}`}>
        <ConsortiumLogo.IEECPLogo />
        <ConsortiumLogo.FEDARENELogo />
        <ConsortiumLogo.InnolidLogo />
        <ConsortiumLogo.EuroCitiesLogo />
        <ConsortiumLogo.ENCLogo />
        <ConsortiumLogo.TEESlabUPRCLogo />
        <ConsortiumLogo.ESVLogo />
        <ConsortiumLogo.ENERGAPLogo />
        <ConsortiumLogo.TEALogo />
        <ConsortiumLogo.SEMMOLogo />
        <ConsortiumLogo.adelphiLogo />
    </div>
);

export default Logo;
