import { Head, router } from '@inertiajs/react';

const start = () => router.post(route('info.load'));

export default function Home() {
    return (
        <>
            <Head title="Sector Selection"/>
            <div className="pp-outer-container">
                <div className="flex flex-col justify-center pp-inner-container pp-text">
                    <p className="text-4xl text-center">P+ LOGO</p>{/* TODO: replace placeholder */}
                    <p className="text-2xl text-center">
                        Recommendation-Decision Matrix Tool<br />
                        for selecting financing schemes
                    </p>
                    <hr />
                    <div className="flex flex-col gap-1 text-left">
                        <p>Welcome message</p>
                        <p>prospect+ in brief (3-4 lines)</p>
                        <p>the tool in brief (3-4 lines)</p>
                        <p>read the guideline (link)</p>
                    </div>
                    <button type="button" onClick={start} className="self-center pp-btn-green" style={{width: '250px'}}>Start!</button>
                </div>
            </div>
        </>
    );
}
