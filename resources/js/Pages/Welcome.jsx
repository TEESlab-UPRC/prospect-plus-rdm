import { useState } from 'react';
import Input from '@/Components/Input';
import { getFormData } from '@/Helpers/DomHelpers';
import { Link, router } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';
import { PROSPECTplusLogo } from '@/Components/Logo';
import { PrivacyPolicyLink } from '@/Components/ExtLink';

export default function Welcome({ auth, pwReset, isRegister = false }) {
    const [errors, setErrors] = useState({});

    const submit = e => {
        e.preventDefault();
        router.post(route(isRegister ? 'register' : 'login'), getFormData(e.target), {onError: setErrors, preserveState: true, preserveScroll: true});
    };

    const skipToHome = () => router.get(route('home.render'));

    return (
        <Layout title="Welcome" auth={auth} className="pb-4">
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
                <legend className="mb-0 text-center small-legend">{isRegister ? "Register" : "Log in"}</legend>
                {isRegister && (<Input name="name" label="Name" errorObj={errors} autoComplete="name" required/>)}
                <Input name="email" label="Email" errorObj={errors} autoComplete="username" type="email" required/>
                <Input name="password" label="Password" errorObj={errors} autoComplete={isRegister ? "new-password" : (pwReset ? "off" : "current-password")} type="password" required/>
                {isRegister ? (
                    <Input name="password_confirmation" label="Confirm Password" errorObj={errors} autoComplete="new-password" type="password" required/>
                ) : (
                    <div className="flex flex-row justify-between">
                        <Input name="remember" label="Remember me" type="checkbox"/>
                        <Link href={route('password.request')} className="mr-2 text-right pp-link-faint">forgot password?</Link>
                    </div>
                )}
                <div className="flex items-center justify-end mt-2">
                    <Link href={route(isRegister ? 'login' : 'register')} className="pp-link">{isRegister ? "Already registered?" : "Not registered?"}</Link>
                    <button type="submit" className="pp-btn-blue">{isRegister ? "Register" : "Log in"}</button>
                </div>
            </form>
            <hr />
            <div className="grid grid-cols-1 gap-2">
                <button className="pp-btn-lime" onClick={skipToHome}>Proceed without an account</button>
                <PrivacyPolicyLink className="mr-2 text-right justify-self-end"/>
            </div>
        </Layout>
    );
}
