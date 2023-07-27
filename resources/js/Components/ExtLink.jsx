import Websites from '@/Constants/Websites';
import { analyticsLinkClick } from '@/Helpers/AnalyticsHelpers';

const ExtLink = ({ dest = null, className = "", text = null, noAnalytics = false, ...props }) => (
    <a {...props} href={dest} className={`pp-link ${className}`} onClick={
        () => noAnalytics || analyticsLinkClick(dest, text)
    } target={`_${(dest && dest.startsWith("/")) ? "self" : "blank"}`}>
        {text ?? children}
    </a>
);

const ExtLinkWDef = ({ defText, text = null, ...props }) => (<ExtLink {...props} text={text ?? defText}/>);

export const GuidelinesLink = props => (<ExtLinkWDef {...props} defText="Guidelines" dest={Websites.Guidelines}/>);
export const PROSPECTplusLink = props => (<ExtLinkWDef {...props} defText="PROSPECT+" dest={Websites.PROSPECTplus}/>);
export const PPLearningProgrammeLink = props => (<ExtLinkWDef {...props} defText="CBP" dest={Websites.PPLearningProgramme}/>);
export const GAOptOutAddonLink = props => (<ExtLinkWDef {...props} defText="Google Analytics Opt-out Browser Add-on" dest={Websites.GAOptOutAddon} noAnalytics={true}/>);

export default ExtLink;
