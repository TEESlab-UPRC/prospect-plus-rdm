import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { useEffect, useRef, useState } from 'react';
import { setClassStyle } from '../Helpers/DomHelpers';
import { getBoundaries } from '../Helpers/SVGHelpers';
import CustomizedAxisTick from '@/Components/ChartComponents/CustomizedAxisTick';

const msg = [
    "Thank you for using the PROSPECT+ Decision Matrix Tool to check which financing scheme will be the most suitable for your local authority to implement the planned or",
    "ongoing local sustainable energy project for your city. Please note that all results have been automatically determined based on your answers, indicating an ease of",
    "implementation rate (%) for each available financing scheme against the general framework conditions. More information on the set of financing alternatives is also",
    (<><tspan>available on the PROSPECT+ </tspan><a href="https://h2020prospect.eu/learning-handbooks" target="_blank" style={{ fill: '#009999' }}>Learning Handbooks</a><tspan>.</tspan></>)
];

const svgAutocropY = () => Array.from(document.getElementsByClassName("svg-autocrop-y")).forEach(svg => {
    const { yMin, yMax } = getBoundaries(svg);
    svg.setAttribute('viewBox', `0 ${yMin} ${svg.parentElement.clientWidth} ${yMax - yMin}`);
    svg.setAttribute('height', yMax - yMin);
});

const onResize = (w, h, colNum) => {
    setClassStyle("pp-rtitle", s => s.fontSize = `${w / 50}px`);
    setClassStyle("pp-rval", s => s.fontSize = `${w / 75}px`);
    setClassStyle("pp-rschemes", s => s.fontSize = `${w / (colNum * 14)}px`);
    setClassStyle("pp-rlabel", s => s.fontSize = `${w / 85}px`);
    setClassStyle("pp-rmsg", s => s.transform = `scale(${w / 1250})`);
    svgAutocropY();
};

const RDMChart = ({ percentages, title, onLoaded = null }) => {
    const [loaded, setLoaded] = useState(false);
    const barRef = useRef(null);

    const patchLabel = () => {  // patch for recharts lib bug: sometimes the animation end event doesn't fire, which causes the label to not appear
        let bar = barRef.current;
        if(bar) setTimeout(() => bar.state.isAnimationFinished || bar.handleAnimationEnd(), bar.props.animationDuration * 1.5);
    };

    useEffect(() => {
        svgAutocropY();
        patchLabel();
        if(loaded) return;
        onLoaded && setTimeout(onLoaded, 1000); // TODO improve?
        setLoaded(true);
    });

    return (<div className="grid grid-cols-1" id="downloadable-chart">
        <svg className="mx-5 svg-autocrop-y" width="100%" height="100%" fontFamily="Arial">
            <g className="pp-rmsg" children={msg.map((s, i) => (
                <text key={`chartmsg-${i}`} x={0} y={i * 22} dominantBaseline="hanging" textAnchor="left" style={{ fontSize: 16, fill: '#777' }} children={s}></text>)
            )}/>
        </svg>
        <svg className="my-2 svg-autocrop-y" width="100%" height="100%" fontFamily="Arial">
            <text x="50%" y={6} textAnchor="middle" dominantBaseline="hanging" className="pp-rtitle" style={{ fontWeight: 'bold', fill: '#777' }}>{title}</text>
        </svg>
        <ResponsiveContainer aspect={2} width="100%" onResize={(w, h) => onResize(w, h, percentages.length)}>
            <BarChart id="downloadable-chart" title={title} label={title} width={400} height={400} data={percentages} margin={{top: 15, bottom: 6}} style={{ fontFamily: 'Arial' }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="title" interval={0} tick={<CustomizedAxisTick isYAxis={false} className="pp-rschemes" style={{ fontWeight: 'bold', fontFamily: 'Arial' }}/>}/>
                <YAxis fontSize={15} domain={[0, 100]} tickCount={11} interval="preserveStartEnd" tick={<CustomizedAxisTick isYAxis={true} className="pp-rval" style={{ fontFamily: 'Arial' }}/>}/>
                <Bar onAnimationStart={patchLabel} ref={barRef} dataKey="result" fill="#0b2870" className="pp-rlabel">
                    <LabelList dataKey="result" position="top" offset={4} formatter={Math.round} style={{ fontFamily: 'Arial' }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>);
}

export default RDMChart;
