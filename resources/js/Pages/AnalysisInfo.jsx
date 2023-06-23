import { Head, router } from '@inertiajs/react';
import Input from '@/Components/Input';

const getFormData = form => Object.fromEntries(Array.from(new FormData(form).entries()).map(e => e[1] == 'N/A' ? [e[0], null] : e));

export default function AnalysisInfo({ auth, plans, types, phases, next }) {
    const gotoNext = (info = null) => {
        let opt = info ? {} : {'replace': true};
        if(next == 'rdm') router.get(route('sector.render'), {info: info}, opt);
        else router.post(route('questionnaire.render'), {info: info, type: 'frc'}, opt);
    };

    const onSubmit = e => {
        e.preventDefault();
        gotoNext(getFormData(e.target));
    };

    if(!auth.user){
        gotoNext();
        return (<i>Loading guest session, please wait...</i>);
    }

    return (
        <>
            <Head title="Analysis Details"/>
            <div className="pp-outer-container">
                <div className="pp-inner-container">
                    <form onSubmit={onSubmit} className="pp-mark-required">
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
