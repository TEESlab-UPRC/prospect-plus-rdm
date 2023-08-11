import { router } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';
import { useEffect } from 'react';
import { onPageLoad } from '@/Helpers/DomHelpers';
import { toast } from 'react-toastify';
import { ConsortiumLogos } from '@/Components/Logo';
import { PrivacyPolicyLink } from '@/Components/IntLink';
import { GuidelinesLink, PPLearningProgrammeLink, PROSPECTplusLink } from '@/Components/ExtLink';
import useTransHelper from '@/Helpers/TransHelpers';

const start = () => router.post(route('info.load'));

export default function Home({ auth, env, locale }) {
    const { t, tHTML } = useTransHelper();

    useEffect(() => onPageLoad(() => auth.user || toast.info(t("Guest mode: log in if you want your analyses to be saved!"))), []);

    return (
        <Layout title="Home" auth={auth} env={env} locale={locale} className="grid grid-cols-1">
            <h2 className="text-center">
                Recommendation-Decision Matrix Tool<br />
                for selecting financing schemes
            </h2>
            <hr />
            <div className="flex flex-col gap-3 text-left pp-text">
                <h3 className="text-center" {...tHTML(`
                    Innovative financing is an option for urban climate and sustainable development projects,
                    but cities, municipalities and regions need to know how to activate and use it.
                    The Recommendation-Decision Matrix tool is working to that effect!
                `)}/>
                <p {...tHTML(`
                    The <b>Recommendation-Decision Matrix tool</b> is designed to support local governments on their <b>first
                    decision-making steps</b> against a wide array of <b>innovative schemes</b> for financing their climate and
                    sustainability actions. A <b>practical</b> and <b>easy-to-use tool</b>, <b>free</b> and <b>accessible</b> to all local and regional
                    authorities and their implementing agencies, who are looking at ways to increase or diversify their funding base
                    in order to bridge their municipal infrastructure needs across <b>5 different sectors</b>:
                `)}/>
                <ul>
                    <li>{t("Public Buildings")}</li>
                    <li>{t("Private Buildings")}</li>
                    <li>{t("Public Lightning")}</li>
                    <li>{t("Transportation")}</li>
                    <li>{t("Cross-Sectoral")}</li>
                </ul>
                <p {...tHTML("For each <b>sector of recommendation</b>, there are specific <b>innovative financing schemes</b> that could be best employed.")}/>
                <p {...tHTML(`
                    For each <b>specific scheme</b> an easy-to-grasp checklist of selected decision criteria identifies an <b>ease of implementation
                    rate (%)</b>, based on the <b>project-specific characteristics</b> and the <b>general framework conditions</b>.
                `)}/>
                <p {...tHTML(`
                    <b>Analysis</b> is meant to be repeated <b>over time</b> alongside the early stages of city planning or projects’ preparation
                    process and can also serve as a <b>stand-alone capacity building resource</b> enabling a concise overview of new and innovative
                    financing instruments and an interpretation of their mechanisms and areas of application.
                `)}/>
                <p {...tHTML("<b>First-time user?</b> Check out the :GuidelinesLink.", {GuidelinesLink: (<GuidelinesLink text={t("Recommendation-Decision Matrix tool User Guide")}/>)})}/>
            </div>
            <button type="button" onClick={start} className="self-center my-2 text-2xl w-52 sm:w-64 pp-btn-green justify-self-center">{t("Start!")}</button>
            <p className="text-sm" {...tHTML(`
                The <b>Recommendation-Decision Matrix tool</b> has been developed in :PROSPECTplusLink, a capacity-building HORIZON 2020 project aiming at bringing
                together EU municipalities and empowering them to make more informed decisions on implementing their local energy and climate plans
                (e.g. SEAPs, SECAPs, etc.) by using the appropriate :PPLearningProgrammeLink.
            `, {
                PROSPECTplusLink: (<PROSPECTplusLink text={t("PROSPECT+")}/>),
                PPLearningProgrammeLink: (<PPLearningProgrammeLink text={t("innovative financing schemes")}/>)
            })}/>
            <ConsortiumLogos />
            <PrivacyPolicyLink className="mr-2 text-right justify-self-end"/>
        </Layout>
    );
}
