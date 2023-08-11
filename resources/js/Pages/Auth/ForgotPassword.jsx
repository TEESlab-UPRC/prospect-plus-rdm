import Input from '@/Components/Input';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';
import { analyticsEvent } from '@/Helpers/AnalyticsHelpers';
import useTransHelper from '@/Helpers/TransHelpers';

export default function ForgotPassword({ auth, env, locale, status }) {
    const { t, tHTML } = useTransHelper();

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'), {onSuccess: () => analyticsEvent("request_password_reset")});
    };

    return (
        <Layout title="Forgot Password" auth={auth} env={env} locale={locale} className="max-w-2xl gap-7">
            <div className="pp-text" {...tHTML(`
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            `)}/>
            <form onSubmit={submit} className="flex flex-col gap-10">
                <Input name="email" label={t("Email")} formObj={{data, setData, errors}} status={status} autoComplete="username" type="email" required/>
                <div className="flex items-center justify-end">
                    <button type="submit" className="pp-btn-blue" disabled={processing}>{t("Email Password Reset Link")}</button>
                </div>
            </form>
        </Layout>
    );
}
