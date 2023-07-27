import ReactGA from "react-ga4";

var curr = {page_title: null, logged_in: false};

const storage = window.sessionStorage;
const storageGet = k => storage.getItem(k);
const storageSet = (k, v) => storage.setItem(k, v);

const storeRef = () => {
    storageSet("last_path", window.location.pathname);
    storageSet("last_title", curr.page_title);
};

const getGAFieldObj = (extra = {}) => ({
    page_location: window.location,
    page_path: window.location.pathname,
    ...curr, ...extra
});

const pageview = () => ReactGA.send({hitType: "pageview", ...getGAFieldObj({
    page_referrer: storageGet("last_path"),
    page_referrer_title: storageGet("last_title")
})});

export function analyticsInitPage(gtagID, page_title, user){
    if(!gtagID) return;
    curr = {page_title, logged_in: !!user};
    if(ReactGA.isInitialized) pageview();
    else ReactGA.initialize(gtagID, {gtagOptions: getGAFieldObj()});
    storeRef();
}

export const analyticsEvent = (name, params = {}) => ReactGA.isInitialized && ReactGA.event(name, getGAFieldObj(params));
export const analyticsException = description => analyticsEvent("exception", {description});
export const analyticsLinkClick = (url, text = null) =>
    analyticsEvent("click", {outbound: true, link_url: url, ...(text ? {link_text: text, logo_link: false} : {logo_link: true})});

export default {
    analyticsInitPage,
    analyticsEvent,
    analyticsException,
    analyticsLinkClick
};
