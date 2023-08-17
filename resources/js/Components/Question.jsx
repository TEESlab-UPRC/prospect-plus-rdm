import useTransHelper from "@/Helpers/TransHelpers";

const Question = ({ question, answers, num, isDebug }) => {
    const { t } = useTransHelper();

    return (
        <div className="grid grid-cols-1 gap-1">
            <label className="grid grid-cols-1 gap-1">
                <div className="text-lg text-gray-700" dangerouslySetInnerHTML={{__html: `${num}. ${t(question.question)}`}} />
                {question.note ? (<div className="text-base italic text-gray-500" dangerouslySetInnerHTML={{__html: t(question.note)}} />) : null}
            </label>
            <div children={answers.map(a => (
                <div key={`q${question.id}a${a.id}`} >
                    <label className="pp-input">
                        <input type="radio" className="pp-input" name={`q${question.id}`} value={a.value} {...(isDebug ? {} : {required: true})}/>
                        <span className={`ml-3 text-base italic font-semibold text-gray-700`} data-answer-id={a.id}>{t(a.answer)}</span>
                    </label>
                </div>
            ))} />
        </div>
    );
};

export default Question;
