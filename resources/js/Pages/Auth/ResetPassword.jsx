import { useEffect } from 'react';
import Input from '@/Components/Input';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';
import useTransHelper from '@/Helpers/TransHelpers';

export default function ResetPassword({ auth, env, locale, token, email }) {
    const { t } = useTransHelper();
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <Layout title="Reset Password" auth={auth} env={env} locale={locale} className="max-w-2xl">
            <form onSubmit={submit} className="flex flex-col gap-6">
                <Input name="email" label={t("Email")} formObj={{data, setData, errors}} autoComplete="username" type="email" required disabled/>
                <Input name="password" label={t("Password")} formObj={{data, setData, errors}} autoComplete="new-password" type="password" required/>
                <Input name="password_confirmation" label={t("Confirm Password")} formObj={{data, setData, errors}} autoComplete="new-password" type="password" required/>
                <div className="flex items-center justify-end">
                    <button type="submit" className="pp-btn-blue" disabled={processing}>{t("Reset Password")}</button>
                </div>
            </form>
        </Layout>
    );
}
