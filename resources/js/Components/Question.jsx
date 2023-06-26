const Question = ({ question, answers }) => {
    return (
        <div className="grid grid-cols-1 gap-1">
            <label className="grid grid-cols-1 gap-1">
                <div className="text-lg text-gray-700" dangerouslySetInnerHTML={{__html: question.question}} />
                {question.note ? (<div className="text-base italic text-gray-500" dangerouslySetInnerHTML={{__html: question.note}} />) : null}
            </label>
            <div children={answers.map(a => (
                <div className="radio" key={`q${question.id}a${a.id}`} >
                    <label className="pp-input">
                        <input type="radio" className="pp-input" name={`q${question.id}`} value={a.value} /> {/* TODO make answers required */}
                        <span className="ml-3 text-base italic font-semibold text-gray-700">{a.answer}</span>
                    </label>
                </div>
            ))} />
        </div>
    );
};

export default Question;
