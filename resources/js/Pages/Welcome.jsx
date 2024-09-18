import { useState, useEffect } from 'react';
import Input from '@/Components/Input';
import { getFormData } from '@/Helpers/DomHelpers';
import { Link, router } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';
import { PROSPECTplusLogo } from '@/Components/Logo';
import { PrivacyPolicyLink } from '@/Components/IntLink';
import { analyticsEvent } from '@/Helpers/AnalyticsHelpers';
import useTransHelper from '@/Helpers/TransHelpers';

export default function Welcome({ auth, env, locale, pwReset, isRegister = false }) {
    const [errors, setErrors] = useState({});
    const { t } = useTransHelper();

    useEffect(() => {pwReset && analyticsEvent("reset_password");}, []);

    const submit = e => {
        e.preventDefault();
        router.post(route(isRegister ? 'register' : 'login'), getFormData(e.target), {
            preserveState: true, preserveScroll: true, onError: setErrors,
            onSuccess: () => analyticsEvent(isRegister ? "sign_up" : "login")
        });
    };

    const skipToHome = () => router.get(route('home.render'));

    return (
        <Layout title="Welcome" auth={auth} env={env} locale={locale} className="pb-4">
            <div className="welcome-pp-logo">
                <PROSPECTplusLogo />
                <h3 className="pp-fg-blue-light">Capacity building for cities and regions<br />From learning to action!</h3>
            </div>
            <div className="flex flex-col gap-2 text-center">
                <hr />
                <h2>
                    Recommendation-Decision Matrix Tool<br />
                    for selecting financing schemes
                </h2>
                <hr />
            </div>
            <form onSubmit={submit} className={`gap-3 ${isRegister ? "pp-mark-required" : ""}`}>
                <legend className="mb-0 text-center small-legend">{t(isRegister ? "Register" : "Log In")}</legend>
                {isRegister && (<Input name="name" label={t("Name")} errorObj={errors} autoComplete="name" required/>)}
                <Input name="email" label={t("Email")} errorObj={errors} autoComplete="username" type="email" required/>
                <Input name="password" label={t("Password")} errorObj={errors} autoComplete={isRegister ? "new-password" : (pwReset ? "off" : "current-password")} type="password" required/>
                {isRegister ? (
                    <Input name="password_confirmation" label={t("Confirm Password")} errorObj={errors} autoComplete="new-password" type="password" required/>
                ) : (
                    <div className="flex flex-row justify-between">
                        <Input name="remember" label={t("Remember me")} type="checkbox"/>
                        <Link href={route('password.request')} className="mr-2 text-right pp-link-faint">{t("forgot password?")}</Link>
                    </div>
                )}
                <div className="flex items-center justify-between mt-2">
                    <PrivacyPolicyLink className="mr-2 justify-self-end"/>
                    <div className="flex items-center justify-end gap-4">
                        <Link href={route(isRegister ? 'login' : 'register')} className="text-right pp-link">{t(isRegister ? "Already registered?" : "Not registered?")}</Link>
                        <button type="submit" className="pp-btn-blue">{t(isRegister ? "Register" : "Log In")}</button>
                    </div>
                </div>
            </form>
            <hr />
            <button className="pp-btn-lime" onClick={skipToHome}>{t("Proceed without an account")}</button>
        </Layout>
    );
}
