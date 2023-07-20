import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Question from '@/Components/Question';
import RDMChart from '@/Components/RDMChart';
import FRCChart from '@/Components/FRCChart';
import ChartDLBtn from '@/Components/ChartDLBtn';
import { onPageLoad, centerTo, getCSSVar } from '@/Helpers/DomHelpers';
import Layout from '@/Layouts/GeneralLayout';
import { toast } from 'react-toastify';
import SectorCircleImg from '@/../img/sectors/SectorCircleImg';

const editChartCenterDelay = 200;

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

const ans2Obj = answers => Object.fromEntries(answers.map(el => [parseInt(el.name.substr(1)), el.parentElement.innerText.trim()]));
const centerToChart = () => centerTo(document.getElementById("visible-chart"));


export default function Questionnaire({ auth, env, questionnaire, currentAnswers, analysisTitle }) {
    const isEdit = !!currentAnswers;
    const resultFilename = [analysisTitle, questionnaire.isRDM ? questionnaire.title : "Quick Finance Readiness Check", "results"].filter(e => e).join(" - ");
    const maxAns = Math.max(...questionnaire.answers.map(a => a.value));
    const [filled, setFilled] = useState(false);
    const [result, setResult] = useState([0]);

    const reduceAns2Percent = answers => answers.map(a => parseInt(a.value)).reduce((p, n) => p + n, 0) / (answers.length * maxAns) * 100;
    const onChartLoad = () => setTimeout(() => window.scrollY == 0 && centerToChart(), editChartCenterDelay);

    useEffect(() => onPageLoad(() => {  // executed when loaded in edit mode
        if(!isEdit || filled) return;
        let form = document.getElementById("questionnaire-form");
        let formEls = form.elements;
        Object.entries(currentAnswers).map(
                e => Array.from(formEls["q" +  e[0]].values())                      // get question's inputs
                        .filter(el => el.parentElement.innerText.trim() == e[1])[0] // get selected answer
                ).forEach(el => el.checked = true);
        showResults(form);
    }), [currentAnswers]);

    function showResults(form){
        let answers = Array.from(form.querySelectorAll(":checked"));
        if(answers.length == 0) return;
        if(questionnaire.isRDM) setResult(questionnaire.schemes.map((s, i) => ({                                // for each scheme included in this questionnaire
            'title': s.title,
            'result': reduceAns2Percent(answers.filter(a => s.questions.includes(parseInt(a.name.substr(1))))), // filter for included questions in scheme and reduce answers to percentage
            'fill': colorMap[questionnaire.title]
        })));
        else setResult([reduceAns2Percent(answers)]);
        setFilled(true);
        return answers;
    }

    function onSubmit(e){
        e.preventDefault();
        let answers = showResults(e.target);
        centerToChart();
        if(auth.user && answers) router.post(route('questionnaire.store'), {answers: ans2Obj(answers)}, {preserveState: true, preserveScroll: true,
            onSuccess: () => toast.success(`Answers ${filled ? "edited" : "saved"} successfully!`),
            onError: () => toast.error("Failed to save answers!")
        });
    }

    function resetState(){
        setResult([0]);
        setFilled(false);
    };

    function gotoFRC(){
        resetState();
        router.post(route('questionnaire.load'), {type: 'frc'});
    };

    const gotoAnalyses = () => router.get(route('analyses.render'));
    const gotoHome = () => router.get(route('home.render'));

    return (
        <Layout title={questionnaire.title} auth={auth} env={env}>
            {questionnaire.isRDM && (
                <div className="flex flex-col items-center gap-4 text-center">
                    <h2>Recommendation-Decision Matrix Tool</h2>
                    <img src={imgMap[questionnaire.title]} className="circle-img" />
                </div>
            )}
            <form onSubmit={onSubmit} id="questionnaire-form">
                <legend className="mb-2" style={
                    colorMap[questionnaire.title] ? {color: colorMap[questionnaire.title]} : {}
                }>{questionnaire.title}</legend>
                <hr />
                <div className="gap-6" children={questionnaire.questions.map((q, i) => (
                    <Question question={q} answers={questionnaire.answers} key={`q${q.id}`} num={i+1} isDebug={env.debug}/>
                ))} />
                <button type="submit" className="pp-btn-cyan">{`S${isEdit ? "ave & s" : ""}how results`}</button>
            </form>
            {filled && (<>
                {questionnaire.isRDM ? (<>
                    <RDMChart percentages={result} title={questionnaire.title} onLoaded={onChartLoad} />
                    {isEdit ? ( // edit mode
                        <ChartDLBtn filename={resultFilename} />
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <ChartDLBtn filename={resultFilename} />
                            <button type="button" onClick={gotoFRC} className="pp-btn-lime">
                                Continue to the Quick Finance Readiness Check
                            </button>
                        </div>
                    )}
                </>) : (<>
                    <FRCChart percentage={result[0]} onLoaded={onChartLoad} />
                    <ChartDLBtn filename={resultFilename} />
                </>)}
                <div className="grid grid-cols-2 gap-4">
                    {auth.user ? (
                        <button type="button" onClick={gotoAnalyses} className="pp-btn-yellow">
                            My analyses
                        </button>
                    ) : (
                        <button type="button" className="pp-btn-yellow" disabled>
                            Log in to save and view your analyses
                        </button>
                    )}
                    <button type="button" onClick={gotoHome} className="pp-btn-yellow">
                        Start a new analysis
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
