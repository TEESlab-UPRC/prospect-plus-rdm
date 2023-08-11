import Menu from '@/Components/Menu';
import { TEESlabLogo, PROSPECTplusLogo } from '@/Components/Logo';
import { GuidelinesLink } from './ExtLink';
import useTransHelper from '@/Helpers/TransHelpers';

const MenuBar = ({ user }) => {
    const { t } = useTransHelper();

    return (
        <div id="menubar">
            <div className="menubar-logos">
                <TEESlabLogo />
                <PROSPECTplusLogo />
            </div>
            <div>
                <GuidelinesLink text={t("Guidelines")}/>
                <Menu user={user}/>
            </div>
        </div>
    );
};

export default MenuBar;
