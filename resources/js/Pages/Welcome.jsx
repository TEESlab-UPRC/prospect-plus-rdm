import { useState } from 'react';
import Input from '@/Components/Input';
import { getFormData } from '@/Helpers/DomHelpers';
import { Head, Link, router } from '@inertiajs/react';

export default function Welcome({ isRegister = false }) {
    const [errors, setErrors] = useState({});

    const submit = e => {
        e.preventDefault();
        router.post(route(isRegister ? 'register' : 'login'), getFormData(e.target), {onError: setErrors, preserveState: true, preserveScroll: true});
    };

    const skipToHome = () => router.get(route('home.render'));

    return (
        <>
            <Head title="Welcome"/>
            <div className="absolute top-0 right-0 z-10 block w-40 px-4 py-2 text-lg text-center bg-slate-300">Powered by<br />TEESlab</div>{/* TODO: replace/move placeholder */}
            <div className="pp-outer-container">
                <div className="pp-inner-container">
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
                </div>
            </div>
        </>
    );
}
