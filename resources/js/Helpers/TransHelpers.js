import { router } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { isValidElement } from 'react';
import { renderToString } from 'react-dom/server';

const toKey = key => key.trim().replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\s\s+/g, " ");
const fromVal = key => key.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
const mapObjReact2str = components => components ? Object.fromEntries(Object.entries(components)
    .map(e => [e[0], isValidElement(e[1]) ? renderToString(e[1]) : e[1]])) : components;
const setSessionLocale = locale => router.post(route('locale.set'), {locale: locale}, {preserveState: true, preserveScroll: true});

export const useTransHelper = () => {
    const { t, setLocale, ...o } = useLaravelReactI18n();
    const tMod = (key, replacements = null) => key ? fromVal(t(toKey(key), mapObjReact2str(replacements))) : null;
    return {
        ...o,
        t: tMod,
        tHTML: (key, replacements = null) => ({dangerouslySetInnerHTML: {__html: tMod(key, replacements)}}),
        setLocale: (locale, setSession = false) => {
            setLocale(locale);
            if(setSession) setSessionLocale(locale);
        },
        setSessionLocale: setSessionLocale
    };
}

export default useTransHelper;
