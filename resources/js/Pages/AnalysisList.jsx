import Analyses from '@/Components/Analyses';
import useTransHelper from '@/Helpers/TransHelpers';
import Layout from '@/Layouts/GeneralLayout';
import { router } from '@inertiajs/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AnalysisList({ auth, env, locale, analyses }) {
    const { t } = useTransHelper();
    const goToHome = () => router.get(route('home.render'));

    const NewAnalysisBtn = () => (
        <span>
            <button className="pp-btn-yellow" onClick={goToHome}>
                <AddCircleOutlineIcon />{t("Create new analysis")}
            </button>
        </span>
    );

    return (
        <Layout title="Your Analyses" auth={auth} env={env} locale={locale}>
            <h1>{t("Your analyses")}</h1>
            <hr />
            {analyses.length > 0 ? (
                <>
                    <NewAnalysisBtn />
                    <div className="overflow-x-scroll shadow-md">
                        <Analyses analyses={analyses}/>
                    </div>
                </>
            ) : (
                <div className="flex items-center gap-8">
                    <h3>{t("No analyses completed yet!")}</h3>
                    <NewAnalysisBtn />
                </div>
            )}
        </Layout>
    );
}
