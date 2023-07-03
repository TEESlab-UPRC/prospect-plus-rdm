import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Question from '@/Components/Question';
import RDMChart from '@/Components/RDMChart';
import FRCChart from '@/Components/FRCChart';
import ChartDLBtn from '@/Components/ChartDLBtn';
import { onPageLoad, centerTo } from '@/Helpers/DomHelpers';
import Layout from '@/Layouts/GeneralLayout';

export default function Questionnaire({ auth, questionnaire, currentAnswers }) {
    const isEdit = !!currentAnswers;
    const maxAns = Math.max(...questionnaire.answers.map(a => a.value));
    const [filled, setFilled] = useState(false);
    const [result, setResult] = useState([0]);

    const colorMap = {
        'Public Buildings': ["#1f326a", "#2e4a9e"],
        'Private Buildings': ["#0c9e9d", "#075f5f"],
        'Transport': ["#038d44", "#024a24"],
        'Public Lighting': ["#fed800", "#b39800"],
        'Cross Sectoral': ["#9cb93a", "#72882b"]
    };
    // const golden_angle = 137.507764;
    // const color_start = 2;
    // const getColor = i => `hsl(${((color_start + i) * golden_angle) % 360}, 64%, 40%)`;

    const reduceAns2Percent = answers => answers.map(a => parseInt(a.value)).reduce((p, n) => p + n, 0) / (answers.length * maxAns) * 100;

    const ans2Obj = answers => Object.fromEntries(answers.map(el => [parseInt(el.name.substr(1)), el.parentElement.innerText.trim()]));

    const centerToChart = () => centerTo(document.getElementById("downloadable-chart"));

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

    function showResults(form){   // TODO scroll to bottom?
        let answers = Array.from(form.querySelectorAll(":checked"));
        if(answers.length == 0) return;
        if(questionnaire.isRDM) setResult(questionnaire.schemes.map((s, i) => ({                                // for each scheme included in this questionnaire
            'title': s.title,
            'result': reduceAns2Percent(answers.filter(a => s.questions.includes(parseInt(a.name.substr(1))))), // filter for included questions in scheme and reduce answers to percentage
            // 'fill': getColor(i)
            // 'fill': colorMap[questionnaire.title][i % 2]
            'fill': colorMap[questionnaire.title][0]
        })));
        else setResult([reduceAns2Percent(answers)]);
        setFilled(true);
        return answers;
    }

    function onSubmit(e){
        e.preventDefault();
        let answers = showResults(e.target);
        centerToChart();
        if(auth.user) router.post(route('questionnaire.store'), {answers: ans2Obj(answers)}, {preserveState: true, preserveScroll: true});
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
            <form onSubmit={onSubmit} id="questionnaire-form">
                <legend style={
                    colorMap[questionnaire.title] ? {color: colorMap[questionnaire.title][0]} : {}
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
