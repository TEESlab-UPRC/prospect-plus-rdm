import Menu from '@/Components/Menu';
import { TEESlabLogo, PROSPECTplusLogo } from '@/Components/Logo';
import { GuidelinesLink } from './ExtLink';

const MenuBar = ({ user }) => {
    return (
        <div id="menubar">
            <div className="menubar-logos">
                <TEESlabLogo />
                <PROSPECTplusLogo />
            </div>
            <div>
                <GuidelinesLink />
                <Menu user={user}/>
            </div>
        </div>
    );
};

export default MenuBar;
