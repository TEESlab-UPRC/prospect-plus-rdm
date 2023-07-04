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
        <Layout title="Analysis List" auth={auth}>
            <NewAnalysisBtn />
            <Analyses analyses={analyses}/>
        </Layout>
    );
}
