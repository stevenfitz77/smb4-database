import { CHEMISTRY_ICONS } from "../constants";

function ChemistryLabel({ chemistry, text }) {
    if (!chemistry) return <span>{text}</span>;

    return (
        <span className="chemistry-label">
            <img src={CHEMISTRY_ICONS[chemistry]} alt="chemistry-icon" className="chemistry-icon" />
            {text}
        </span>
    )
}

export default ChemistryLabel;