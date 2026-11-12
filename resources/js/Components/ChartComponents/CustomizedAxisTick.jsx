import { Text } from 'recharts';
import { SchemePDF } from '@/Constants/Websites';
import { SVGCompatExtLink } from '@/Components/ExtLink';

const schemePdfMap = {
    'Citizens Finance': SchemePDF.CooperativesCrowdfunding,
    'EPC': SchemePDF.EPC,
    'Green Bonds': SchemePDF.GreenBonds,
    'Guarantee Funds': SchemePDF.GuaranteeFunds,
    'Internal Contracting': SchemePDF.Interacting,
    'Revolving Funds': SchemePDF.RevolvingFunds,
    'Soft Loans': SchemePDF.SoftLoans,
    'Third-Party Financing': SchemePDF.ThirdPartyFinancing
}

const CustomizedAxisTick = ({ isYAxis, x, y, cx, cy, payload, style, className, offset = 0, tickFormatter = undefined, isRadial = false, visibleTicksCount: visibletickscount, ...otherProps }) => {
    if(isRadial){
        x += Math.sign(x - cx) * offset;
        y += Math.sign(y - cy) * offset;
    }else{
        if(isYAxis) x -= offset;
        else y += offset;
    }

    let text = payload.value
    let pdfLink = schemePdfMap[text];
    let props = {...otherProps, x, y, cx, cy, className, style, ...(isRadial ? {} : {width: isYAxis ? 60 : 155, textAnchor: isYAxis ? "end" : "middle", verticalAnchor: isYAxis ? "middle" : "start"})};
    let formattedText = tickFormatter ? tickFormatter(text) : text;

    return (<g style={style}>{  // for inner <a> to inherit fill, when downloading
        pdfLink ? (
            <SVGCompatExtLink {...props} chartCompat={true} dest={pdfLink} text={formattedText}/>
        ) : (
            <Text {...props}>{formattedText}</Text>
        )
    }</g>);
};

export default CustomizedAxisTick;
