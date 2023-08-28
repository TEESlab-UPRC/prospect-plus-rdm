import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { forClassEls, setClassStyle } from '../Helpers/DomHelpers';
import { getCSSVar, getTextWidth } from '../Helpers/RenderHelpers';
import { getBoundaries } from '../Helpers/SVGHelpers';
import CustomizedAxisTick from '@/Components/ChartComponents/CustomizedAxisTick';
import useTransHelper from '@/Helpers/TransHelpers';

const h = 1.35, r = 2;  // bar rendering modifiers
const lg = 0.3;        // msg vertical line gap mod

const FRCResponses = [
    ["good", `
        Great! You have gathered and prepared all or most of the relevant information needed. Your project is financially ready.
        You can now approach investors of financing institutions or proceed with setting up your planned financing scheme.
    `],
    ["mid", `
        You are almost there. Please make sure to provide the missing information about your planned project so that investors can quickly and easily understand
        what the project is about. This includes most importantly the planned measures and the anticipated energy savings or renewable energy produced resulting
        from these measures. You should also consider risks your project might face and assess challenging and supporting regulations within your country that
        have an effect on your planned project.
    `],
    ["bad", `
        More information required. You still lack much for the required information before you can consider your project financially ready.
        Please make sure to prepare the missing information. The more information you have prepared the easier it will be to obtain financial means for your project.
    `]
].map(e => [getCSSVar(`pp-frc-resp-${e[0]}-color`), e[1]]);

const FRCBar = ({ fill, x, y, width, height }) => {
    let nh = height * h, nw = nh / r;
    y -= (nh - height) / 2;
    x += width - nw / 2;
    return (<path d={`M${x},${y} L${x + nw},${y} L${x + nw},${y + nh} L${x},${y + nh} Z`} fill={fill} />);
};

const FRCLabel = ({x, y, width, height, value}) => {
    let nw = height * h / r;
    x += width - nw / 2;
    return (<text x={x + nw / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle" style={{ fontWeight: 'bold' }}>{Math.round(value)}</text>);
};

const svgAutoCropY = () => Array.from(document.getElementsByClassName("svg-autocrop-y")).forEach(svg => {
    const { yMin, height } = getBoundaries(svg);
    svg.setAttribute('viewBox', `0 ${yMin} ${svg.parentElement.clientWidth} ${height}`);
    svg.setAttribute('height', height);
});

const scaleG = (el, maxH) => {
    const sRect = el.parentElement.getBoundingClientRect();     // <svg>
    const sW = sRect.width, sH = sRect.height;
    const gW = Math.max(...Array.from(el.children).map(t => {   // max <text> text width in <g>
        let s = getComputedStyle(t);
        return getTextWidth(t.textContent, s.fontSize, s.fontFamily);
    }));
    const wR = sW / gW;
    const newSH = sH * wR;
    if(newSH <= maxH) el.style.transform = `scale(${wR})`;
};

const scaleMsg = id => {
    let maxH = 0;
    forClassEls(`pp-${id}-rmsg`, el => {
        let fs = el.parentElement.parentElement.getBoundingClientRect().width / 72;
        let lh = fs * (lg + 1);
        let ml = +el.dataset.msgLine;
        maxH = lh * (ml + 1);
        el.style.fontSize = `${fs}px`
        el.setAttribute("y", lh * ml); // adjust y pos
    });
    maxH -= lg;
    Array.from(document.getElementById(id).getElementsByClassName("svg-autoscale")).forEach(el => scaleG(el, maxH));
};

const onResize = (w, h, id) => {
    setClassStyle(`pp-${id}-rtitle`, s => s.fontSize = `${w / 50}px`);
    setClassStyle(`pp-${id}-rtick`, s => s.fontSize = `${w / 75}px`);
    setClassStyle(`pp-${id}-rlabel`, s => s.fontSize = `${w / 90}px`);
    scaleMsg(id);
    svgAutoCropY();
};


const FRCChart = ({ percentage, title = "Quick Finance Readiness Check", onLoaded = null, isOffscreen = false }) => {
    const { t } = useTransHelper();
    const [loaded, setLoaded] = useState(false);
    const barRef = useRef(null);
    const fontFamily = getCSSVar("pp-font-sans");
    const id = isOffscreen ? "offscreen-chart" : "visible-chart";
    const resp = percentage >= 75 ? FRCResponses[0] : (percentage > 50 ? FRCResponses[1] : FRCResponses[2]);

    const patchLabel = () => {  // patch for recharts lib bug: sometimes the animation end event doesn't fire, which causes the label to not appear
        let bar = barRef.current;
        if(bar) setTimeout(() => bar.state.isAnimationFinished || bar.handleAnimationEnd(), bar.props.animationDuration);
    };

    const onAnimationStart = () => {
        patchLabel();
        if(loaded) return;
        onLoaded && onLoaded();
        setLoaded(true);
    };

    useEffect(() => {
        svgAutoCropY();
        patchLabel();
    });

    useEffect(() => scaleMsg(id), [t(resp[1])]);

    return (<div className="grid grid-cols-1" id={id}>
        <svg className={`${isOffscreen ? "mb-11" : "mb-6"} svg-autocrop-y`} width="100%" height="100%" style={{ fontFamily: fontFamily }}>
            <text x="50%" y={6} textAnchor="middle" dominantBaseline="hanging" className={`pp-${id}-rtitle`} style={{ fontWeight: 'bold', fill: '#777' }}>{title}</text>
        </svg>
        <ResponsiveContainer aspect={8} width="100%" onResize={(w, h) => onResize(w, h, id)}>
            <BarChart title={title} label={title} width={200} height={400} data={[{value: percentage}]} layout='vertical' barCategoryGap="20%" margin={(isOffscreen ? {left: 50, right: 50, bottom: 8} : {left: 25, right: 25, bottom: 2})} style={{ fontFamily: fontFamily }}>
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="red" />
                        <stop offset="33%" stopColor="orange" />
                        <stop offset="66%" stopColor="yellow" />
                        <stop offset="100%" stopColor="green" />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <ReferenceLine x={50} stroke="#ff9600" strokeDasharray="5 5" strokeWidth={2} />
                <ReferenceLine x={75} stroke="#7dbe00" strokeDasharray="5 5" strokeWidth={2} />
                <XAxis type="number" domain={[0, 100]} tickCount={11} interval="preserveStartEnd" tick={<CustomizedAxisTick className={`pp-${id}-rtick`} isYAxis={false} offset={isOffscreen ? 8 : 2}/>} />
                <YAxis type="category" hide />
                <Bar {...(isOffscreen ? {animationDuration: 0} : {})} onAnimationStart={onAnimationStart} ref={barRef} dataKey="value" fill="#0b2870" background={{fill: "url(#gradient)"}} shape={<FRCBar />} className={`pp-${id}-rlabel`}>
                    <LabelList dataKey="value" content={FRCLabel}/>
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        <svg className={`${isOffscreen ? "mx-10 mt-4" : "mx-5"} svg-autocrop-y`} height="100%" style={{ width: `calc(100% - ${isOffscreen ? "5" : "2.5"}rem)`, fontFamily: fontFamily }}>
            <g className="svg-autoscale" children={t(resp[1]).split(/[\r\n]+/).map((s, i) => {
                return (<text data-msg-line={i} className={`pp-${id}-rmsg`} key={`chartmsg-${i}`} x={0} y={i * 22} dominantBaseline="hanging" textAnchor="left" style={{ fontSize: 16, fill: resp[0] }}>{s.trim()}</text>);
            })}/>
        </svg>
    </div>);
}

export default FRCChart;
