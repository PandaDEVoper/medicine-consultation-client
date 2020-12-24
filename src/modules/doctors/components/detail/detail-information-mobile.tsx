import React from "react";
import { observer } from "mobx-react";
import { CloseIcon } from "../../icons";
import controller from "../../controllers/detail-controller";
import formatServices from "../../../../services/format-services";
import { DoctorDetailHelper } from "../../helper";
import TileComponent from "./additional-information/tile";
import ImageTileComponent from "./additional-information/image-tile";

const getClasses = (name: string, length: number | undefined) => {
    if (!length) return `${name} hidden`;
    return name;
}

const DetailInformationMobile: React.FC = () => {
    if (!controller.doctor) return <React.Fragment/>;

    return <div className={`detail-information-mobile ${controller.isMobileInformationPageOpen ? "" : "closed"}`}>
            <div className="close" onClick={() => controller.isMobileInformationPageOpen = false}><CloseIcon/></div>
            <h1>Информация</h1>
            <div className="information">
                <div className="value">
                    Специальность:&nbsp;
                    {
                        controller.doctor.speciality.length > 0
                            ? formatServices.translateSpeciality(controller.doctor.speciality[0])
                            : "Не указана"
                    }
                </div>
                <div className="value">
                    Опыт работы:&nbsp;
                    {
                        controller.doctor.experience
                            ? formatServices.experience(controller.doctor.experience)
                            : "Не указан"
                    }
                </div>
                <div className="value">
                    Возраст:&nbsp;
                    {
                        controller.doctor.age
                            ? formatServices.age(controller.doctor.age)
                            : "Не указан"
                    }
                </div>
                <div className="value">
                    Город:&nbsp;
                    {
                        controller.doctor.city && controller.doctor.city.length > 0
                            ? controller.doctor.city
                            : "Не указан"
                    }
                </div>
            </div>

            <section className={getClasses("work-places", controller.doctor.workPlaces?.length)}>
                <h3 className="title">Опыт работы</h3>
                {
                    DoctorDetailHelper.getWorkPlaces(controller.doctor.workPlaces).map(e => <TileComponent {...e} />)
                }
            </section>

            <section className={getClasses("education", controller.doctor.education?.length)}>
                <h3 className="title">Образование</h3>
                {
                    DoctorDetailHelper.getEducation(controller.doctor.education).map(e => <TileComponent {...e} />)
                }
            </section>

            <section className={getClasses("qualification-proofs", controller.doctor.qualificationProofs?.length)}>
                <h3 className="title">Квалификация</h3>
                {
                    controller.doctor.qualificationProofs?.map(e => <ImageTileComponent title={e.name}
                                                                                        imageUrl={e.imageUrl}/>)
                    ?? <React.Fragment/>
                }
            </section>

    </div>
}

export default observer(DetailInformationMobile);