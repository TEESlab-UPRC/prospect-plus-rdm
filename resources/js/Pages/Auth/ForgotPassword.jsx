import Input from '@/Components/Input';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';

export default function ForgotPassword({ auth, env, status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <Layout title="Forgot Password" auth={auth} env={env} className="max-w-2xl gap-7">
            <div className="pp-text">
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            </div>
            <form onSubmit={submit} className="flex flex-col gap-10">
                <Input name="email" label="Email" formObj={{data, setData, errors}} status={status} autoComplete="username" type="email" required/>
                <div className="flex items-center justify-end">
                    <button type="submit" className="pp-btn-blue" disabled={processing}>Email Password Reset Link</button>
                </div>
            </form>
        </Layout>
    );
}
