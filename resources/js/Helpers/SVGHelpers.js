export const cropToContent = svg => {
    const { xMin, xMax, yMin, yMax } = getBoundaries(svg);
    svg.setAttribute('viewBox', `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`);
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
    return {xMin, xMax, yMin, yMax};
}

export default {
    cropToContent,
    getBoundaries
};
