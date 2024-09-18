import Dropdown from '@/Components/Dropdown';
import MiscImg from '@/../img/misc/MiscImg';
import { htmlInfo } from '@/Helpers/DialogHelpers';
import { analyticsEvent } from '@/Helpers/AnalyticsHelpers';
import { GuidelinesLink, RepoLink } from './ExtLink';
import useTransHelper from '@/Helpers/TransHelpers';

const Menu = ({ user }) => {
    const { t } = useTransHelper();
    const Link = ({ dest = null, text, onClick, ...props }) => (<Dropdown.Link {...props} href={dest ? route(dest) : null} onClick={onClick}>{text}</Dropdown.Link>);
    const PLink = ({ dest = null, text, onClick, ...props }) => (<Link {...props} dest={dest} text={text} method="post" as="button" onClick={onClick}/>);

    const showHelp = e => {
        e.preventDefault();                                                             // abort link navigation
        e.target.parentElement.dispatchEvent(new MouseEvent("click", {bubbles: true})); // close menu
        analyticsEvent("view_help", true);
        htmlInfo(t("Help & Support"), t(`
            <div class="flex flex-col gap-2 my-1">
                <span><b>Need help using the app?</b> Check out the :GuidelinesLink!</span>
                <span><b>Need further support or to contact us?</b> Email us: rdmtool.teeslab [at] unipi.gr</span>
                <span><b>Want to look at the app's code?</b> Check out our :RepoLink!</span>
            </div>
        `, {
            GuidelinesLink: (<GuidelinesLink text={t("User Guide")}/>),
            RepoLink: (<RepoLink text={t("repository")} />)
        }), null, t, "45rem");
    };

    return (
        <div className="menubar-menu">
            <Dropdown>
                <Dropdown.Trigger>
                    <button type="button" className="menubar-menu-trigger">
                        <span>{user ? user.name : t("Menu")}</span>
                        <img src={MiscImg.MenuArrow}/>
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content>
                    <Link dest="home.render" text={t("Home")}/>
                    {user && (<Link dest="analyses.render" text={t("My Analyses")}/>)}
                    <Link onClick={showHelp} text={t("Help & Support")} as="button"/>
                    <Link dest="privacy-policy.render" text={t("Privacy Policy")} />
                    {user && (<Link dest="profile.render" text={t("Edit Profile")}/>)}
                    {user ? (<PLink dest="logout" text={t("Log Out")} onClick={() => analyticsEvent("logout")}/>) : (<Link dest="login" text={t("Log In")}/>)}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

export default Menu;
