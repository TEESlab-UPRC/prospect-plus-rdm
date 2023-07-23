import { Link } from '@inertiajs/react';

const IntLink = ({ dest = null, className = "", text = null, ...props }) => (
    <Link {...props} href={route(dest)} className={`pp-link ${className}`}>
        {text ?? children}
    </Link>
);

const IntLinkWDef = ({ defText, text = null, ...props }) => (<IntLink {...props} text={text ?? defText}/>);

export const PrivacyPolicyLink = props => (<IntLinkWDef {...props} defText="Privacy Policy" dest="privacy-policy.render"/>);

export default IntLink;
