import { authFetch } from "@/services/fetch_services";
import axios from "axios";
import TokenServices from "@/services/token-services";
import {
    GetAppointRequestsResponse,
    GetAppointsDatesResponse,
    GetAppointsResponse,
    PostConfirmAppointRequest, PostRejectAppointRequest
} from "@/modules/hub/types";

export default class HubService {

    /**
     * @throws GetAppointsDatesResponse.error
     * @param id
     * @param date
     */
    public static fetchAppointmentsDate = async (id: string, date: Date): Promise<Date[]> => {

        // Change Date obj --> "MM.YYYY" format
        let month = (date.getMonth() + 1).toString(), year = date.getFullYear();
        if (month.length === 0) month = "0" + month;
        const stringDate = `${month}.${year}`;

        const response = await authFetch<GetAppointsDatesResponse>(() => axios.get(
            process.env.SERVER_URL + `/api/doctor/get-appoints-dates/${stringDate}`,
            { headers: { auth: TokenServices.header } },
        ))

        if (!response.data.success) {
            throw response.data.error;
        }

        return response.data.dates.map(e => new Date(e));
    }

    /**
     * @throws GetAppointsResponse.error
     * @param id
     * @param date
     * @param isUser
     */
    public static fetchAppointments = async (id: string, date: Date, isUser: boolean): Promise<IAppointment[]> => {
        // Change Date obj --> "DD.MM.YYYY" format
        let day = date.getDay().toString(),
            month = (date.getMonth() + 1).toString(),
            year = date.getFullYear();
        if (day.length === 1) day = "0" + day;
        if (month.length === 1) month = "0" + month;
        const stringDate = `${day}.${month}.${year}`;

        const response = await authFetch<GetAppointsResponse>(() => axios.get(
            process.env.SERVER_URL + `/api/${isUser ? "user" : "doctor"}/${id}/appoints?numericDate=${stringDate}`,
            { headers: { auth: TokenServices.header } }
        ));

        // Error handling
        if (!response.data.success) {
            throw response.data.error;
        }

        // Convert string dates to Date obj
        return response.data.appointments.map(e => ({
            ...e,
            from: new Date(e.from),
            to: new Date(e.to),
            birthday: new Date(e.birthday),
        }));
    }

    /**
     * @throws GetAppointRequestsResponse.error
     * @param id
     * @param isUser
     */
    public static fetchAppointmentRequests = async (id: string, isUser: boolean): Promise<IAppointRequest[]> => {
        const response = await authFetch<GetAppointRequestsResponse>(() => axios.get(
            process.env.SERVER_URL + `/api/${isUser ? "user" : "doctor"}/${id}/appoints-requests`,
            { headers: { auth: TokenServices.header } },
        ));

        // Error handling
        if (!response.data.success) {
            throw response.data.error;
        }

        // Convert string dates to Date obj
        return response.data.requests.map(e => ({
            ...e,
            createdAt: new Date(e.createdAt),
        }));
    }

    private static appointRequestAction = async (id: string, action: "confirm" | "reject"): Promise<void> => {
        const uid = localStorage.getItem("uid");
        const response = await authFetch<PostConfirmAppointRequest>(() => axios.post(
            process.env.SERVER_URL + `/api/doctor/${uid}/appoint/${id}/${action}`,
            {},
            { headers: { auth: TokenServices.header } }
        ));

        // Error handling
        if (!response.data.success) {
            throw response.data.error;
        }
    }

    /**
     * @throws PostConfirmAppointRequest.error
     * @param id
     */
    public static confirmAppointRequest = async (id: string): Promise<void> => {
        return HubService.appointRequestAction(id, "confirm")
    }

    /**
     * @throws PostRejectAppointRequest.error
     * @param id
     */
    public static rejectAppointRequest = async (id: string): Promise<void> => {
        return HubService.appointRequestAction(id, "reject")
    }

    /**
     * @throws PostRejectAppointRequest.error
     * @param id
     */
    public static rejectAppoint = async (id: string): Promise<void> => {
        const uid = localStorage.getItem("uid");
        const response = await authFetch<PostRejectAppointRequest>(() => axios.post(
            process.env.SERVER_URL + `/api/doctor/${uid}/consultation/${id}/reject`,
            {},
            { headers: { auth: TokenServices.header } }
        ));

        // Error handling
        if (!response.data.success) {
            throw response.data.error;
        }
    }
}
