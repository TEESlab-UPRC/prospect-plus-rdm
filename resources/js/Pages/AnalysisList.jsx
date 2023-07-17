import Analyses from '@/Components/Analyses';
import Layout from '@/Layouts/GeneralLayout';
import { router } from '@inertiajs/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AnalysisList({ auth, analyses }) {
    const goToHome = () => router.get(route('home.render'));

    const NewAnalysisBtn = () => (
        <span>
            <button className="pp-btn-yellow" onClick={goToHome}>
                <AddCircleOutlineIcon />Create new analysis
            </button>
        </span>
    );

    return (
        <Layout title="Your Analyses" auth={auth}>
            <h1 className="text-center">Your analyses</h1>
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
                    <h3>No analyses completed yet!</h3>
                    <NewAnalysisBtn />
                </div>
            )}
        </Layout>
    );
}
