export const cropToContent = svg => {
    const { xMin, xMax, yMin, yMax, width, height } = getBoundaries(svg);
    svg.setAttribute('viewBox', `${xMin} ${yMin} ${width} ${height}`);
    return {xMin, xMax, yMin, yMax, width, height};
};

export const getBoundaries = svg => {
    const { xMin, xMax, yMin, yMax } = [...svg.children].reduce((acc, el) => {
        const { x, y } = el.getBBox();
        const { width, height } = el.getBoundingClientRect();
        if (!acc.xMin || x < acc.xMin) acc.xMin = x;
        if (!acc.xMax || x + width > acc.xMax) acc.xMax = x + width;
        if (!acc.yMin || y < acc.yMin) acc.yMin = y;
        if (!acc.yMax || y + height > acc.yMax) acc.yMax = y + height;
        return acc;
    }, {});
    return {xMin, xMax, yMin, yMax, width: xMax - xMin, height: yMax - yMin};
}

export default {
    cropToContent,
    getBoundaries
};
