import MenuBar from '@/Components/MenuBar';
import { Head } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import { TEESlabLogo } from '@/Components/Logo';
import Footer from '@/Components/Footer';
import MiscImg from '@/../img/misc/MiscImg';
import { useEffect } from 'react';
import { analyticsInitPage } from '@/Helpers/AnalyticsHelpers';
import useTransHelper from '@/Helpers/TransHelpers';
import LanguageIcon from '@mui/icons-material/Language';
import { select } from '@/Helpers/DialogHelpers';

const altLayoutRoutes = ['welcome', 'login', 'register'];
const langMap = {
    "pt-PT": "Portuguese",
    cs: "Czech",
    de: "German",
    el: "Greek",
    en: "English",
    es: "Spanish",
    fr: "French",
    ga: "Irish",
    hr: "Croatian",
    it: "Italian",
    nl: "Dutch",
    pl: "Polish",
    sk: "Slovak",
    sl: "Slovenian"
};

const PoweredBy = () => (
    <div className="powered-by-logo">
        <span>Powered by</span>
        <TEESlabLogo />
    </div>
);

export default function Layout({ title, auth, env, locale = {current: "en", available: []}, className = "", children }) {
    const isAltLayout = altLayoutRoutes.includes(route().current());
    const { t, setLocale } = useTransHelper();
    var currLocale = locale.current;
    var origLocale;

    useEffect(() => analyticsInitPage(env.gtag, title, auth.user), [title, auth.user]);
    useEffect(() => {
        setLocale(locale.current);
        currLocale = locale.current;
    }, [title, locale.current]);

    const selectLang = () => select(
        t("Select language"),
        t("Note: The translations provided by this application have been automatically generated through the Google Cloud Translation API and the DeepL API."),
        Object.fromEntries(Object.entries({
            "None": ["en"],
            "DeepL": locale.available?.deepl,
            "Google": locale.available?.google}
        ).map(c => [c[0], Object.fromEntries(c[1].map(l => [l, langMap[l]]))])),
        locale.current,
        res => {
            setLocale(res, true);
            currLocale = res;
        },
        () => {
            if(currLocale != origLocale) setLocale(origLocale);
            currLocale = origLocale;
        },
        null,
        d => {
            d.getElementsByClassName("swal2-select")[0].onclick = e => {
                let v = e.target.value;
                if(v != currLocale) setLocale(v);
                currLocale = v;
            }
            origLocale = currLocale;
        },
        t
    );

    const SetLocaleBtn = () => (
        <div id="locale-btn-wrapper">
            <button id="locale-btn" onClick={() => selectLang()}>
                <LanguageIcon />
            </button>
        </div>
    );

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
                <SetLocaleBtn />
                <Footer />
            </div>
            <ToastContainer autoClose={6000} className="toastify-customizations"/>
        </>
    );
}
