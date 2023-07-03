import { useState } from 'react';
import Input from '@/Components/Input';
import { getFormData } from '@/Helpers/DomHelpers';
import { Link, router } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';

export default function Welcome({ auth, isRegister = false }) {
    const [errors, setErrors] = useState({});

    const submit = e => {
        e.preventDefault();
        router.post(route(isRegister ? 'register' : 'login'), getFormData(e.target), {onError: setErrors, preserveState: true, preserveScroll: true});
    };

    const skipToHome = () => router.get(route('home.render'));

    return (
        <Layout title="Welcome" auth={auth}>
            <p className="text-5xl text-center">P+ LOGO</p>{/* TODO: replace placeholder */}
            <p className="text-2xl text-center">
                Recommendation-Decision Matrix Tool<br />
                for selecting financing schemes
            </p>
            <hr />
            <form onSubmit={submit} className={`gap-3 ${isRegister ? "pp-mark-required" : ""}`}>
                <legend className="mb-0 small-legend">{isRegister ? "Register" : "Log in"}</legend>
                {isRegister && (<Input name="name" label="Name" errorObj={errors} autoComplete="name" required={true}/>)}
                <Input name="email" label="Email" errorObj={errors} autoComplete="username" type="email" required={true}/>
                <Input name="password" label="Password" errorObj={errors} autoComplete={isRegister ? "new-password" : "current-password"} type="password" required={true}/>
                {isRegister ? (
                    <Input name="password_confirmation" label="Confirm Password" errorObj={errors} autoComplete="new-password" type="password" required={true}/>
                ) : (
                    <Input name="remember" label="Remember me" type="checkbox"/>
                )}
                <div className="flex items-center justify-end mt-2">
                    <Link href={route(isRegister ? 'login' : 'register')} className="underline pp-fg-cyan">{isRegister ? "Already registered?" : "Not registered?"}</Link>
                    <button type="submit" className="pp-btn-blue">{isRegister ? "Register" : "Log in"}</button>
                </div>
            </form>
            <hr />
            <button className="pp-btn-lime" onClick={skipToHome}>Proceed without an account</button>
        </Layout>
    );
}
