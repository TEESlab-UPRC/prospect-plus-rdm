import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ZIndexLayer, Rectangle, Label, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { forClassEls, setClassStyle } from '../Helpers/DomHelpers';
import { getCSSVar, getTextWidth, postAnimFrame } from '../Helpers/RenderHelpers';
import { cropToContent, getBoundaries, setDimensions } from '../Helpers/SVGHelpers';
import CustomizedAxisTick from '@/Components/ChartComponents/CustomizedAxisTick';
import { PPLearningHandbooksLink } from '@/Components/ExtLink';
import useTransHelper from '@/Helpers/TransHelpers';
import { useMemo } from 'react';
import { Fragment } from 'react';

const lg = 0.3;     // msg vertical line gap mod

const getMsg = t => t(`
    Thank you for using the PROSPECT Decision Matrix Tool to check which financing scheme will be the most suitable for your local authority to implement the planned
    or ongoing local sustainable energy project for your city. Please note that all results have been automatically determined based on your answers, indicating an ease of
    implementation rate (%) for each available financing scheme against the general framework conditions. More information on the set of financing alternatives is also
    available on the PROSPECT :PPLearningHandbooksLink.
`, {PPLearningHandbooksLink: (<PPLearningHandbooksLink text={t("Learning Handbooks")}/>)});

const svgAutoCrop = id => Array.from(document.getElementById(id).getElementsByClassName("svg-autocrop")).forEach(svg =>  cropToContent(svg, true, true));

const svgAutoCropY = id => Array.from(document.getElementById(id).getElementsByClassName("svg-autocrop-y")).forEach(svg => {
    const { yMin, height } = getBoundaries(svg);
    setDimensions(svg, 0, yMin, svg.parentElement.clientWidth, height, true, true, false);
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

const onTextsResize = (w, h, id) => {
    postAnimFrame(() => {
        setClassStyle(`pp-${id}-rtitle`, s => s.fontSize = `${w / 50}px`);
        postAnimFrame(() => {
            svgAutoCropY(id);
            postAnimFrame(() => scaleMsg(id));
        });
    });
}

const onLegendResize = (w, id, stackNum) => {
    postAnimFrame(() => {
        setClassStyle(`pp-${id}-bar-legend-rlabel`, s => s.fontSize = `${w / 110}px`);
        postAnimFrame(() => svgAutoCrop(id));
    });
};

const onBarResize = (w, h, baseColNum, stackNum, id) => {
    onTextsResize(w, h, id);
    setClassStyle(`pp-${id}-bar-rval`, s => s.fontSize = `${w / 75}px`);
    setClassStyle(`pp-${id}-bar-rschemes`, s => s.fontSize = `${w / (baseColNum * 15)}px`);
    setClassStyle(`pp-${id}-bar-rlabel`, s => s.fontSize = `${w / 85}px`);
    onLegendResize(w, id, stackNum);
};

const onRadarResize = (w, h, id) => {
    setClassStyle(`pp-${id}-radar-rval`, s => s.fontSize = `${w / 105}px`);
    setClassStyle(`pp-${id}-radar-rpillars`, s => s.fontSize = `${w / 95}px`);
};

const getContainerRect = (id, key) => {
    let rect = document.getElementById(`pp-${id}-${key}-container`).getBoundingClientRect();
    return [rect.width, rect.height];
}

const ExtendedBaseBar = ({ x, width, ...props }) => (<Rectangle {...props} x={x - 1} width={width + 1}/>);  // patch to fill gaps from rendering imperfections by extending a pixel to the left (skipped for first segment/bar)

const BaseBarLabel = ({ enablerNum, width, ...props }) => (<Label {...props} dx={(Math.max(enablerNum, 1) - 1) * width / 2} width={width}/>);   // Base bar label added to first segment/bar only and then centered according to the total width

const LegendText = (id, value, entry, index, props) => (<svg {...props} className='svg-autocrop'>
    <text className={`pp-${id}-bar-legend-rlabel`} dominantBaseline="hanging" x={0} y={0}>{value}</text>
</svg>);

const RDMChart = ({ barChartPercentages, radarChartPercentages, baseColor, title, enablers, onLoaded = null, isOffscreen = false }) => {
    const enablerIdKeyMap = useMemo(() => Object.fromEntries(enablers.map(e => e.id).sort((a, b) => a - b).map((id, i) => [id, i + 1])), [enablers]);
    const enablerTitles = useMemo(() => Object.fromEntries(enablers.map(e => [e.id, e.title])), [enablers]);
    const enablerValIDs = useMemo(() => Array.from(new Set(barChartPercentages.flatMap(e => Object.keys(e.enablers)))), [barChartPercentages]);
    const enablerColors = useMemo(() => Object.fromEntries(enablerValIDs.map(eID => [eID, getCSSVar(`pp-enabler-${enablerIdKeyMap[eID]}`)])), [enablerValIDs]);
    const enablerTitleKey = useMemo(() => Object.fromEntries(Object.entries(enablerTitles).map(([id, t]) => [t, enablerIdKeyMap[id]])), [enablerTitles]);
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
        svgAutoCropY(id);
        svgAutoCrop(id);
    }, [title, enablerValIDs]);

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
        <ResponsiveContainer aspect={2} width="100%" onResize={(w, h) => onBarResize(w, h, barChartPercentages.length, enablerValIDs.length, id)} id={`pp-${id}-bar-container`} className="chart-legend-mods">
            <BarChart title={title} label={title} width={400} height={400} data={barChartPercentages} barGap={0} margin={(isOffscreen ? {top: 30, bottom: 20, right: 8, left: 4} : {top: 15, bottom: 8})} style={{ fontFamily: fontFamily }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="title" interval={0} tick={<CustomizedAxisTick isYAxis={false} className={`pp-${id}-bar-rschemes`} style={{ fontWeight: 'bold', fill: '#777' }} offset={isOffscreen ? 8 : 2}/>}/>
                <YAxis fontSize={15} domain={[0, 100]} tickCount={11} interval="preserveStartEnd" tick={<CustomizedAxisTick isYAxis={true} className={`pp-${id}-bar-rval`} offset={isOffscreen ? 4 : 1}/>}/>
                <>{enablerValIDs.map((eID, ei) => {
                    let enablerKey = `enabler-${enablerIdKeyMap[eID]}`;
                    return (<Fragment key={`bar-stack-${enablerKey}`}>
                        <Bar name="Base Score" {...(isOffscreen ? {animationDuration: 0} : {})} stackId={enablerKey} dataKey="result" fill={baseColor} {...(ei > 0 ? {shape: ExtendedBaseBar, legendType: 'none'} : {onAnimationStart: () => { onBarResize(...getContainerRect(id, 'bar'), barChartPercentages.length, enablerValIDs.length, id); markLoaded('bar'); }})}>
                            {ei == 0 && (
                                <LabelList dataKey="result" position="insideTop" offset={isOffscreen ? 12 : 10} content={props => BaseBarLabel({enablerNum: enablerValIDs.length, ...props})} formatter={Math.round} fill="#fff" className={`pp-${id}-bar-rlabel`} background={{ rx: 10, padding: { x: 6, y: 2 }, fillOpacity: 0.2, fill: '#000' }}/>
                            )}
                        </Bar>
                        <ZIndexLayer zIndex={1}>
                            <Bar name={enablerTitles[eID]} {...(isOffscreen ? {animationDuration: 0} : {})} stackId={enablerKey} dataKey={d => d.enablers[eID]} fill={enablerColors[eID]} legendType='triangle'>
                                <LabelList dataKey={d => d.enablers[eID]} position="top" offset={isOffscreen ? 8 : 4} formatter={Math.round} fill={enablerColors[eID]} className={`pp-${id}-bar-rlabel`}/>
                            </Bar>
                        </ZIndexLayer>
                    </Fragment>);
                })}</>
                <Legend itemSorter={({ value }) => enablerTitleKey[value] ?? -1} formatter={(value, entry, index) => LegendText(id, value, entry, index, { style: { fontFamily: fontFamily, fill: '#777' } })} />
            </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer aspect={1.5} width="100%" onResize={(w, h) => onRadarResize(w, h, id)} id={`pp-${id}-radar-container`}>
            <RadarChart outerRadius="95%" data={radarChartPercentages} className={isOffscreen ? "my-4" : "my-2"} style={{ fontFamily: fontFamily }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="pillar" className={`pp-${id}-radar-rpillars`} style={{ fontWeight: 'bold' }} tick={<CustomizedAxisTick className={`pp-${id}-radar-rpillars`} style={{ fontWeight: 'bold' }} isRadial={true} offset={isOffscreen ? 10 : 5} />} />
                <PolarRadiusAxis axisLine={false} angle={90} domain={[0, 100]} tickCount={11} orientation='left' tick={<CustomizedAxisTick tickFormatter={v => `${v}%`} className={`pp-${id}-radar-rval`} style={{ fill: '#999', fontWeight: 'bold' }} isYAxis={true} offset={isOffscreen ? 8 : 6} />} unit='%' />
                <Radar {...(isOffscreen ? {animationDuration: 0} : {})} onAnimationStart={() => {onRadarResize(...getContainerRect(id, 'radar'), id); markLoaded('radar');}} dataKey="score" fill={baseColor} fillOpacity={0.3} stroke={baseColor} strokeWidth={isOffscreen ? 4 : 3} />
            </RadarChart>
        </ResponsiveContainer>
    </div>);
}

export default RDMChart;
