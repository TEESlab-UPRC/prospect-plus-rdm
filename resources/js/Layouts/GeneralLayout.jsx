import MenuBar from '@/Components/MenuBar';
import { Head } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import { TEESlab } from '@/Components/Logo';
import Footer from '@/Components/Footer';

const altLayoutRoutes = ['welcome', 'login', 'register'];

const PoweredBy = () => (
    <div className="powered-by-logo">
        <span>Powered by</span>
        <TEESlab />
    </div>
);

export default function Layout({ className, title, auth, children }) {
    const isAltLayout = altLayoutRoutes.includes(route().current());

    return (    // TODO: add footer
        <>
            <Head title={title}/>
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
