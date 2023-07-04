import Menu from '@/Components/Menu';
import { TEESlab, PROSPECTplus } from '@/Components/Logo';

const MenuBar = ({ user }) => {
    return (
        <div id="menubar">
            <div class="menubar-logos">
                <TEESlab />
                <PROSPECTplus />
            </div>
            <div>
                <a className="pp-link" target="_blank">Guidelines</a>{/* TODO: put a link here, same as in Home */}
                <Menu user={user} />
            </div>
        </div>
    );
};

export default MenuBar;
