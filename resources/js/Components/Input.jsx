const Input = ({ name, label = null, options = {}, type = "text", defaultValue = null, checked = null, error = null, errorObj = {}, ...props }) => {
    error = error ?? errorObj[name];
    checked = checked ?? defaultValue;

    return (
        <div className={`flex ${type == "checkbox" ? "flex-row items-center gap-2 pp-checkbox" : "flex-col-reverse gap-1 pp-input"}`}>
            {error && (<p className="text-sm pp-fg-red">{error}</p>)}
            {options.length > 0 ? (
                <select {...props} name={name} id={name} defaultValue={defaultValue ?? (required ? null : "N/A")} children={
                    options.map(v => (<option key={`${name}-${v}`} value={v}>{v}</option>))
                            .concat(required ? [] : [<option key={`${name}-N/A`} value="N/A">N/A</option>])
                }/>
            ) : (
                type == "checkbox" ? (
                    <input {...props} type="checkbox" name={name} id={name} checked={checked}/>
                ) : (
                    <input {...props} type={type} name={name} id={name} defaultValue={defaultValue}/>
                )
            )}
            {label && (<label htmlFor={name} className="pp-text">{label}</label>)}
        </div>
    );
};

export default Input;
