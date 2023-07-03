import Menu from '@/Components/Menu';

const MenuBar = ({ user }) => {
    return (
        <div id="menubar">
            <p>TEESlab</p>
            <div>
                <a>Guidelines</a>
                <Menu user={user} />
            </div>
        </div>
    );
};

export default MenuBar;
