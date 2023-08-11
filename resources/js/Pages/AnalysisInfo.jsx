import { router } from '@inertiajs/react';
import Input from '@/Components/Input';
import { onPageLoad, getFormData, setFormData } from '@/Helpers/DomHelpers';
import { useEffect, useState } from 'react';
import Layout from '@/Layouts/GeneralLayout';
import { analyticsEvent } from '@/Helpers/AnalyticsHelpers';
import useTransHelper from '@/Helpers/TransHelpers';

export default function AnalysisInfo({ auth, env, locale, plans, types, phases, sectors, info, editMode }) {
    const { t } = useTransHelper();
    const [errors, setErrors] = useState({});

    const onSubmit = e => {
        e.preventDefault();
        router.post(route('info.store'), {info: getFormData(e.target)}, {preserveScroll: true, preserveState: true, onError: setErrors,
            onSuccess: () => editMode && analyticsEvent("edit_analysis_info")
        });
    };

    useEffect(() => onPageLoad(() => setFormData(document.getElementById("analysis-info-form"), info, el => {
        el.classList.add("refilled-data");
        el.onfocus = () => {
            el.classList.remove("refilled-data");
            el.onfocus = null;
        };
    })), []);

    return (
        <Layout title="Analysis Details" auth={auth} env={env} locale={locale}>
            <form id="analysis-info-form" onSubmit={onSubmit} className="pp-mark-required">
                <legend>{t("Your Analysis Details")}</legend>
                <fieldset>
                    <legend>{t("General Information")}</legend>
                    <Input name="org" label={t("Authority/Agency")} errorObj={errors} required/>
                    <Input name="region" label={t("City/Region")} errorObj={errors}/>
                    <Input name="country" label={t("Country")} errorObj={errors}/>
                    <Input name="plan" label={t("Does your city have a SECAP or other similar sustainable plan or strategy?")} errorObj={errors} options={plans}/>
                </fieldset>
                <fieldset>
                    <legend>{t("Project Description")}</legend>
                    <Input name="title" label={t("Project title")} errorObj={errors}/>
                    <Input name="type" label={t("Type of measure")} errorObj={errors} options={types}/>
                    <Input name="sector" label={t("Sector")} errorObj={errors} options={sectors}/>
                    <Input name="phase" label={t("Phase")} errorObj={errors} options={phases}/>
                    <Input name="implementation_start" label={t("(Estimated) Starting date of implementation")} errorObj={errors} type="date"/>
                    <Input name="completion_start" label={t("(Estimated) Date of completion")} errorObj={errors} type="date"/>
                </fieldset>
                <button type="submit" className="pp-btn-green">{t(editMode ? "Save" : "Next")}</button>
            </form>
        </Layout>
    );
}
