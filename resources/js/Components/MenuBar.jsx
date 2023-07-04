import Menu from '@/Components/Menu';

const MenuBar = ({ user }) => {
    return (
        <div id="menubar">
            <p>TEESlab</p>
            <div>
                <a className="pp-link" target="_blank">Guidelines</a>{/* TODO: put a link here, same as in Home */}
                <Menu user={user} />
            </div>
        </div>
    );
};

export default MenuBar;
