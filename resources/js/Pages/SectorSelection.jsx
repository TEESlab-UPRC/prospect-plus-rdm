import SectorImg from '@/../img/sectors/SectorImg';
import PostLink from '@/Components/PostLink';
import useTransHelper from '@/Helpers/TransHelpers';
import Layout from '@/Layouts/GeneralLayout';

const ImgLink = ({img, dest}) => (
    <PostLink href={route('questionnaire.load')} data={{type: 'rdm', title: dest}} child={
        <img src={img}/>
    }/>
);

export default function SectorSelection({ auth, env, locale }) {
    const { t } = useTransHelper();

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
