import { Head, router } from '@inertiajs/react';

const onClick = e => router.get(route('info'), {next: e.target.value});

export default function Home({ data }) {
    return (
        <>
            <Head title="Sector Selection"/>
            <div className="pp-outer-container">
                <div className="flex flex-col justify-center pp-inner-container pp-text">
                    <div className="text-2xl text-center">Recommendation-Decision Matrix Tool<br />for selecting financing schemes</div>
                    <div className="flex flex-col gap-1 text-left">
                        <p>Welcome message</p>
                        <p>prospect+ in brief (3-4 lines)</p>
                        <p>the tool in brief (3-4 lines)</p>
                        <p>read the guideline (link)</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-center">Start with:</div>
                        <div className="flex flex-row gap-6">
                            <button type="button" value="frc" onClick={onClick} className="pp-btn-cyan" style={{width: '250px'}}>Quick Finance Readiness<br />Check</button>
                            <button type="button" value="rdm" onClick={onClick} className="pp-btn-cyan" style={{width: '250px'}}>Recommendation-Decision<br />Matrix</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
