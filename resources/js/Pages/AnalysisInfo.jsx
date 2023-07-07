import { router } from '@inertiajs/react';
import Input from '@/Components/Input';
import { onPageLoad, getFormData, setFormData } from '@/Helpers/DomHelpers';
import { useEffect, useState } from 'react';
import Layout from '@/Layouts/GeneralLayout';

export default function AnalysisInfo({ auth, plans, types, phases, sectors, info, editMode }) {
    const [errors, setErrors] = useState({});

    const onSubmit = e => {
        e.preventDefault();
        router.post(route('info.store'), {info: getFormData(e.target)}, {onError: setErrors, preserveScroll:true, preserveState: true});
    };

    useEffect(() => onPageLoad(() => setFormData(document.getElementById("analysis-info-form"), info, el => {
        el.classList.add("refilled-data");
        el.onfocus = () => {
            el.classList.remove("refilled-data");
            el.onfocus = null;
        };
    })), []);

    return (
        <Layout title="Analysis Details" auth={auth}>
            <form id="analysis-info-form" onSubmit={onSubmit} className="pp-mark-required">
                <legend>Your Analysis Details</legend>
                <fieldset>
                    <legend>General Information</legend>
                    <Input name="org" label="Authority/Agency:" errorObj={errors} required/>
                    <Input name="region" label="City/Region:" errorObj={errors}/>
                    <Input name="country" label="Country:" errorObj={errors}/>
                    <Input name="plan" label="Does your city have a SECAP or other similar sustainable plan or strategy?" errorObj={errors} options={plans}/>
                </fieldset>
                <fieldset>
                    <legend>Project Description</legend>
                    <Input name="title" label="Project title:" errorObj={errors}/>
                    <Input name="type" label="Type of measure:" errorObj={errors} options={types}/>
                    <Input name="sector" label="Sector:" errorObj={errors} options={sectors}/>
                    <Input name="phase" label="Phase:" errorObj={errors} options={phases}/>
                    <Input name="implementation_start" label="(Estimated) Starting date of implementation:" errorObj={errors} type="date"/>
                    <Input name="completion_start" label="(Estimated) Starting date of completion:" errorObj={errors} type="date"/>
                </fieldset>
                <button type="submit" className="pp-btn-green">{editMode ? "Save" : "Next"}</button>
            </form>
        </Layout>
    );
}
