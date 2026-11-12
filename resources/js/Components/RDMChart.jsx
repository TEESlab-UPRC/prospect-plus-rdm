import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { forClassEls, setClassStyle } from '../Helpers/DomHelpers';
import { getCSSVar, getTextWidth } from '../Helpers/RenderHelpers';
import { getBoundaries } from '../Helpers/SVGHelpers';
import CustomizedAxisTick from '@/Components/ChartComponents/CustomizedAxisTick';
import { PPLearningHandbooksLink } from '@/Components/ExtLink';
import useTransHelper from '@/Helpers/TransHelpers';

const lg = 0.3;     // msg vertical line gap mod

const getMsg = t => t(`
    Thank you for using the PROSPECT Decision Matrix Tool to check which financing scheme will be the most suitable for your local authority to implement the planned
    or ongoing local sustainable energy project for your city. Please note that all results have been automatically determined based on your answers, indicating an ease of
    implementation rate (%) for each available financing scheme against the general framework conditions. More information on the set of financing alternatives is also
    available on the PROSPECT :PPLearningHandbooksLink.
`, {PPLearningHandbooksLink: (<PPLearningHandbooksLink text={t("Learning Handbooks")}/>)});

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
    scaleMsg(id);
    svgAutoCropY();
}

const onBarResize = (w, h, colNum, id) => {
    onResize(w, h, id);
    setClassStyle(`pp-${id}-bar-rval`, s => s.fontSize = `${w / 75}px`);
    setClassStyle(`pp-${id}-bar-rschemes`, s => s.fontSize = `${w / (colNum * 15)}px`);
    setClassStyle(`pp-${id}-bar-rlabel`, s => s.fontSize = `${w / 85}px`);
};

const onRadarResize = (w, h, id) => {
    setClassStyle(`pp-${id}-radar-rval`, s => s.fontSize = `${w / 105}px`);
    setClassStyle(`pp-${id}-radar-rpillars`, s => s.fontSize = `${w / 95}px`);
};

const getContainerRect = (id, key) => {
    let rect = document.getElementById(`pp-${id}-${key}-container`).getBoundingClientRect();
    return [rect.width, rect.height];
}

const RDMChart = ({ barChartPercentages, radarChartPercentages, radarChartColor, title, onLoaded = null, isOffscreen = false }) => {
    const { t } = useTransHelper();
    const [allLoaded, setAllLoaded] = useState(false);
    const [loaded, setLoaded] = useState({bar: false, radar: false});
    const fontFamily = getCSSVar("pp-font-sans");
    const id = isOffscreen ? "offscreen-chart" : "visible-chart";

    const markLoaded = (key) => {
        if(allLoaded || loaded[key]) return;
        setLoaded(Object.assign(loaded, {[key]: true}));
        if(Object.values(loaded).every(v => v)){
            onLoaded && onLoaded();
            setAllLoaded(true);
        }
    };

    useEffect(() => {
        svgAutoCropY();
    });

    useEffect(() => scaleMsg(id), [getMsg(t)]);

    return (<div className="grid grid-cols-1 place-items-center" id={id}>
        <svg className="mx-5 svg-autocrop-y" height="100%" style={{ width: "calc(100% - 2.5rem)", fontFamily: fontFamily }}>
            <g className="svg-autoscale" children={getMsg(t).split(/[\r\n]+/).map((h, i) => (
                <text data-msg-line={i} className={`pp-${id}-rmsg`} key={`chartmsg-${i}`} x={0} y={i * 22} dominantBaseline="hanging" textAnchor="left" style={{ fontSize: 16, fill: '#777' }} dangerouslySetInnerHTML={{__html: h}}/>)
            )}/>
        </svg>
        <svg className={`${isOffscreen ? "my-4" : "my-2"} svg-autocrop-y`} width="100%" height="100%" style={{ fontFamily: fontFamily }}>
            <text x="50%" y={6} textAnchor="middle" dominantBaseline="hanging" className={`pp-${id}-rtitle`} style={{ fontWeight: 'bold', fill: '#777' }}>{t(title)}</text>
        </svg>
        <ResponsiveContainer aspect={2} width="100%" onResize={(w, h) => onBarResize(w, h, barChartPercentages.length, id)} id={`pp-${id}-bar-container`}>
            <BarChart title={title} label={title} width={400} height={400} data={barChartPercentages} margin={(isOffscreen ? {top: 30, bottom: 20, right: 8, left: 4} : {top: 15, bottom: 8})} style={{ fontFamily: fontFamily }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="title" interval={0} tick={<CustomizedAxisTick isYAxis={false} className={`pp-${id}-bar-rschemes`} style={{ fontWeight: 'bold', fill: '#777' }} offset={isOffscreen ? 8 : 2}/>}/>
                <YAxis fontSize={15} domain={[0, 100]} tickCount={11} interval="preserveStartEnd" tick={<CustomizedAxisTick isYAxis={true} className={`pp-${id}-bar-rval`} offset={isOffscreen ? 4 : 1}/>}/>
                <Bar {...(isOffscreen ? {animationDuration: 0} : {})} onAnimationStart={() => {onRadarResize(...getContainerRect(id, 'bar'), barChartPercentages.length, id); markLoaded('bar');}} dataKey="result" fill="#0b2870">
                    <LabelList dataKey="result" position="top" offset={isOffscreen ? 8 : 4} formatter={Math.round} className={`pp-${id}-bar-rlabel`}/>
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer aspect={1.5} width="100%" onResize={(w, h) => onRadarResize(w, h, id)} id={`pp-${id}-radar-container`}>
            <RadarChart outerRadius="95%" data={radarChartPercentages} className={isOffscreen ? "my-4" : "my-2"} style={{ fontFamily: fontFamily }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="pillar" className={`pp-${id}-radar-rpillars`} style={{ fontWeight: 'bold' }} tick={<CustomizedAxisTick className={`pp-${id}-radar-rpillars`} style={{ fontWeight: 'bold' }} isRadial={true} offset={isOffscreen ? 10 : 5} />} />
                <PolarRadiusAxis axisLine={false} angle={90} domain={[0, 100]} tickCount={11} orientation='left' tick={<CustomizedAxisTick tickFormatter={v => `${v}%`} className={`pp-${id}-radar-rval`} style={{ fill: '#999', fontWeight: 'bold' }} isYAxis={true} offset={isOffscreen ? 8 : 6} />} unit='%' />
                <Radar {...(isOffscreen ? {animationDuration: 0} : {})} onAnimationStart={() => {onRadarResize(...getContainerRect(id, 'radar'), id); markLoaded('radar');}} dataKey="score" fill={radarChartColor} fillOpacity={0.3} stroke={radarChartColor} strokeWidth={isOffscreen ? 4 : 3} />
            </RadarChart>
        </ResponsiveContainer>
    </div>);
}

export default RDMChart;
