import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react";
import controller, { ESocialLinkTypes } from "../controllers/detail-controller";
import { BookmarkIcon, InstagramIcon, MailIcon, TelegramIcon, ViberIcon, VkIcon, WhatsAppIcon } from "../icons";
import RatingComponent from "../components/rating";
import ConsultationSelector from "../components/detail/consulation-selector";
import Reviews from "../components/detail/reviews";
import DoctorPlaceholder from "../../../static/images/user-placeholder.jpg";
import Page404 from "../../main/pages/404";
import LoadingHeader from "../components/detail/loading/loading-header";
import LoadingConsultationsComponent from "../components/detail/loading/loading-consultations";
import formatServices from "../../../services/format-services";

type PathParamsType = {
    id: string,
}

type Props = RouteComponentProps<PathParamsType>;


const DetailPage: React.FC<Props> = (props) => {

    if (controller.doctorId !== props.match.params.id) {
        controller.doctorId = props.match.params.id;
        controller.fetchDoctor(props.match.params.id);
    }

    const profileStyles = {
        backgroundImage: `url(${ controller.doctor?.photoUrl || DoctorPlaceholder })`,
    };

    if (controller.loading) {
        return <div className="detail-doctor-module">
            <LoadingHeader/>
            <LoadingConsultationsComponent/>
        </div>;
    }

    return <div className="detail-doctor-module">
        {
            controller.doctor == undefined
                ? <Page404/>
                : <React.Fragment>
                    <header>

                        <div className="profileImage" style={ profileStyles }/>

                        <div className="info-main">
                            <h2>{ controller.doctor.fullName }</h2>
                            <RatingComponent amount={ controller.doctor.rating }/>
                            <div className="buttons">
                                <button
                                    className="appoint"
                                    onClick={() => props.history.push(`/appoint/${props.match.params.id}`)}>
                                    Записаться
                                </button>
                                {/* todo: save logic */ }
                                <button className="save"><BookmarkIcon/></button>
                            </div>
                        </div>

                        <div className="divider"/>

                        <div className="info-detail">
                            <div className="info">
                                <div className="keys">
                                    <div className="key">Специальность:</div>
                                    <div className="key">Опыт работы:</div>
                                    <div className="key">Возраст:</div>
                                    <div className="key">Город:</div>
                                </div>
                                <div className="values">
                                    <div className="value">
                                        {
                                            controller.doctor.speciality.length > 0
                                                ? formatServices.translateSpeciality(controller.doctor.speciality[0])
                                                : "Не указана"
                                        }
                                    </div>
                                    <div className="value">
                                        {
                                            controller.doctor.experience
                                                ? formatServices.experience(controller.doctor.experience)
                                                : "Не указан"
                                        }
                                    </div>
                                    <div className="value">
                                        {
                                            controller.doctor.age
                                                ? formatServices.age(controller.doctor.age)
                                                : "Не указан"
                                        }
                                    </div>
                                    <div className="value">
                                        {
                                            controller.doctor.city && controller.doctor.city.length > 0
                                                ? controller.doctor.city
                                                : "Не указан"
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="social-medias">
                                {
                                    controller.getSocialLinks()?.map(e => <a href={e.href}>
                                        <LinkIcon type={e.type} />
                                    </a>)
                                }
                            </div>
                        </div>
                    </header>


                    <ConsultationSelector/>
                    {

                        controller.doctor?.clientsReviews?.length ?? 0 > 0
                            ? <Reviews/>
                            : <React.Fragment/>
                    }
                </React.Fragment>
        }
    </div>
}

const LinkIcon : React.FC<{type: ESocialLinkTypes}> = ({ type }) => {
    if (type == ESocialLinkTypes.vk) return <VkIcon/>
    if (type == ESocialLinkTypes.instagram) return <InstagramIcon/>
    if (type == ESocialLinkTypes.telegram) return <TelegramIcon/>
    if (type == ESocialLinkTypes.whatsApp) return <WhatsAppIcon/>
    if (type == ESocialLinkTypes.viber) return <ViberIcon/>
    if (type == ESocialLinkTypes.email) return <MailIcon/>
    return <React.Fragment/>
}


export default withRouter(observer(DetailPage));