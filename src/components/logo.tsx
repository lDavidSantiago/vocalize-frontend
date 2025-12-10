import logoSrc from "../assets/images/logo.png";

const Logo = () => {
    return (
        <div className="w-15 h-10">
            <img src={logoSrc} alt="Vocalice Logo" className="w-full h-full object-contain" />
        </div>
    );
}

export default Logo;