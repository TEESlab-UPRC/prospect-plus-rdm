const Input = ({ name, label, options = {}, type = "text", required = false, defaultValue = null, autoComplete = null, placeholder = null, error = null }) => {
    return (
        <div className={`flex ${type == "checkbox" ? "flex-row items-center gap-2" : "flex-col-reverse gap-1"}`}>
            {error && (<p className="text-sm pp-fg-red">{error}</p>)}
            {options.length > 0 ? (
                <select name={name} id={name} required={required} defaultValue={defaultValue ?? (required ? null : "N/A")} children={
                    options.map(v => (<option key={`${name}-${v}`} value={v}>{v}</option>))
                            .concat(required ? [] : [<option key={`${name}-N/A`} value="N/A">N/A</option>])
                }/>
            ) : (
                type == "checkbox" ? (
                    <input type="checkbox" name={name} id={name} checked={defaultValue}/>
                ) : (
                    <input type={type} name={name} id={name} defaultValue={defaultValue} autoComplete={autoComplete} placeholder={placeholder} required={required}/>
                )
            )}
            <label htmlFor={name} className="pp-text">{label}</label>
        </div>
    );
};

export default Input;
