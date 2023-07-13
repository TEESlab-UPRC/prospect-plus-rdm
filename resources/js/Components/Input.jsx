import { useState } from "react";

const Input = ({ name, label = null, options = {}, type = "text", defaultValue = null, checked = null, error = null, errorObj = {}, status = null, formObj = {}, onChange = null, onAnimationStart = null, autoComplete = null, ...props }) => {
    const [autoFillReverted, setAutoFillReverted] = useState(false);

    errorObj = formObj.errors ?? errorObj;
    error = error ?? errorObj[name];
    defaultValue = defaultValue ?? (formObj.data ? formObj.data[name] : null);
    checked = checked ?? defaultValue;
    if (options.length > 0 && !defaultValue && required) defaultValue = "N/A";

    var onChangeD = e => {
        onChange && onChange(e);
        formObj.setData && formObj.setData(name, e.target.value);
    };

    var onAnimationStartAF = e => {                                                                 // autocomplete = "off" gets ignored in most browsers :(
        onAnimationStart && onAnimationStart(e);                                                    // when life gives you lemons...
        if(autoFillReverted || e.animationName != "onAutoFill" || autoComplete != "off") return;    // MAKE LIFE TAKE THE LEMONS BACK!
        let el = e.target;                                                                          // GET MAD!!!! (╯°□°）╯︵ ┻━┻
        el.value = defaultValue;                                                                    // ...and emulate the behavior you want
        el.dispatchEvent(new InputEvent('input'));                                                  // also, this is needed to get FF to remove the yellow bg :)
        setAutoFillReverted(true);                                                                  // and don't revert the next autofill, which could be manually performed at the user's discretion, instead of onLoad
    };                                                                                              // Note: this takes advantage of a dummy animation "onAutoFill" - see: app.css

    return (
        <div className={`flex ${type == "checkbox" ? "flex-row items-center gap-2 pp-checkbox" : "flex-col-reverse gap-1 pp-input"}`}>
            {status && (<p className="text-sm pp-fg-green">{status}</p>)}
            {error && (<p className="text-sm pp-fg-red">{error}</p>)}
            {options.length > 0 ? (
                <select {...props} name={name} id={name} defaultValue={defaultValue} onChange={onChangeD} autoComplete={autoComplete} onAnimationStart={onAnimationStartAF} children={
                    options.map(v => (<option key={`${name}-${v}`} value={v}>{v}</option>))
                            .concat(required ? [] : [<option key={`${name}-N/A`} value="N/A">N/A</option>])
                }/>
            ) : (
                type == "checkbox" ? (
                    <input {...props} type="checkbox" name={name} id={name} checked={checked} onChange={onChangeD} onAnimationStart={onAnimationStart}/>
                ) : (
                    <input {...props} type={type} name={name} id={name} defaultValue={defaultValue} onChange={onChangeD} autoComplete={autoComplete} onAnimationStart={onAnimationStartAF}/>
                )
            )}
            {label && (<label htmlFor={name} className="pp-text">{label}</label>)}
        </div>
    );
};

export default Input;
