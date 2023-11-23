import { Text } from 'recharts';
import Websites from '@/Constants/Websites';
import { analyticsLinkClick } from '@/Helpers/AnalyticsHelpers';
import { getCSSVar } from '@/Helpers/RenderHelpers';

const ExtLink = ({ dest = null, className = "", text = null, noAnalytics = false, noStyle = false, forceNewTab = false, children, ...props }) => (
    <a {...props} href={dest} className={`${noStyle ? "" : "pp-link"} ${className}`} onClick={
        () => noAnalytics || analyticsLinkClick(dest, text)
    } target={`_${(!forceNewTab && dest && dest.startsWith("/")) ? "self" : "blank"}`}>
        {text ?? children}
    </a>
);

const ExtLinkWDef = ({ defText, text = null, ...props }) => (<ExtLink {...props} text={text ?? defText}/>);

export const SVGCompatExtLink = ({ style = {}, text = null, chartCompat = false, verticalanchor = "middle", children, ...props }) => (
    <ExtLink {...props} dominantBaseline="auto" noStyle={true} style={{ ...style, fill: getCSSVar("pp-cyan") }}>
        {chartCompat ? (
            <Text {...props} verticalAnchor={verticalanchor} style={{ ...style, fill: "inherit" /* always inherit <a>'s fill, which changes on download */ }}>
                {text ?? children}
            </Text>
        ) : (text ?? children)}
    </ExtLink>
);

export const RepoLink = props => (<ExtLinkWDef {...props} defText="repository" dest={Websites.Repo}/>);
export const GuidelinesLink = props => (<ExtLinkWDef {...props} defText="Guidelines" dest={Websites.Guidelines} forceNewTab={true}/>);
export const PROSPECTplusLink = props => (<ExtLinkWDef {...props} defText="PROSPECT+" dest={Websites.PROSPECTplus}/>);
export const PPLearningHandbooksLink = props => (<SVGCompatExtLink {...props} dest={Websites.PPLearningHandbooks}/>);
export const PPLearningProgrammeLink = props => (<ExtLinkWDef {...props} defText="CBP" dest={Websites.PPLearningProgramme}/>);
export const GAOptOutAddonLink = props => (<ExtLinkWDef {...props} defText="Google Analytics Opt-out Browser Add-on" dest={Websites.GAOptOutAddon} noAnalytics={true}/>);

export default ExtLink;
