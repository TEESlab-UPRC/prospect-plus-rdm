import MenuBar from '@/Components/MenuBar';
import { Head } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import { TEESlabLogo } from '@/Components/Logo';
import Footer from '@/Components/Footer';
import MiscImg from '@/../img/misc/MiscImg';

const altLayoutRoutes = ['welcome', 'login', 'register'];

const PoweredBy = () => (
    <div className="powered-by-logo">
        <span>Powered by</span>
        <TEESlabLogo />
    </div>
);

export default function Layout({ title, auth, env, className = "", children }) {
    const isAltLayout = altLayoutRoutes.includes(route().current());

    return (
        <>
            <Head title={title}>
                <link rel="shortcut icon" href={MiscImg.Favicon} type="image/x-icon" />
            </Head>
            {isAltLayout ? (<PoweredBy />) : (<MenuBar user={auth.user}/>)}
            <div className="pp-outer-container">
                <div className="pp-middle-container">
                    <div className={`pp-inner-container ${className}`}>
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
            <ToastContainer autoClose={6000} className="toastify-customizations"/>
        </>
    );
}
