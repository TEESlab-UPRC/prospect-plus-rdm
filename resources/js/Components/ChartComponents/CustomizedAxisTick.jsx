import { Text } from 'recharts';

const CustomizedAxisTick = ({ isYAxis, x, y, payload, style, className, offset = 0 }) => {
    if(isYAxis) x -= offset;
    else y += offset;

    return (
        <Text x={x} y={y} className={className} style={style} width={isYAxis ? 60 : 155} textAnchor={isYAxis ? "end" : "middle"} verticalAnchor={isYAxis ? "middle" : "start"}>
            {payload.value}
        </Text>
    );
};

export default CustomizedAxisTick;
