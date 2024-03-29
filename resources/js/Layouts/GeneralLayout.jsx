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
import {onPageLoad} from '@/Helpers/DomHelpers';

const patchers = import.meta.glob('../Patchers/**/*.{js,jsx}');
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
    const { t, setLocale, setSessionLocale } = useTransHelper();
    const selLang = {
        title: "Select language",
        text: "Note: The translations provided by this application have been automatically generated through the Google Cloud Translation API and the DeepL API.",
        cancel: "Cancel",
        confirm: "Select"
    };

    const setElTxt = (clazz, txt) => document.getElementsByClassName(clazz)[0].innerText = t(txt);

    useEffect(() => onPageLoad(() => Object.values(patchers).forEach(v => v())));   // when done loading, import patchers
    useEffect(() => analyticsInitPage(env.gtag, title, auth.user), [title, auth.user]);
    useEffect(() => setLocale(locale.current), [title, locale.current]);
    useEffect(() => {
        if(document.getElementsByClassName("swal2-container").length > 0)
            Object.entries(selLang) // update selectLang dialog's translations
                .map(e => e[0] == "text" ? ["html-container", e[1]] : e)
                .forEach(e => setElTxt(`swal2-${e[0]}`, e[1]));
    });

    const selectLang = () => select(
        t(selLang.title),
        t(selLang.text),
        Object.fromEntries(Object.entries({
            "None": ["en"],
            "DeepL": locale.available?.deepl,
            "Google": locale.available?.google
        }).map(c => [c[0], Object.fromEntries(c[1].map(l => [l, langMap[l]]))])),
        locale.current,
        (n, p) => (n != p) && setSessionLocale(n),                                                  // save locale, send to server
        (n, p) => (n != p) && setLocale(p),                                                         // abort & revert
        null,
        d => d.getElementsByClassName("swal2-select")[0].onchange = e => setLocale(e.target.value), // on dialog open -> on selection change
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
