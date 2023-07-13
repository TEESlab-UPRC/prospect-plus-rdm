const Input = ({ name, label = null, options = {}, type = "text", defaultValue = null, checked = null, error = null, errorObj = {}, status = null, formObj = {}, onChange = null, ...props }) => {
    errorObj = formObj.errors ?? errorObj;
    error = error ?? errorObj[name];
    defaultValue = defaultValue ?? (formObj.data ? formObj.data[name] : null);
    checked = checked ?? defaultValue;

    var onChangeD = e => {
        onChange && onChange(e);
        formObj.setData && formObj.setData(name, e.target.value);
    };

    return (
        <div className={`flex ${type == "checkbox" ? "flex-row items-center gap-2 pp-checkbox" : "flex-col-reverse gap-1 pp-input"}`}>
            {status && (<p className="text-sm pp-fg-green">{status}</p>)}
            {error && (<p className="text-sm pp-fg-red">{error}</p>)}
            {options.length > 0 ? (
                <select {...props} name={name} id={name} defaultValue={defaultValue ?? (required ? null : "N/A")} onChange={onChangeD} children={
                    options.map(v => (<option key={`${name}-${v}`} value={v}>{v}</option>))
                            .concat(required ? [] : [<option key={`${name}-N/A`} value="N/A">N/A</option>])
                }/>
            ) : (
                type == "checkbox" ? (
                    <input {...props} type="checkbox" name={name} id={name} checked={checked} onChange={onChangeD}/>
                ) : (
                    <input {...props} type={type} name={name} id={name} defaultValue={defaultValue} onChange={onChangeD}/>
                )
            )}
            {label && (<label htmlFor={name} className="pp-text">{label}</label>)}
        </div>
    );
};

export default Input;
