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
                <div className="menubar-links">
                    <GlossaryLink text={t("Glossary of financial terms")} className="hidden min-[842px]:block"/>
                    <GlossaryLink text={t("Glossary")} className="min-[842px]:hidden"/>
                    <GuidelinesLink text={t("Guidelines")}/>
                </div>
                <Menu user={user}/>
            </div>
        </div>
    );
};

export default MenuBar;
