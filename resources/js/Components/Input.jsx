const Input = ({ name, label, options = {}, type = "text", required = false }) => {
    return (
        <div className="flex flex-col-reverse gap-1">
            {options.length > 0 ? (
                <select name="plan" required={required} defaultValue={required ? null : "N/A"} children={
                    options.map(v => (<option key={`${name}-${v}`} value={v}>{v}</option>))
                            .concat(required ? [] : [<option key={`${name}-N/A`} value="N/A">N/A</option>])
                }/>
            ) : (<input type={type} name={name} id={name} required={required}/>)}
            <label htmlFor={name} className="text-base text-gray-700">{label}</label>
        </div>
    );
};

export default Input;
