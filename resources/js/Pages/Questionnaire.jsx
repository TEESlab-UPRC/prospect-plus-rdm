import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Question from '@/Components/Question';
import RDMChart from '@/Components/RDMChart';
import FRCChart from '@/Components/FRCChart';
import ChartDLBtn from '@/Components/ChartDLBtn';
import { onPageLoad, centerTo } from '@/Helpers/DomHelpers';
import { getCSSVar } from '@/Helpers/RenderHelpers';
import Layout from '@/Layouts/GeneralLayout';
import { toast } from 'react-toastify';
import SectorCircleImg from '@/../img/sectors/SectorCircleImg';
import { analyticsEvent } from '@/Helpers/AnalyticsHelpers';
import useTransHelper from '@/Helpers/TransHelpers';

const onChartLoadCenterDelay = 100;

const imgMap = {
    'Public Buildings': SectorCircleImg.PublicBuildings,
    'Private Buildings': SectorCircleImg.PrivateBuildings,
    'Transport': SectorCircleImg.Transport,
    'Public Lighting': SectorCircleImg.PublicLighting,
    'Cross Sectoral': SectorCircleImg.CrossSectoral
}

const colorMap = Object.fromEntries(Object.entries({
    'Public Buildings': "blue",
    'Private Buildings': "cyan",
    'Transport': "green",
    'Public Lighting': "yellow",
    'Cross Sectoral': "lime"
}).map(e => [e[0], getCSSVar(`pp-${e[1]}`)]));

const in2AnsID = inputEl => inputEl.parentElement.getElementsByTagName("span")[0].dataset.answerId;
const ans2Obj = answers => Object.fromEntries(answers.map(el => [parseInt(el.name.substr(1)), parseInt(in2AnsID(el))]));
const centerToChart = () => centerTo(document.getElementById("visible-chart"));


export default function Questionnaire({ auth, env, locale, questionnaire, currentAnswers, analysisTitle }) {
    const isEdit = !!currentAnswers;
    const dlQuestionnaireTitle = questionnaire.isRDM ? questionnaire.title : "Quick Finance Readiness Check";
    const resultFilename = [analysisTitle, dlQuestionnaireTitle, "results"].filter(e => e).join(" - ");
    const maxAns = Math.max(...questionnaire.answers.map(a => a.value));
    const ansInversionMap = Object.fromEntries(questionnaire.questions.map(q => [q.id, q.invert_ans_val]));
    const [initScrollY, setInitScrollY] = useState(window.scrollY);
    const [filled, setFilled] = useState(false);
    const [result, setResult] = useState([0]);
    const { t } = useTransHelper();

    const getAnswersWithInversions = answers => answers.map(a => Object.assign(a, {value: (ansInversionMap[parseInt(a.name.substr(1))] ? maxAns - parseInt(a.value) : a.value)}));
    const reduceAns2Percent = answers => answers.map(a => parseInt(a.value)).reduce((p, n) => p + n, 0) / (answers.length * maxAns) * 100;
    const onChartLoad = () => setTimeout(() => window.scrollY == initScrollY && centerToChart(), onChartLoadCenterDelay);

    const DLBtn = () => (<ChartDLBtn filename={resultFilename} callback={() => analyticsEvent("download_results", {
        questionnaire_title: dlQuestionnaireTitle,
        questionnaire_context: isEdit ? "later" : "initial"
    })}/>);

    useEffect(() => onPageLoad(() => {  // executed when loaded in edit mode
        if(!isEdit || filled) return;
        let form = document.getElementById("questionnaire-form");
        let formEls = form.elements;
        Object.entries(currentAnswers).map(
                e => Array.from(formEls["q" +  e[0]].values())  // get question's inputs
                        .filter(el => in2AnsID(el) == e[1])[0]   // get selected answer
                ).forEach(el => el.checked = true);
        showResults(form);
    }), [currentAnswers]);

    function showResults(form){
        let answers = Array.from(form.querySelectorAll(":checked"));
        if(answers.length == 0) return;
        let answersWithInversions = getAnswersWithInversions(answers);
        if(questionnaire.isRDM) setResult(questionnaire.schemes.map(s => ({                                // for each scheme included in this questionnaire
            'title': s.title,
            'result': reduceAns2Percent(answersWithInversions.filter(a => s.questions.includes(parseInt(a.name.substr(1))))), // filter for included questions in scheme and reduce answers to percentage
            'fill': colorMap[questionnaire.title]
        })));
        else setResult([reduceAns2Percent(answersWithInversions)]);
        analyticsEvent("view_results", {
            questionnaire_title: dlQuestionnaireTitle,
            questionnaire_context: isEdit ? (filled ? "later edit" : "later view") : (filled ? "initial submission edit" : "initial submission view")
        });
        setFilled(true);
        return answers;
    }

    function onSubmit(e){
        e.preventDefault();
        let answers = showResults(e.target);
        setInitScrollY(window.scrollY);
        if(filled) centerToChart();
        if(auth.user && answers) router.post(route('questionnaire.store'), {answers: ans2Obj(answers)}, {preserveState: true, preserveScroll: true,
            onSuccess: () => toast.success(t(`Answers ${filled ? "edited" : "saved"} successfully!`)),
            onError: () => toast.error(t("Failed to save answers!"))
        });
    }

    function resetState(){
        setResult([0]);
        setFilled(false);
        setInitScrollY(window.scrollY);
    };

    function gotoFRC(){
        resetState();
        analyticsEvent("continue_to_finance_readiness_check");
        router.post(route('questionnaire.load'), {type: 'frc'});
    };

    const gotoAnalyses = () => router.get(route('analyses.render'));
    const gotoHome = () => router.get(route('home.render'));

    return (
        <Layout title={questionnaire.title} auth={auth} env={env} locale={locale}>
            {questionnaire.isRDM && (
                <div className="flex flex-col items-center gap-4 text-center">
                    <h2>Recommendation-Decision Matrix Tool</h2>
                    <img src={imgMap[questionnaire.title]} className="circle-img" />
                </div>
            )}
            <form onSubmit={onSubmit} id="questionnaire-form">
                <legend className="mb-2" style={
                    colorMap[questionnaire.title] ? {color: colorMap[questionnaire.title]} : {}
                }>{t(questionnaire.title)}</legend>
                <hr />
                <div className="gap-6" children={questionnaire.questions.map((q, i) => (
                    <Question question={q} answers={questionnaire.answers} key={`q${q.id}`} num={i+1} isDebug={env.debug}/>
                ))} />
                <button type="submit" className="pp-btn-cyan">{t(`S${isEdit ? "ave & s" : ""}how results`)}</button>
            </form>
            {filled && (<>
                {questionnaire.isRDM ? (<>
                    <RDMChart percentages={result} title={questionnaire.title} onLoaded={onChartLoad} />
                    {isEdit ? ( // edit mode
                        <DLBtn />
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <DLBtn />
                            <button type="button" onClick={gotoFRC} className="pp-btn-lime">
                                {t("Continue to the Quick Finance Readiness Check")}
                            </button>
                        </div>
                    )}
                </>) : (<>
                    <FRCChart percentage={result[0]} onLoaded={onChartLoad} />
                    <DLBtn />
                </>)}
                <div className="grid grid-cols-2 gap-4">
                    {auth.user ? (
                        <button type="button" onClick={gotoAnalyses} className="pp-btn-yellow">
                            {t("My analyses")}
                        </button>
                    ) : (
                        <button type="button" className="pp-btn-yellow" disabled>
                            {t("Log in to save and view your analyses")}
                        </button>
                    )}
                    <button type="button" onClick={gotoHome} className="pp-btn-yellow">
                        {t("Start a new analysis")}
                    </button>
                </div>
                <div id="offscreen-chart-container">
                    <div>
                        {questionnaire.isRDM ? (
                            <RDMChart percentages={result} title={questionnaire.title} isOffscreen={true} />
                        ) : (
                            <FRCChart percentage={result[0]} isOffscreen={true} />
                        )}
                    </div>
                </div>
            </>)}
        </Layout>
    );
}
