import { saveAs } from 'file-saver';

const defMargin = {top: 10, bottom: 10, left: 10, right: 10};

const dlChart = (filename, margin = {}, transparency = false) => {
    // Get elements and their properties
    const svgWrapper = document.getElementById("downloadable-chart");   // parent "chart" div
    const svgEls = Array.from(svgWrapper.getElementsByTagName("svg"));
    const wRect = svgWrapper.getBoundingClientRect();
    // General init
    const URL = window.URL || window.webkitURL || window;
    const xmlSerial = new XMLSerializer();
    const m = Object.assign({}, defMargin, margin);
    const xOffset = m.left - wRect.x;
    const yOffset = m.top - wRect.y;
    // Init canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = svgWrapper.clientWidth + m.right + m.left;
    canvas.height = svgWrapper.clientHeight + m.top + m.bottom;
    // Paint bg
    ctx.fillStyle = "white";
    if(!transparency) ctx.fillRect(0, 0, canvas.width, canvas.height);
    Promise.all(svgEls.map(svgElO => new Promise(resolve => {   // preload images
        // create clone SVG with solidified properties
        const svgEl = svgElO.cloneNode(true);
        const rect = svgElO.getBoundingClientRect();    // get bounding rectangle from original, since the clone is zeroed
        svgEl.setAttribute("width", rect.width);        // to replace any percentages - important to render properly
        svgEl.setAttribute("height", rect.height);
        // apply extra changes on clone
        Array.from(svgEl.getElementsByTagName("a")).forEach(el => el.style.fill = "inherit");   // remove link colors
        // begin SVG -> image conversion
        const svgURL = xmlSerial.serializeToString(svgEl);
        const svgBlob = new Blob([svgURL], {type: "image/svg+xml;charset=url-8"});
        const img = new Image();
        img.onload = () => {resolve({image: img, rect: rect})};
        img.src = URL.createObjectURL(svgBlob);
    }))).then(results => {  // after all images have been loaded, draw them, convert canvase -> PNG & save
        results.forEach(({image, rect}) => ctx.drawImage(image, xOffset + rect.x, yOffset + rect.y, rect.width, rect.height)); // synchronous
        canvas.toBlob(png => saveAs(png, filename + ".png"), "image/png", 1.0);
    });
}

const ChartDLBtn = ({filename = "results", text = "Download results", className = "pp-btn-green", margin={}}) => {
    return (<button type="button" onClick={() => dlChart(filename, margin)} className={className}>{text}</button>);
}

export default ChartDLBtn;
