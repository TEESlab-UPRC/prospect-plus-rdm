import Dropdown from '@/Components/Dropdown';
import MiscImg from '@/../img/misc/MiscImg';

const Menu = ({ user }) => {
    const Link = ({ dest, text, ...props }) => (<Dropdown.Link {...props} href={route(dest)}>{text}</Dropdown.Link>);
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
                    <Link dest="home.render" text="Help & Support"/>{/* TODO: add page for this placeholder */}
                    {user && (<Link dest="profile.render" text="Edit Profile"/>)}
                    {user ? (<PLink dest="logout" text="Log Out"/>) : (<Link dest="login" text="Log In"/>)}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

export default Menu;
