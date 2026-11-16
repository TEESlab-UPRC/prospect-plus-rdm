export const cropToContent = (svg, setHeightAttr = false, setWidthAttr = false) => {
    const { xMin, xMax, yMin, yMax, width, height } = getBoundaries(svg);
    setDimensions(svg, xMin, yMin, width, height, true, setHeightAttr, setWidthAttr);
    return {xMin, xMax, yMin, yMax, width, height};
};

export const getBoundaries = (svg) => {
    const { x: rootX, y: rootY } = svg.getBoundingClientRect();
    let { xMin, xMax, yMin, yMax, vpXMin, vpYMin } = [...svg.children].reduce((acc, el) => {
        const { x, y } = el.getBBox();
        const { x: vpX, y: vpY, width, height } = el.getBoundingClientRect();
        if (!acc.xMin || x < acc.xMin) acc.xMin = x;
        if (!acc.xMax || x + width > acc.xMax) acc.xMax = x + width;
        if (!acc.yMin || y < acc.yMin) acc.yMin = y;
        if (!acc.yMax || y + height > acc.yMax) acc.yMax = y + height;
        if (!acc.vpXMin || vpX < acc.vpXMin) acc.vpXMin = vpX;
        if (!acc.vpYMin || vpY < acc.vpYMin) acc.vpYMin = vpY;
        return acc;
    }, {});
    const rootMargin = { x: (vpXMin - xMin) - rootX, y: (vpYMin - yMin) - rootY };
    xMax += rootMargin.x * 2;
    yMax += rootMargin.y * 2;
    return { xMin, xMax, yMin, yMax, width: xMax - xMin, height: yMax - yMin };
};

export const setDimensions = (svg, xMin, yMin, width, height, setViewBox = true, setHeight = false, setWidth = false) => {
    if(setViewBox) svg.setAttribute('viewBox', `${xMin} ${yMin} ${width} ${height}`);
    if(setHeight) svg.setAttribute('height', height);
    if(setWidth) svg.setAttribute('width', width);
};

export default {
    cropToContent,
    getBoundaries,
    setDimensions
};
