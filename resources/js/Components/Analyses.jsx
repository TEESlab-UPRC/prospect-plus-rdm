import { analyticsEvent, analyticsException } from '@/Helpers/AnalyticsHelpers';
import { confirm } from '@/Helpers/DialogHelpers';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Analysis = ({ analysis }) => {
    const [deleting, setDeleting] = useState(false);
    const {id, org, title, sector, hasRDM, hasFRC} = analysis;

    const editInfo = () => router.post(route('info.load'), {analysis: id});
    const editQ = (type, edit) => router.post(route('questionnaire.load'), Object.assign({type: type}, edit ? {analysis: id} : {}));
    const editFRC = () => editQ('frc', hasFRC);
    const editRDM = () => editQ('rdm', hasRDM);
    const delA = () => {
        setDeleting(true);
        confirm("Please confirm deletion", "Are you sure you want to delete this analysis?",
            () => router.post(route('analyses.delete'), {analysis: id}, {preserveState: true, preserveScroll: true,
                onSuccess: () => {
                    toast.success("Analysis deleted successfully!");
                    analyticsEvent("deleted_analysis");
                },
                onError: () => {
                    toast.error("Failed to delete analysis!");
                    analyticsException("failed to delete analysis");
                }
            }), null, () => setDeleting(false)
        );
    };

    const btnTxt = type => (type == 'rdm' ? hasRDM : hasFRC) ? "View/Edit" : "Create";

    return (
        <tr className={deleting ? "pp-table-del" : ""} children={[
            org, title, sector,
            (<button className={`w-20 ${hasFRC ? "pp-table-btn-lime" : "pp-table-btn-lime-trans"}`} onClick={editFRC}>{btnTxt("frc")}</button>),
            (<button className="w-20 pp-table-btn-green" onClick={editRDM}>{btnTxt("rdm")}</button>),
            (<>
                <button className="pp-table-btn-cyan" onClick={editInfo}>View/Edit Info</button>
                <button className="pp-table-btn-red" onClick={delA}>Delete</button>
            </>)
        ].map((c, i) => (
            <td key={`a${id}c${i}`}>{c}</td>
        ))}/>
    );
};

const Analyses = ({ analyses }) => (
    <table className="pp-table pp-analysis-list-table">
        <colgroup children={Array.from({length: 6}, (_, i) => (
            <col key={`c${i}`}/>
        ))}/>
        <thead>
            <tr children={[
                "Authority/Agency", "Project Title", "Sector", "Quick Finance Readiness Check", "Recommendation-Decision Matrix", "Analysis Actions"
            ].map((h, i) => (
                <th key={`h${i}`}>{h}</th>
            ))}/>
        </thead>
        <tbody children={analyses.map(a => (
            <Analysis analysis={a} key={`a${a.id}`}/>
        ))}/>
    </table>
);

export default Analyses;
