import Input from '@/Components/Input';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/GeneralLayout';
import { useEffect } from 'react';
import { onPageLoad } from '@/Helpers/DomHelpers';
import { toast } from 'react-toastify';

export default function ProfileEdit({ auth, env }) {
    const user = auth.user;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        onPageLoad(() => {
            Array.from(document.getElementById("profile-info-form").getElementsByTagName("input")).forEach(el => {
                el.classList.add("refilled-data");
                el.onfocus = () => {
                    el.classList.remove("refilled-data");
                    el.onfocus = null;
                };
            });
            document.getElementById("password").onchange = e =>
                Array.from(document.getElementsByClassName("reqOnPw"))
                        .map(el => el.getElementsByTagName("input")[0]).forEach(el =>
                            e.target.value.length > 0 ? el.classList.add("pp-required") : el.classList.remove("pp-required"));
        });

        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = e => {
        e.preventDefault();
        post(route('profile.store'), {preserveState: true, preserveScroll: true,
            onSuccess: () => toast.success("Profile info saved successfully!")
        });
    };

    return (
        <Layout title="Edit Profile" auth={auth} env={env} className="max-w-2xl">
            <h1>Edit Profile</h1>
            <p className="pp-text">
                You can change your profile info from here.<br />
                To keep the same password, just leave the "New Password" field empty.<br />
                If you wish to set a new password, you will also need to enter your current password.
            </p>
            <hr />
            <form id="profile-info-form" onSubmit={submit} className="flex flex-col gap-5">
                <Input name="name" label="Name" formObj={{data, setData, errors}} autoComplete="name" required/>
                <Input name="email" label="Email" formObj={{data, setData, errors}} type="email" required/>
                <hr className="mt-2" />
                <Input name="current_password" label="Current Password" className="reqOnPw" formObj={{data, setData, errors}} autoComplete="current-password" type="password"/>
                <Input name="password" label="New Password" formObj={{data, setData, errors}} autoComplete="new-password" type="password"/>
                <Input name="password_confirmation" label="Confirm Password" className="reqOnPw" formObj={{data, setData, errors}} autoComplete="new-password" type="password"/>
                <div className="flex items-center justify-end">
                    <button type="submit" className="pp-btn-blue" disabled={processing}>Save</button>
                </div>
            </form>
        </Layout>
    );
}
