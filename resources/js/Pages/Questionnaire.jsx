import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Question from '@/Components/Question';
import RDMChart from '@/Components/RDMChart';
import FRCChart from '@/Components/FRCChart';
import ChartDLBtn from '@/Components/ChartDLBtn';
import { onPageLoad, centerTo, isCentered } from '@/Helpers/DomHelpers';
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
    'Transport & E-mobility': SectorCircleImg.Transport,
    'Lighting': SectorCircleImg.Lighting,
    'Cross Sectoral': SectorCircleImg.CrossSectoral,
    'District Heating & Cooling': SectorCircleImg.HeatingCooling,
    'Renewable Energy Projects': SectorCircleImg.RenewableEnergy
}

const colorMap = Object.fromEntries(Object.entries({
    'Public Buildings': "blue",
    'Private Buildings': "cyan",
    'Transport & E-mobility': "green",
    'Lighting': "yellow",
    'Cross Sectoral': "lime",
    'District Heating & Cooling': "light-viridian",
    'Renewable Energy Projects': "lime"
}).map(e => [e[0], getCSSVar(`pp-${e[1]}`)]));

const simplifiedAnswers = answers => answers.map(({value, dataset}) => Object.fromEntries(Object.entries({value, ...dataset}).map(e => [e[0], parseInt(e[1])])));   // to Objects, keeping only their values & related IDs
const ans2Obj = answers => Object.fromEntries(answers.map(d => [d.questionId, d.schemeId ? Object.fromEntries([[d.schemeId, d.answerId]]) : d.answerId])            // format each entry
        .reduce((a, c) => a.has(c[0]) ? Object.assign(a.get(c[0]), c[1]) && a : a.set(c[0], c[1]), new Map())); // merge multiple entries belonging to the same questions and transform entry array to object
const centerToChart = () => {
    let chart = document.getElementById("visible-chart");
    addEventListener("scrollend", function scr(){
        removeEventListener("scrollend", scr);
        if(!isCentered(chart)) centerToChart(); // retry
    });
    centerTo(chart);
};

export default function Questionnaire({ auth, env, locale, questionnaire, currentAnswers, currentEnablerAnswers, analysisTitle, isLegacyAnalysis }) {
    const isEdit = !!currentAnswers;
    const isLegacySector = !!questionnaire.isLegacy;
    const isRDM = !!questionnaire.isRDM;
    const dlQuestionnaireTitle = isRDM ? questionnaire.title : "Quick Finance Readiness Check";
    const resultFilename = [analysisTitle, dlQuestionnaireTitle, "results"].filter(e => e).join(" - ");
    const maxAns = Math.max(...questionnaire.answers.map(a => a.value));
    const ansInversionMap = Object.fromEntries(questionnaire.questions.map(q => [q.id, q.invert_ans_val]));
    const pillarMap = Object.fromEntries(questionnaire.pillars.map(p => [p.id, p]));
    const [currentAnswersState, setCurrentAnswersState] = useState(currentAnswers);
    const [initScrollY, setInitScrollY] = useState(window.scrollY);
    const [filled, setFilled] = useState(false);
    const [result, setResult] = useState([0]);
    const [currentEnablerAnswersState, setCurrentEnablerAnswersState] = useState(currentEnablerAnswers);    // TODO impl setCurrentEnablerAnswersState call
    const [enabledEnablers, setEnabledEnablers] = useState(Object.fromEntries(questionnaire.enablers.map(e => [e.id, Object.keys(currentEnablerAnswers ?? {}).includes(e.id)])));
    const { t } = useTransHelper();

    const getAnswersWithInversions = answers => answers.map(a => ansInversionMap[a.questionId] ? Object.assign({}, a, {value: maxAns - a.value}) : a);
    const reduceAns2Percent = answers => answers.reduce((a, c) => a + c.value, 0) / (answers.length * maxAns) * 100;
    const onChartLoad = () => onPageLoad(() => setTimeout(() => window.scrollY == initScrollY && centerToChart(), onChartLoadCenterDelay));

    const DLBtn = () => (<ChartDLBtn filename={resultFilename} callback={() => analyticsEvent("download_results", {
        questionnaire_title: dlQuestionnaireTitle,
        questionnaire_context: isEdit ? "later" : "initial"
    })}/>);

    useEffect(() => onPageLoad(() => {  // executed when loaded in edit mode
        if(isEdit && !filled) showResults(document.getElementById("questionnaire-form"));
    }), [currentAnswers]);

    function showResults(form){
        let answers = simplifiedAnswers(Array.from(form.querySelectorAll(".main-questionnaire-container :checked")));
        if(answers.length == 0) return;
        let answersWithInversions = getAnswersWithInversions(answers);
        if(isRDM) setResult(questionnaire.schemes.map(s => ({ // for each scheme included in this questionnaire
            'title': s.title,
            'result': reduceAns2Percent(answersWithInversions.filter(a => a.schemeId == s.id || (a.schemeId == null && s.questions.includes(a.questionId)))), // filter for included questions in scheme (and scheme, for questions requiring separate answers) and reduce answers to percentage
            'fill': colorMap[questionnaire.title]
        })));
        else setResult([reduceAns2Percent(answersWithInversions)]);
        analyticsEvent("view_results", {
            questionnaire_title: dlQuestionnaireTitle,
            questionnaire_context: isEdit ? (filled ? "later edit" : "later view") : (filled ? "initial submission edit" : "initial submission view")
        });
        setFilled(true);
        if(!env.debug && answers.length < form.getElementsByClassName("answer-list").length)
            toast.warning(t("Missing answers detected! The results might be inaccurate."), {autoClose: 10000});
        return answers;
    }

    function onSubmit(e){
        e.preventDefault();
        let answers = showResults(e.target);
        if(!answers) return;
        setInitScrollY(window.scrollY);
        centerToChart();
        answers = ans2Obj(answers);
        setCurrentAnswersState(answers);
        if(auth.user) router.post(route('questionnaire.store'), {answers}, {preserveState: true, preserveScroll: true,
            onSuccess: () => toast.success(t(`Answers ${filled ? "edited" : "saved"} successfully!`)),
            onError: () => toast.error(t("Failed to save answers!"))
        });
    }

    function onEnablerPresenceAnswerChange(e){
        let el = e.target;
        setEnabledEnablers(Object.assign({}, enabledEnablers, {[el.dataset.answerId]: el.checked}));
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
            {isRDM && (
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
                <div className="gap-5 main-questionnaire-container" children={(!isRDM || isLegacyAnalysis) ? questionnaire.questions.map((q, i) => (
                    <Question question={q} answers={questionnaire.answers} schemes={questionnaire.schemes} currentAnswers={currentAnswersState} key={`q${q.id}`} num={i+1} required={!env.debug}/>
                )) : Object.entries(Object.groupBy(questionnaire.questions, q => q.pillar_id)).map(([pID, Qs]) => (
                    <div className="flex flex-col gap-5 mt-1" key={`pq${pID}`}>
                        <h3 className="text-xl font-bold text-gray-700">{pillarMap[pID].title}</h3>
                        <div className="flex flex-col gap-5">{...Qs.map((q, i) => (
                            <Question question={q} answers={questionnaire.answers} schemes={questionnaire.schemes} currentAnswers={currentAnswersState} key={`q${q.id}`} num={i+1} required={!env.debug}/>
                        ))}</div>
                    </div>
                ))} />
                {(isRDM && !isLegacyAnalysis) && (<>
                    <hr />
                    <div className="enablers-container">
                        <h2 className="text-2xl font-bold text-gray-700">{t("Institutional Enablers")}</h2>
                        <Question question={{id: 0, note: t("Presence (Screening)"), question: t("Are any of the following institutional enablers operating in or near your municipality?")}}
                                answers={questionnaire.enablers.map((e, i) => ({id: e.id, value: i, answer: e.title}))}
                                onChange={onEnablerPresenceAnswerChange}
                                currentAnswers={Object.entries(enabledEnablers).filter(e => e[1]).map(e => e[0])}
                                required={false} multipleAllowed={true} />
                        <div className="flex flex-col gap-5">
                            {questionnaire.enablers.filter(e => enabledEnablers[e.id]).map(e => (
                                <div className="flex flex-col gap-5 mt-1" key={`e${e.id}`}>
                                    <h3 className="text-xl font-bold text-gray-700">{e.title}</h3>
                                    <div className="flex flex-col gap-5">
                                        {e.questions.map((q, i) => (
                                            <Question question={q} answers={q.answers} currentAnswers={currentEnablerAnswersState} key={`eq${q.id}`} num={i+1} required={!env.debug}/>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>)}
                <button type="submit" className="mt-2 pp-btn-cyan">{t(`S${isEdit ? "ave & s" : ""}how results`)}</button>
            </form>
            {filled && (<>
                    <RDMChart percentages={result} title={questionnaire.title} onLoaded={onChartLoad} />
                {isRDM ? (<>
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
                            <RDMChart percentages={result} title={questionnaire.title} isOffscreen={true} />
                        {isRDM ? (
                        ) : (
                            <FRCChart percentage={result[0]} isOffscreen={true} />
                        )}
                    </div>
                </div>
            </>)}
        </Layout>
    );
}
