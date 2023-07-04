import { router } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';
import { useEffect } from 'react';
import { onPageLoad } from '@/Helpers/DomHelpers';
import { toast } from 'react-toastify';

const start = () => router.post(route('info.load'));

export default function Home({ auth }) {
    useEffect(() => onPageLoad(() => auth.user || toast.info("Guest mode: log in if you want your analyses to be saved!")), []);

    return (
        <Layout title="Sector Selection" auth={auth} className="flex flex-col">
            <h2 className="text-center">
                Recommendation-Decision Matrix Tool<br />
                for selecting financing schemes
            </h2>
            <hr />
            <div className="flex flex-col gap-1 text-left pp-text">
                <p>Welcome message</p>
                <p>prospect+ in brief (3-4 lines)</p>
                <p>the tool in brief (3-4 lines)</p>
                <p>read the guideline (link)</p>
            </div>
            <hr />
            <button type="button" onClick={start} className="self-center pp-btn-green" style={{width: '250px'}}>Start!</button>
        </Layout>
    );
}
