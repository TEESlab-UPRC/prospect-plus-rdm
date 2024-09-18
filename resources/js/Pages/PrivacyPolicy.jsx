import {GAOptOutAddonLink} from '@/Components/ExtLink';
import useTransHelper from '@/Helpers/TransHelpers';
import Layout from '@/Layouts/GeneralLayout';

export default function PrivacyPolicy({ auth, env, locale }) {
    const { t, tHTML } = useTransHelper();

    return (
        <Layout title="Privacy Policy" auth={auth} env={env} locale={locale} className="max-w-5xl gap-4 justify-items-start pp-text">
            <h1 className="justify-self-center">{t("Privacy Policy")}</h1>
            <p><i>{t("When using this web application you consent to the collection, storage, processing and utilization of your information as described in this Privacy Policy.")}</i></p>
            <h2>{t("Who we are")}</h2>
            <p {...tHTML("This web application was created and is hosted by <b>TEESlab</b>.")}/>
            <h2>{t("What data we collect")}</h2>
            <div>
                <p {...tHTML(`
                    We collect the data <b>registered and logged in users directly provide</b> to us.<br />
                    More specifically, provided during registration or when editing your profile:
                `)}/>
                <ul>
                    <li>{t("User name")}</li>
                    <li>{t("Email address")}</li>
                    <li {...tHTML("User password <i>(more accurately, its derivative hash)</i>")}/>
                </ul>
            </div>
            <div>
                <p>{t("Additionally, during your analyses, we collect the following:")}</p>
                <ul>
                    <li>{t("The analysis info you enter")}</li>
                    <li>{t("Your questionnaire answers")}</li>
                </ul>
            </div>
            <p {...tHTML("When you create or edit the info of your account or analyses, we might also store <b>creation/modification timestamps</b>.")}/>
            <p {...tHTML(`
                Your <b>IP address</b> might be stored, in order for the application to function and if required to protect our services from attacks.<br />
                This applies to all users, not just the registered and logged in ones.
            `)}/>
            <div>
                <p {...tHTML(`
                    In addition, we gather <b>analytics</b> data (using Google Analytics 4) in order to prepare <b>aggregated, anonymized statistics on visitor’s activity</b>.
                    This data includes basic information about your device/browser (e.g. language), your region/country (<i>not</i> granular location or IP address),
                    and information as you browse the website and perform certain actions (e.g. view results, edit stored information); specifically:
                `)}/>
                <ul>
                    <li>{t("whether or not you're logged in")}</li>
                    <li>{t("current page & title")}</li>
                    <li {...tHTML("previous page & title (<i>only</i> if it was still within this application)")}/>
                    <li>{t("if you're in editing mode (where it applies)")}</li>
                    <li>{t("current questionnaire title (where it applies)")}</li>
                    <li>{t("outbound link text/destination (where it applies)")}</li>
                    <li>{t("unexpected errors received")}</li>
                </ul>
            </div>
            <div>
                <b>{t("None of this data contains personally identifiable information or specific data you submitted.")}</b>
                <p {...tHTML(
                    "If you wish to <i><b>opt-out</b></i> from making your site activity available to Google Analytics, you can do so by installing the :GAOptOutAddonLink.",
                    {GAOptOutAddonLink: (<GAOptOutAddonLink text={t("Google Analytics Opt-out Browser Add-on")}/>)}
                )}/>
            </div>
            <p>{t("No sensitive information gets collected by this application.")}</p>
            <h2>{t("How we process your information")}</h2>
            <div>
                <p>{t("The reasons we process your information depend on how you interact with this service and include:")}</p>
                <ul>
                    <li>{t("To facilitate account creation, recovery and user authentication")}</li>
                    <li>{t("For the application to function")}</li>
                </ul>
            </div>
            <h2>{t("Legal ground for processing your data")}</h2>
            <div>
                <p>{t("We process your data on the legal ground that such processing is necessary to:")}</p>
                <ul>
                    <li>{t("provide this service to you, as requested")}</li>
                    <li>{t("detect, prevent and address potential security issues concerning our services")}</li>
                    <li>{t("fulfil our legal obligations")}</li>
                    <li>{t("protect your vital interests or the vital interests of a third party, such as situations involving potential threats to a person's safety")}</li>
                </ul>
            </div>
            <h2>{t("With who we share your data")}</h2>
            <p {...tHTML(`
                We do <b>not</b> share your personal data with any third parties.<br />
                Your anonymized site activity will be gathered by Google Analytics, as described above.
            `)}/>
            <h2>{t("Usage of cookies")}</h2>
            <i>{t("Cookies are small text files that a website may store on your device when you visit.")}</i>
            <p {...tHTML(`
                <b>This application requires cookies to function</b> properly. As such, the application will store cookies on your device, while using it.<br />
                You can configure your browser to block the use of cookies, but that might render this application unusable for you.<br />
                Some of these cookies might be retained for a few days, but if you wish, you can manually delete them from your browser earlier, once you're done using the application.<br />
                <i>Please note that deleting your cookies will also instantly log you out.</i><br />
            `)}/>
            <p {...tHTML('In addition, Google Analytics uses cookies to function. For more information, please refer to the section <i>"What data we collect"</i>.')}/>
            <h2>{t("Data retention")}</h2>
            <p {...tHTML(`
                We keep the data listed above for <b>as long as necessary</b> to fulfil the purposes already described.<br />
                When you perform <b>changes</b> on your account or analysis data, the <b>previous data will not be retained</b>.<br />
                When account or analysis data gets <b>deleted by the user</b>, we <b>do not keep</b> it on our infrastructure anymore.
            `)}/>
            <h2>{t("Data safety")}</h2>
            <p {...tHTML(`
                We have implemented appropriate and reasonable technical security measures to secure the date we process and retain.<br />
                However, the transmission of data between our services and your device is at your own risk.
                You should access our services through a secure connection and device.
            `)}/>
            <h2>{t("Your rights")}</h2>
            <p {...tHTML(`
                You can request a <b>full copy</b> or the <b>full erasure</b> of your data that we retain by contacting us.<br />
                In addition, the aforementioned data <b>erasure does not include</b> any data we are obligated to keep for <b>legal or security purposes</b>.
            `)}/>
            <p {...tHTML(`
                <i>Please note that this process is not automated and might take a few days</i>.<br />
                If you are looking to delete specific information, please refer to the <i>"Data retention"</i> section,
                as you might be able to take advantage of the application's functions to delete what you need in an automated way.
            `)}/>
            <p {...tHTML(`
                You may <b>rectify</b> your personal data directly through the application, but you can contact us if you're unable to, in order to assert your rights.<br />
                You may contact us in order to assert your right to find out whether your personal data is <b>being processed or restrict/object</b> to the processing thereof.
            `)}/>
            <p {...tHTML(`
                We inform you that you have the right to lodge a complaint to the competent data protection authority, pursuant to Article 77 of the Regulation
                (EU) 2016/679, if you believe that your personal data have been processed in violation of any applicable law concerning data protection.
            `)}/>
            <h2>{t("Policy updates")}</h2>
            <p {...tHTML(`
                We may revise this Privacy & Cookies policy from time to time, for example due to changes in our practices or for other operational,
                legal or regulatory reasons. You should check this page occasionally to ensure you are up to date with the most current version of the policy.
            `)}/>
        </Layout>
    );
}
