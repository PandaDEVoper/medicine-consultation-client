import React from "react";
import Navigation from "../components/navigation";
import GoBackIcon from "../components/go-back-icon";
import SupportPage from "../../support";
import "../styles.scss";

const SupportSettingsPage: React.FC = () => {
    return <main className="support-page settings-page">
        <Navigation active="/support" />
        <GoBackIcon/>
        <section className="content support">
            <SupportPage/>
        </section>
    </main>
}

export default SupportSettingsPage;