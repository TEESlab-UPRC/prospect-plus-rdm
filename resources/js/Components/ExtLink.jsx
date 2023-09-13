import Websites from '@/Constants/Websites';
import { analyticsLinkClick } from '@/Helpers/AnalyticsHelpers';

const ExtLink = ({ dest = null, className = "", text = null, noAnalytics = false, noStyle = false, forceNewTab = false, ...props }) => (
    <a {...props} href={dest} className={`${noStyle ? "" : "pp-link"} ${className}`} onClick={
        () => noAnalytics || analyticsLinkClick(dest, text)
    } target={`_${(!forceNewTab && dest && dest.startsWith("/")) ? "self" : "blank"}`}>
        {text ?? children}
    </a>
);

const ExtLinkWDef = ({ defText, text = null, ...props }) => {
    return (<ExtLink {...props} text={text ?? defText}/>);
}

export const RepoLink = props => (<ExtLinkWDef {...props} defText="repository" dest={Websites.Repo}/>);
export const GuidelinesLink = props => (<ExtLinkWDef {...props} defText="Guidelines" dest={Websites.Guidelines} forceNewTab={true}/>);
export const PROSPECTplusLink = props => (<ExtLinkWDef {...props} defText="PROSPECT+" dest={Websites.PROSPECTplus}/>);
export const PPLearningHandbooksLink = props => (<ExtLinkWDef {...props} defText="Learning Handbooks" dest={Websites.PPLearningHandbooks}/>);
export const PPLearningProgrammeLink = props => (<ExtLinkWDef {...props} defText="CBP" dest={Websites.PPLearningProgramme}/>);
export const GAOptOutAddonLink = props => (<ExtLinkWDef {...props} defText="Google Analytics Opt-out Browser Add-on" dest={Websites.GAOptOutAddon} noAnalytics={true}/>);

export default ExtLink;
