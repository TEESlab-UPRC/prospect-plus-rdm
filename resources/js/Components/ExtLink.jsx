import Websites from '@/Constants/Websites';

const ExtLink = ({ dest = null, className = "", text = null, ...props }) => (
    <a {...props} href={dest} target="_blank" className={`pp-link ${className}`}>
        {text ?? children}
    </a>
);

const ExtLinkWDef = ({ defText, text = null, ...props }) => (<ExtLink {...props} text={text ?? defText}/>);

export const GuidelinesLink = ({ ...props }) => (<ExtLinkWDef {...props} defText="Guidelines" dest={Websites.Guidelines}/>);
export const PrivacyPolicyLink = ({ ...props }) => (<ExtLinkWDef {...props} defText="Privacy Policy" dest={Websites.PrivacyPolicy}/>);

export default ExtLink;
