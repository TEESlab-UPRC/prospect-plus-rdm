import Menu from '@/Components/Menu';
import LogoImg from '@/../img/logos/LogoImg';

const MenuBar = ({ user }) => {
    return (
        <div id="menubar">
            <div class="menubar-logos">
                <img src={LogoImg.TEESlab}/>
                <img src={LogoImg.PROSPECTplus}/>
            </div>
            <div>
                <a className="pp-link" target="_blank">Guidelines</a>{/* TODO: put a link here, same as in Home */}
                <Menu user={user} />
            </div>
        </div>
    );
};

export default MenuBar;
