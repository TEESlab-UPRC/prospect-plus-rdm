import Analyses from '@/Components/Analyses';
import Layout from '@/Layouts/GeneralLayout';
import { router } from '@inertiajs/react';

export default function AnalysisList({ auth, analyses }) {
    const goToHome = () => router.get(route('home.render'));

    return (
        <Layout title="Analysis List" auth={auth}>
            <button className="pp-btn-yellow" onClick={goToHome}>Create a new analysis</button>
            <Analyses analyses={analyses}/>
        </Layout>
    );
}
