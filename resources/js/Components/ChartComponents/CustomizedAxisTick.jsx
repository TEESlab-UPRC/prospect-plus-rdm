import { Text } from 'recharts';

const CustomizedAxisTick = ({ isYAxis, x, y, payload, style, className }) => (
    <Text x={x} y={y} className={className} style={style} width={isYAxis ? 60 : 155} textAnchor={isYAxis ? "end" : "middle"} verticalAnchor={isYAxis ? "middle" : "start"}>
        {payload.value}
    </Text>
);

export default CustomizedAxisTick;
