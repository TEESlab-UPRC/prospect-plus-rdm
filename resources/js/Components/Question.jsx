import useTransHelper from "@/Helpers/TransHelpers";
import { num2Letter } from '@/Helpers/RenderHelpers';

const AnswerList = ({ questionID, ansKeyPrefix, answers, currentAns, required, scheme = null, questionnaireID = null, num = 0, multipleAllowed = false, onChange = null }) => {
    const isCurrentAns = answer => currentAns != null && (multipleAllowed ? (currentAns ?? []).includes(answer.id) : (scheme == null ? currentAns : currentAns[scheme.id]) == answer.id);
    const { t } = useTransHelper();

    return (
        <div className="grid grid-cols-1 gap-1 answer-list">
            {scheme && (<span className="text-base font-semibold pp-fg-cyan">{`${num > 0 ? `${num2Letter(num)}. ` : ""}${scheme.title}`}</span>)}
            <div className="flex flex-row flex-wrap gap-x-4" children={answers.map(a => (
                <div key={`${ansKeyPrefix}a${a.id}`} >
                    <label className="pp-input">
                        <input type={multipleAllowed ? "checkbox" : "radio"} className="pp-input" name={ansKeyPrefix} {...(a.value != null ? {value: a.value} : {})} {...(required ? {required: true} : {})}
                                data-question-id={questionID} data-scheme-id={scheme == null ? null : scheme.id} data-answer-id={a.id} data-questionnaire-id={questionnaireID}
                                {...(isCurrentAns(a) ? {defaultChecked: true} : {})} {...(onChange ? {onChange} : {})} />
                        <span className="ml-1 text-base italic font-semibold text-gray-700 align-middle">{t(a.answer)}</span>
                    </label>
                </div>
            ))} />
        </div>
    );
};

const Question = ({ question, answers, currentAnswers, required, schemes = [], questionnaireID = null, num = null, multipleAllowed = false, onChange = null}) => {
    const currentAns = currentAnswers ? currentAnswers[question.id] : null;
    const commonAnsListProps = {answers, currentAns, required, multipleAllowed, onChange, questionnaireID, questionID: question.id};
    const { t } = useTransHelper();

    return (
        <div className="grid grid-cols-1 gap-1">
            <div className="grid grid-cols-1 gap-1">
                <div className="text-lg text-gray-700" dangerouslySetInnerHTML={{__html: `${num != null ? `${num}. ` : ''}${t(question.question)}`}} />
                {question.note ? (<div className="text-base italic text-gray-500" dangerouslySetInnerHTML={{__html: t(question.note)}} />) : null}
            </div>
            {question.split_scheme_answers ? (
                <div className="flex flex-row flex-wrap mx-8 gap-y-6 gap-x-12" children={
                    schemes.filter(s => s.questions.includes(question.id)).map(s => [s, `q${question.id}s${s.id}`]).map((m, i) => (
                        <AnswerList ansKeyPrefix={m[1]} key={m[1]} scheme={m[0]} num={i+1} {...commonAnsListProps} />
                    ))
                } />
            ) : (<AnswerList ansKeyPrefix={`q${question.id}`} {...commonAnsListProps} />)}
        </div>
    );
};

export default Question;
