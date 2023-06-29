import Analyses from '@/Components/Analyses';
import { Head, router } from '@inertiajs/react';

export default function AnalysisList({ analyses }) {
    return (
        <>
            <Head title="Analysis List"/>
            <div className="pp-outer-container">
                <div className="pp-inner-container">
                    <Analyses analyses={analyses}/>
                </div>
            </div>
        </>
    );
}
