import Menu from '@/Components/Menu';
import { TEESlabLogo, PROSPECTplusLogo } from '@/Components/Logo';
import { GlossaryLink, GuidelinesLink } from './ExtLink';
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
                <GlossaryLink text={t("Glossary of financial terms")}/>
                <GuidelinesLink text={t("Guidelines")}/>
                <Menu user={user}/>
            </div>
        </div>
    );
};

export default MenuBar;
