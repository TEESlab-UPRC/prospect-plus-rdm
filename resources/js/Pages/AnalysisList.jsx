import Analyses from '@/Components/Analyses';
import Layout from '@/Layouts/GeneralLayout';

export default function AnalysisList({ auth, analyses }) {
    return (
        <Layout title="Analysis List" auth={auth}>
            <Analyses analyses={analyses}/>
        </Layout>
    );
}
