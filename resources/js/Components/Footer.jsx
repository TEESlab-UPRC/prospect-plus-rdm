import MiscImg from "@/../img/misc/MiscImg";

const Footer = () => (
    <footer>
        <div className="footer-disclaimer">
            <img src={MiscImg.EuropeanFlag}/>
            The PROSPECT+ project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 101023271.
            The content of this page is for information purpose only. The relevant legal instruments and the text of the call shall take precedence over the
            information contained in this page. The European Commission or CINEA does not accept responsibility for any use made of the information contained therein.
        </div>
    </footer>
);

export default Footer;
