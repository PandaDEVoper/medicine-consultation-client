import React, { useEffect } from 'react';
import Head from "next/head";
import { NextPage } from "next";
import { observer } from "mobx-react";
import Menu from "@/components/menu";
import ConsultationController from "../controllers/consultations_controller";
import Navigation from "../components/navigation";
import ConsultationTile from "../components/consultation-tile";
import NotFound from "../components/not-found";
import NoteComponent from "../components/note";
import SettingsLoadingComponent from "../components/loading";
import GoBackIcon from "../components/go-back-icon";
import { TYPES, useInjection } from "../../../container";


const ConsultationsPage: NextPage = () => {
    const controller = useInjection<ConsultationController>(TYPES.settingsConsultationController);

    useEffect(() => {
        if (typeof window !== "undefined") {
            controller.fetchConsultations();
        }
    }, []);

    if (controller.isLoading) {
        return <SettingsLoadingComponent active="/consultations"/>
    }

    if (controller.consultations.length === 0) return <React.Fragment>
        <Menu/>
        <main className="consultations-page settings-page">
            <Navigation active="/consultations" />
            <NotFound text="У вас еще не было консультаций" />
        </main>
    </React.Fragment>

    return <React.Fragment>
        <Head>
            <title>Настройки – Консультации</title>
        </Head>
        <Menu/>
        <main className="consultations-page settings-page">
            <NoteComponent consultationController={controller} />
            <Navigation active="/consultations" />
            <GoBackIcon/>
            <section className="content consultations">
                {
                    controller.consultations.map((e, i) => <ConsultationTile
                        onShowNode={() => controller.showConsultationNode(i)}
                        consultation={e}
                        key={e.toString()} />)
                }
            </section>
        </main>
    </React.Fragment>

};

export default observer(ConsultationsPage);
