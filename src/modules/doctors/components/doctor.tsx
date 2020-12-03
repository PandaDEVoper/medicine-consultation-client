import React from "react";
import Skeleton from 'react-loading-skeleton';
import RatingComponent from "./rating";
import { useHistory } from "react-router-dom";
import detailController from "../controllers/detail-controller";
import controller from "../controllers/find-doctor-controller";
import userPlaceholder from "../../../static/images/user-placeholder.jpg";
import formatServices from "../../../services/format-services";

type Props = {
    name: string;
    surname: string;
    speciality: string;
    age?: number;
    imgUrl: string;
    rating: number;
    id: string;
};

const Doctor: React.FC<Props> = (props: Props) => {

    const img = props.imgUrl && props.imgUrl.length != 0 ? props.imgUrl : userPlaceholder;
    const history = useHistory();

    const goToDoctorPage = (): void => {
        detailController.fetchDoctor(props.id);
        history.push(`/doctor/${props.id}`);
    }

    if (controller.isLoading) {
        return <div className="doctor">
            <Skeleton style={{ marginRight: "10px" }} width={100} height={100} />
            <div className="info">
                <Skeleton style={{ display: "block", marginBottom: "5px" }} width={175} height={16} />
                <Skeleton style={{ display: "block" }} width={100} height={14} />
                <div className="rating">
                    <RatingComponent amount={props.rating} />
                </div>
            </div>
        </div>
    }

    return <div className="doctor" onClick={goToDoctorPage}>
        <div className="image" style={{ backgroundImage: `url(${img})` }}/>
        <div className="info">
            <h3>{props.name}&nbsp;{props.surname}</h3>

            {
                props.age || props.speciality
                    ? <span className="speciality-and-age">{ formatServices.getAgeAndSpeciality(props.age, props.speciality) }</span>
                    : <React.Fragment />
            }

            <div className="rating">
                <RatingComponent amount={props.rating} />
            </div>
        </div>
    </div>
}

export default Doctor;