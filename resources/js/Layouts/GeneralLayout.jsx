import MenuBar from '@/Components/MenuBar';
import { Head } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';

const altLayoutRoutes = ['welcome', 'login', 'register'];

export default function Layout({ className, title, auth, children }) {
    const isAltLayout = altLayoutRoutes.includes(route().current());

    return (    // TODO: add footer
        <>
            <Head title={title}/>
            {isAltLayout ? (
                <div className="absolute top-0 right-0 z-10 block w-40 px-4 py-2 text-lg text-center bg-slate-300">
                    Powered by<br />TEESlab{/* TODO: replace placeholder */}
                </div>
            ) : (
                <MenuBar user={auth.user}/>
            )}
            <div className="pp-outer-container">
                <div className={`pp-inner-container ${className}`}>
                    {children}
                </div>
            </div>
            <ToastContainer autoClose={6000} className="toastify-customizations"/>
        </>
    );
}
