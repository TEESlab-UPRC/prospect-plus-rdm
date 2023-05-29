import { Head } from '@inertiajs/react';
import Input from '@/Components/Input';

export default function AnalysisInfo({ plans, types, phases }) {
    return (
        <>
            <Head title="Analysis Details"/>
            <div className="pp-outer-container">
                <div className="pp-inner-container">
                    {/* <form onSubmit={showResults} className="grid grid-cols-1 gap-6"> */}
                    <form className="pp-mark-required">
                        <legend>Your Analysis Details</legend>
                        <fieldset>
                            <legend>General Information</legend>
                            <Input name="authority" label="Authority/Agency:" required/>
                            <Input name="region" label="City/Region:"/>
                            <Input name="country" label="Country:"/>
                            <Input name="plan" label="Does your city have a SECAP or other similar sustainable plan or strategy?" options={plans}/>
                        </fieldset>
                        <fieldset>
                            <legend>Project Description</legend>
                            <Input name="title" label="Project title:"/>
                            <Input name="type" label="Type of measure:" options={types}/>
                            <Input name="sector" label="Sector:" options={['Public Buildings', 'Private Buildings', 'Transport', 'Public Lighting', 'Cross Sectoral']}/>
                            <Input name="phase" label="Phase:" options={phases}/>
                            <Input name="impl" label="(Estimated) Starting date of implementation:" type="date"/>
                            <Input name="comp" label="(Estimated) Starting date of completion:" type="date"/>
                        </fieldset>
                        <button type="submit" className="pp-btn-cyan">Next</button>
                    </form>
                </div>
            </div>
        </>
    );
}
