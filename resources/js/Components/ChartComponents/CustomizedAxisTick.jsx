import { Text } from 'recharts';
import { SchemePDF } from '@/Constants/Websites';
import { SVGCompatExtLink } from '@/Components/ExtLink';

const schemePdfMap = {
    'Citizens Financing - Cooperatives/Crowdfunding': SchemePDF.CooperativesCrowdfunding,
    'EPC': SchemePDF.EPC,
    'Green Bonds': SchemePDF.GreenBonds,
    'Guarantee Funds': SchemePDF.GuaranteeFunds,
    'Interacting/Internal Contracting': SchemePDF.Interacting,
    'Revolving Funds': SchemePDF.RevolvingFunds,
    'Soft Loans': SchemePDF.SoftLoans,
    '3rd Party Financing': SchemePDF.ThirdPartyFinancing
}

const CustomizedAxisTick = ({ isYAxis, x, y, payload, style, className, offset = 0 }) => {
    if(isYAxis) x -= offset;
    else y += offset;

    let text = payload.value
    let pdfLink = schemePdfMap[text];
    let props = {x, y, className, style, width: isYAxis ? 60 : 155, textAnchor: isYAxis ? "end" : "middle"};

    return (<g style={style}>{  // for inner <a> to inherit fill, when downloading
        pdfLink ? (
            <SVGCompatExtLink {...props} chartCompat={true} verticalanchor={isYAxis ? "middle" : "start"} dest={pdfLink} text={text}/>
        ) : (
            <Text {...props} verticalAnchor={isYAxis ? "middle" : "start"}>{text}</Text>
        )
    }</g>);
};

export default CustomizedAxisTick;
