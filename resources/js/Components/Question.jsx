import useTransHelper from "@/Helpers/TransHelpers";

const Question = ({ question, answers, schemes, currentAnswers, num, isDebug }) => {
    const currentAns = currentAnswers ? currentAnswers[question.id] : null;
    const { t } = useTransHelper();

    const AnswerList = ({ ansKeyPrefix, scheme = null }) => {
        const isCurrentAns = answer => {
            return currentAns != null && (scheme == null ? currentAns : currentAns[scheme.id]) == answer.id;
        };

        return (
            <div className="grid grid-cols-1 gap-1 answer-list">
                {scheme && (<span className="text-base font-semibold pp-fg-cyan">{scheme.title}</span>)}
                <div className="flex flex-row flex-wrap gap-x-4" children={answers.map(a => (
                    <div key={`${ansKeyPrefix}a${a.id}`} >
                        <label className="pp-input">
                            <input type="radio" className="pp-input" name={ansKeyPrefix} value={a.value} {...(isDebug ? {} : {required: true})}
                                    data-question-id={question.id} data-scheme-id={scheme == null ? null : scheme.id} data-answer-id={a.id}
                                    {...(isCurrentAns(a) ? {defaultChecked: true} : {})} />
                            <span className="ml-1 text-base italic font-semibold text-gray-700 align-middle">{t(a.answer)}</span>
                        </label>
                    </div>
                ))} />
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 gap-1">
            <div className="grid grid-cols-1 gap-1">
                <div className="text-lg text-gray-700" dangerouslySetInnerHTML={{__html: `${num}. ${t(question.question)}`}} />
                {question.note ? (<div className="text-base italic text-gray-500" dangerouslySetInnerHTML={{__html: t(question.note)}} />) : null}
            </div>
            {question.split_scheme_answers ? (
                <div className="flex flex-row flex-wrap mx-8 gap-y-6 gap-x-12" children={
                    schemes.filter(s => s.questions.includes(question.id)).map(s => [s, `q${question.id}s${s.id}`]).map(m => (
                        <AnswerList ansKeyPrefix={m[1]} key={m[1]} scheme={m[0]} />
                    ))
                } />
            ) : (<AnswerList ansKeyPrefix={`q${question.id}`} />)}
        </div>
    );
};

export default Question;
