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
const centerToChart = () => centerTo(document.getElementById("downloadable-chart"));


export default function Questionnaire({ auth, questionnaire, currentAnswers }) {
    const isEdit = !!currentAnswers;
    const maxAns = Math.max(...questionnaire.answers.map(a => a.value));
    const [filled, setFilled] = useState(false);
    const [result, setResult] = useState([0]);

    const reduceAns2Percent = answers => answers.map(a => parseInt(a.value)).reduce((p, n) => p + n, 0) / (answers.length * maxAns) * 100;

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
        if(auth.user) router.post(route('questionnaire.store'), {answers: ans2Obj(answers)}, {preserveState: true, preserveScroll: true,
            onSuccess: () => toast.success(`Answers ${filled ? "edited" : "saved"} successfully!`),
            onError: () => toast.error("Failed to save answers!")
        });
    }

    function resetState(){
        setResult([0]);
        setFilled(false);
    };

    function gotoFRC(){
        resetState();   // TODO confirm it works with weird flows
        router.post(route('questionnaire.load'), {type: 'frc'});
    };

    const gotoAnalyses = () => router.get(route('analyses.render'));
    const gotoHome = () => router.get(route('home.render'));

    return (
        <Layout title={questionnaire.title} auth={auth}>
            {questionnaire.isRDM && (
                <div className="flex flex-col items-center gap-4">
                    <h2>Recommendation-Decision Matrix Tool</h2>
                    <img src={imgMap[questionnaire.title]} className="circle-img" />
                </div>
            )}
            <form onSubmit={onSubmit} id="questionnaire-form">
                <legend className="mb-2" style={
                    colorMap[questionnaire.title] ? {color: colorMap[questionnaire.title]} : {}
                }>{questionnaire.title}</legend>
                <div className="gap-6" children={questionnaire.questions.map((q, i) => (
                    <Question question={q} answers={questionnaire.answers} key={`q${q.id}`} num={i+1}/>
                ))} />
                <button type="submit" className="pp-btn-cyan">{`S${isEdit ? "ave & s" : ""}how results`}</button>
            </form>
            {filled && (<>
                {questionnaire.isRDM ? (<>
                    <RDMChart percentages={result} title={questionnaire.title} onLoaded={centerToChart} />
                    {isEdit ? ( // edit mode
                        <ChartDLBtn filename={`${questionnaire.title} - results`} />
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <ChartDLBtn filename={`${questionnaire.title} - results`} />
                            <button type="button" onClick={gotoFRC} className="pp-btn-lime">
                                Continue to the Quick Finance Readiness Check
                            </button>
                        </div>
                    )}
                </>) : (<>
                    <FRCChart percentage={result[0]} onLoaded={centerToChart} />
                    <ChartDLBtn filename="Quick Finance Readiness - results" />
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
            </>)}
        </Layout>
    );
}
