import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { useEffect, useRef, useState } from 'react';
import { forClassEls, setClassStyle } from '../Helpers/DomHelpers';
import { getCSSVar, getTextWidth } from '../Helpers/RenderHelpers';
import { getBoundaries } from '../Helpers/SVGHelpers';
import CustomizedAxisTick from '@/Components/ChartComponents/CustomizedAxisTick';
import { PPLearningHandbooksLink } from '@/Components/ExtLink';
import useTransHelper from '@/Helpers/TransHelpers';

const lg = 0.3;     // msg vertical line gap mod

const getMsg = t => t(`
    Thank you for using the PROSPECT+ Decision Matrix Tool to check which financing scheme will be the most suitable for your local authority to implement the planned
    or ongoing local sustainable energy project for your city. Please note that all results have been automatically determined based on your answers, indicating an ease of
    implementation rate (%) for each available financing scheme against the general framework conditions. More information on the set of financing alternatives is also
    available on the PROSPECT+ :PPLearningHandbooksLink.
`, {PPLearningHandbooksLink: (<PPLearningHandbooksLink style={{ fill: getCSSVar("pp-cyan") }} dominantBaseline="auto" noStyle={true} text={t("Learning Handbooks")}/>)});

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

const onResize = (w, h, colNum, id) => {
    setClassStyle(`pp-${id}-rtitle`, s => s.fontSize = `${w / 50}px`);
    setClassStyle(`pp-${id}-rval`, s => s.fontSize = `${w / 75}px`);
    setClassStyle(`pp-${id}-rschemes`, s => s.fontSize = `${w / (colNum * 15)}px`);
    setClassStyle(`pp-${id}-rlabel`, s => s.fontSize = `${w / 85}px`);
    scaleMsg(id);
    svgAutoCropY();
};

const RDMChart = ({ percentages, title, onLoaded = null, isOffscreen = false }) => {
    const { t } = useTransHelper();
    const [loaded, setLoaded] = useState(false);
    const barRef = useRef(null);
    const fontFamily = getCSSVar("pp-font-sans");
    const id = isOffscreen ? "offscreen-chart" : "visible-chart";

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

    useEffect(() => scaleMsg(id), [getMsg(t)]);

    return (<div className="grid grid-cols-1" id={id}>
        <svg className="mx-5 svg-autocrop-y" height="100%" style={{ width: "calc(100% - 2.5rem)", fontFamily: fontFamily }}>
            <g className="svg-autoscale" children={getMsg(t).split(/[\r\n]+/).map((h, i) => (
                <text data-msg-line={i} className={`pp-${id}-rmsg`} key={`chartmsg-${i}`} x={0} y={i * 22} dominantBaseline="hanging" textAnchor="left" style={{ fontSize: 16, fill: '#777' }} dangerouslySetInnerHTML={{__html: h}}/>)
            )}/>
        </svg>
        <svg className={`${isOffscreen ? "my-4" : "my-2"} svg-autocrop-y`} width="100%" height="100%" style={{ fontFamily: fontFamily }}>
            <text x="50%" y={6} textAnchor="middle" dominantBaseline="hanging" className={`pp-${id}-rtitle`} style={{ fontWeight: 'bold', fill: '#777' }}>{t(title)}</text>
        </svg>
        <ResponsiveContainer aspect={2} width="100%" onResize={(w, h) => onResize(w, h, percentages.length, id)}>
            <BarChart title={title} label={title} width={400} height={400} data={percentages} margin={(isOffscreen ? {top: 30, bottom: 20, right: 8, left: 4} : {top: 15, bottom: 8})} style={{ fontFamily: fontFamily }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="title" interval={0} tick={<CustomizedAxisTick isYAxis={false} className={`pp-${id}-rschemes`} style={{ fontWeight: 'bold' }} offset={isOffscreen ? 8 : 2}/>}/>
                <YAxis fontSize={15} domain={[0, 100]} tickCount={11} interval="preserveStartEnd" tick={<CustomizedAxisTick isYAxis={true} className={`pp-${id}-rval`} offset={isOffscreen ? 4 : 1}/>}/>
                <Bar {...(isOffscreen ? {animationDuration: 0} : {})} onAnimationStart={onAnimationStart} ref={barRef} dataKey="result" fill="#0b2870" className={`pp-${id}-rlabel`}>
                    <LabelList dataKey="result" position="top" offset={isOffscreen ? 8 : 4} formatter={Math.round}/>
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>);
}

export default RDMChart;
