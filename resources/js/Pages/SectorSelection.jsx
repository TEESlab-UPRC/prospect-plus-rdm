import SectorImg from '@/../img/sectors/SectorImg';
import PostLink from '@/Components/PostLink';
import { onPageLoad } from '@/Helpers/DomHelpers';
import { postAnimFrame } from '@/Helpers/RenderHelpers';
import useTransHelper from '@/Helpers/TransHelpers';
import Layout from '@/Layouts/GeneralLayout';
import { useEffect } from 'react';

const ratiosAreClose = (f1, f2) => Math.abs(f1 - f2) < 0.0001;

const transSTc = (c, pWR = 10, pHR = 10) => {
    const cB = c.getBoundingClientRect();
    const t = c.children[0];
    const cW = cB.width, cH = cB.height;
    const tW = t.clientWidth, tH = t.clientHeight;
    const wR = cW / tW, hR = cH / tH;
    t.style.transform = `translateY(-50%) scale(${Math.min(wR, hR)})`;
    if(!(ratiosAreClose(pWR, wR) && ratiosAreClose(pHR, hR)))
        postAnimFrame(() => transSTc(c, wR, hR));
}

const transST = root => Array.from(root.getElementsByClassName("sector-title-container")).forEach(c => transSTc(c));

export default function SectorSelection({ auth, env, locale }) {
    const { t } = useTransHelper();
    var animFrame = null;
    var contW = -1;

    useEffect(() => onPageLoad(() => {
        const cont = document.body.getElementsByClassName("sector-select")[0];
        contW = cont.getBoundingClientRect().width;
        document.body.onresize = () => {
            const cW = cont.getBoundingClientRect().width;
            if(contW == cW) return;
            contW = cW;
            if(animFrame){
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
            animFrame = postAnimFrame(() => transST(document.body));
        };
    }), []);

    const ImgLink = ({img, dest}) => (
        <PostLink href={route('questionnaire.load')} data={{type: 'rdm', title: dest}} child={
            <>
                <img src={img} onLoad={e => transST(e.target.parentElement)}/>
                <div className="sector-title-container"><span>{t(dest)}</span></div>
            </>
        }/>
    );

    return (
        <Layout title="Sector Selection" auth={auth} env={env} locale={locale} className="text-center">
            <h2>Recommendation-Decision Matrix Tool</h2>
            <h3>{t("Select sector for your analysis:")}</h3>
            <div className="sector-select">
                <div>
                    <ImgLink img={SectorImg.PublicBuildings} dest="Public Buildings"/>
                    <ImgLink img={SectorImg.PrivateBuildings} dest="Private Buildings"/>
                    <ImgLink img={SectorImg.Transport} dest="Transport"/>
                </div>
                <div>
                    <ImgLink img={SectorImg.PublicLighting} dest="Public Lighting"/>
                    <ImgLink img={SectorImg.CrossSectoral} dest="Cross Sectoral"/>
                </div>
            </div>
        </Layout>
    );
}
