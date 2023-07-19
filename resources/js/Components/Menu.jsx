import Dropdown from '@/Components/Dropdown';
import MiscImg from '@/../img/misc/MiscImg';
import { htmlInfo } from '@/Helpers/DialogHelpers';
import Websites from '@/Constants/Websites';

const showHelp = e => {
    e.preventDefault();                                                             // abort link navigation
    e.target.parentElement.dispatchEvent(new MouseEvent("click", {bubbles: true})); // close menu
    htmlInfo("Help & Support", `
        <div class="flex flex-col gap-2 my-1">
            <span><b>Need help using the app?</b> Check out the <a ${Websites.Guidelines ? `href="${Websites.Guidelines}"` : ""} target="_blank" class="pp-link">User Guide</a>!</span>
            <span><b>Need further support or to contact us?</b> Email us: rdmtool.teeslab [at] unipi.gr</span>
        </div>
    `, null, "45rem");
};

const Menu = ({ user }) => {
    const Link = ({ dest = null, text, onClick, ...props }) => (<Dropdown.Link {...props} href={dest ? route(dest) : null} onClick={onClick}>{text}</Dropdown.Link>);
    const PLink = ({ dest, text }) => (<Link dest={dest} text={text} method="post" as="button"/>);

    return (
        <div className="menubar-menu">
            <Dropdown>
                <Dropdown.Trigger>
                    <button type="button" className="menubar-menu-trigger">
                        <span>{user ? user.name : "Menu"}</span>
                        <img src={MiscImg.MenuArrow}/>
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content>
                    <Link dest="home.render" text="Home"/>
                    {user && (<Link dest="analyses.render" text="My Analyses"/>)}
                    <Link onClick={showHelp} text="Help & Support" as="button"/>
                    {user && (<Link dest="profile.render" text="Edit Profile"/>)}
                    {user ? (<PLink dest="logout" text="Log Out"/>) : (<Link dest="login" text="Log In"/>)}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

export default Menu;
