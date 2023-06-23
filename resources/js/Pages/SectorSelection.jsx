import { Head } from '@inertiajs/react';
import SectorImg from '@/../img/sectors/SectorImg';
import PostLink from '@/Components/PostLink';

const ImgLink = ({img, dest}) => (
    <PostLink href={route('questionnaire.load')} data={{type: 'rdm', title: dest}} child={
        <img width={320} className="m-1" src={img}/>
    }/>
);

export default function SectorSelection({ data }) {
    return (
        <>
            <Head title="Sector Selection"/>
            <div className="pp-outer-container">
                <div className="pp-inner-container">
                    <div>
                        <div className="flex justify-center">
                            <ImgLink img={SectorImg.PublicBuildings} dest="Public Buildings"/>
                            <ImgLink img={SectorImg.PrivateBuildings} dest="Private Buildings"/>
                            <ImgLink img={SectorImg.Transport} dest="Transport"/>
                        </div>
                        <div className="flex justify-center">
                            <ImgLink img={SectorImg.PublicLighting} dest="Public Lighting"/>
                            <ImgLink img={SectorImg.CrossSectoral} dest="Cross Sectoral"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
