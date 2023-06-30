import { useState } from 'react';
import Input from '@/Components/Input';
import { getFormData } from '@/Helpers/DomHelpers';
import { Head, Link, router } from '@inertiajs/react';

export default function Welcome({ isRegister = false }) {
    const [errors, setErrors] = useState({});

    const submit = e => {
        e.preventDefault();
        router.post(route(isRegister ? 'register' : 'login'), getFormData(e.target), {onError: setErrors} );
    };

    return (
        <>
            <Head title="Welcome"/>
            <div className="pp-outer-container">
                <div className="pp-inner-container">
                    <form onSubmit={submit}>
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
                </div>
            </div>
        </>
    );
}
