import Layout from '@/Layouts/GeneralLayout';

export default function PrivacyPolicy({ auth, env }) {
    return (
        <Layout title="Privacy Policy" auth={auth} env={env} className="max-w-5xl gap-4 justify-items-start pp-text">
            <h1 className="justify-self-center">Privacy Policy</h1>
            <p><i>When using this web application you consent to the collection, storage, processing and utilization of your information as described in this Privacy Policy.</i></p>
            <h2>Who we are</h2>
            <p>This web application was created and is hosted by <b>TEESlab</b>.</p>
            <h2>What data we collect</h2>
            <p>
                We collect the data <b>registered and logged in users directly provide</b> to us.<br />
                More specifically, provided during registration or when editing your profile:
                <ul className="mb-2">
                    <li>User name</li>
                    <li>Email address</li>
                    <li>User password <i>(more accurately, its derivative hash)</i></li>
                </ul>
                Additionally, during your analyses, we collect the following:
                <ul className="mb-2">
                    <li>The analysis info you enter</li>
                    <li>Your questionnaire answers</li>
                </ul>
                When you create or edit the info of your account or analyses, we might also store <b>creation/modification timestamps</b>.
            </p>
            <p>
                Your <b>IP address</b> might be stored, in order for the application to function and if required to protect our services from attacks.<br />
                This applies to all users, not just the registered and logged in ones.
            </p>
            <p>No sensitive information gets collected by this application.</p>
            <h2>How we process your information</h2>
            <p>
                The reasons we process your information depend on how you interact with this service and include:
                <ul>
                    <li>To facilitate account creation, recovery and user authentication</li>
                    <li>For the application to function</li>
                </ul>
            </p>
            <h2>Legal ground for processing your data</h2>
            <p>
                We process your data on the legal ground that such processing is necessary to:
                <ul>
                    <li>provide this service to you, as requested</li>
                    <li>detect, prevent and address potential security issues concerning our services</li>
                    <li>fulfil our legal obligations</li>
                    <li>protect your vital interests or the vital interests of a third party, such as situations involving potential threads to a person's safety</li>
                </ul>
            </p>
            <h2>With who we share your data</h2>
            <p>We do <b>not</b> share your data with any third parties.</p>
            <h2>Usage of cookies</h2>
            <p>
                <i>Cookies are small text files that a website may store on your device when you visit.</i><br />
                <b>This application requires cookies to function</b> properly. As such, the application will store cookies on your device, while using it.<br />
                You can configure your browser to block the use of cookies, but that might render this application unusable for you.<br />
                Some of these cookies might be retained for a few days, but if you wish, you can manually delete them from your browser earlier, once you're done using the application.<br />
                <i>Please note that deleting your cookies will also instantly log you out.</i><br />
                <b>Cookies do not get used by this service for any other reason.</b>
            </p>
            <h2>Data retention</h2>
            <p>
                We keep the data listed above for <b>as long as necessary</b> to fulfil the purposes already described.<br />
                When you perform <b>changes</b> your account or analysis data, the <b>previous data will not be retained</b>.<br />
                When account or analysis data gets <b>deleted by the user</b>, we <b>do not keep</b> it on our infrastructure anymore.
            </p>
            <h2>Data safety</h2>
            <p>
                We have implemented appropriate and reasonable technical security measures to secure the date we process and retain.<br />
                However, the transmission of data between our services and your device is at your own risk.
                You should access our services through a secure connection and device.
            </p>
            <h2>Your rights</h2>
            <p>
                You can request a <b>full copy</b> or the <b>full erasure</b> of your data that we retain by contacting us.<br />
                In addition, the aforementioned data <b>erasure does not include</b> any data we are obligated to keep for <b>legal or security purposes</b>.
            </p>
            <p>
                <i>Please note that this process is not automated and might take a few days</i>.<br />
                If you are looking to delete specific information, please refer to the <i>"Data retention"</i> section,
                as you might be able to take advantage of the application's functions to delete what you need in an automated way.
            </p>
            <p>
                You may <b>rectify</b> your personal data directly through the application, but you can contact us if you're unable to, in order to assert your rights.<br />
                You may contact us in order to assert your right to find out whether your personal data is <b>being processed or restrict/object</b> to the processing thereof.
            </p>
            <p>
                We inform you that you have the right to lodge a complaint to the competent data protection authority, pursuant to Article 77 of the Regulation
                (EU) 2016/679, if you believe that your personal data have been processed in violation of any applicable law concerning data protection.
            </p>
            <h2>Policy updates</h2>
            <p>
                We may revise this Privacy & Cookies policy from time to time, for example due to changes in our practices or for other operational,
                legal or regulatory reasons. You should check this page occasionally to ensure you are up to date with the most current version of the policy.
            </p>
        </Layout>
    );
}
