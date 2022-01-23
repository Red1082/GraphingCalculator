const map = (x, xMin, xMax, yMin, yMax, constrain) => {
    const y = (x - xMin) / (xMax - xMin) * (yMax - yMin) + yMin;
    return constrain ? Math.max(Math.min(y, yMax), yMin) : y;
};

export { map };