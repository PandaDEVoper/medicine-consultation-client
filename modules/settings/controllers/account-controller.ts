import { action, observable, makeObservable } from "mobx";
import { injectable } from "inversify";
import Time from "@/utils/time";
import Duration from "@/utils/duration";
import FormatServices from "@/services/format-services";
import { authFetch, EAuthFetch } from "@/services/fetch_services";
import axios from "axios";
import token_services from "@/services/token-services";
import validate_services from "@/services/validation-services";
import UserStore from "./userStore";
import StorageServices from "@/services/storage_services";

@injectable()
export default class AccountController {

    constructor() {
        makeObservable(this);
    }

    // General
    @observable status: "user" | "doctor" = "doctor";
    @observable isLoading: boolean = true;
    @observable isLoadingSave: boolean = false;

    // Account
    @observable profileImage: string = "";
    @observable name: string = "Ярослав";
    @observable surname: string = "Зотов";
    @observable patronymic: string = "Сергеевич";
    @observable phone: string = "+7 9323327340";
    @observable birthday: Date | null = null;
    @observable email: string = "the1ime@yandex.ru";
    @observable country: string = "Россия";
    @observable city: string = "Пермь";
    @observable isMale: boolean = true;
    @observable isCalendarOpen: boolean = false;
    @observable fullName: string = "";
    @observable location: string = "";

    @observable nameError?: string = "";
    @observable surnameError?: string = "";
    @observable phoneError?: string = "";
    @observable emailError?: string = "";

    // Doctor
    @observable startConsultationAt: Time = new Time(9, 0);
    @observable endConsultationAt: Time = new Time(22, 0);
    @observable consultationTime: Duration = new Duration(50);

    fetchUser = async (): Promise<void> => {
        const uid = localStorage.getItem("uid");
        const isUser = localStorage.getItem("isUser");
        if (!uid || isUser == null) throw "logout";

        if (UserStore.user !== null) {
            this._mapUserToClass(UserStore.user);
            this.isLoading = false;
            return;
        }

        this.isLoading = true;
        const route = isUser == "true" ? `/api/user/${uid}` : `/api/doctor/${uid}`
        const result = await authFetch(() => axios.get(
            process.env.SERVER_URL + route,
            {
                headers: {
                    auth: token_services.header
                }
            }
        ));
        this.isLoading = false;
        
        if (!result || result.status === EAuthFetch.Error) throw "error";
        else if (result.status === EAuthFetch.Unauthorized) throw "logout";
        else {
            action(() => {
                if (!result) throw "error";

                let user;
                if (isUser === "true") user = result.data.user;
                else user = result.data.doctor;

                UserStore.user = user;
                this._mapUserToClass(user);

                if (this.city && this.country) this.location = `${this.city}, ${this.country}`;
                else if (this.city) this.location = this.city;
                else if (this.country) this.location = this.country;
            })();
        }
    }

    saveAccountSettings = async (): Promise<void> => {

        action(() => {
            this.nameError = undefined;
            this.emailError = undefined;
            this.surnameError = undefined;
            this.phoneError = undefined;
        })();

        const uid = localStorage.getItem("uid");
        const isUser = localStorage.getItem("isUser");
        if (!uid || isUser == null) throw "logout";

        // Validate
        let errorsLength = 0;
        if (this.name.length === 0 || this.name.length > 256) {
            this.nameError = "Необходимо ввести имя"
            errorsLength += 1;
        }
        if (this.surname.length === 0 || this.surname.length > 256) {
            this.surnameError = "Необходимо ввести фамилию"
            errorsLength += 1;
        }
        if (FormatServices.toNumericPhone(this.phone).toString().length !== 11) {
            this.phoneError = "Неправильный телефон"
            errorsLength += 1;
        }
        if (!validate_services.email(this.email)) {
            this.emailError = "Неверный email";
            errorsLength += 1;
        }


        if (errorsLength > 0) return;
        this.isLoadingSave = true;

        if (UserStore.user) {
            const user : UserType = {
                ...UserStore.user,
                name: this.name,
                surname: this.surname,
                patronymic: this.patronymic,
                phone: FormatServices.toNumericPhone(this.phone),
                email: this.email,
                birthday: this.birthday as Date,
                country: this.country,
                city: this.city,
                sex: this.isMale,
            };
            UserStore.user = user;
            StorageServices.saveUser(user);
        }


        const route = isUser == "true" ? `/api/user/${uid}` : `/api/doctor/${uid}`
        const res = await authFetch(() => axios.put(
            process.env.SERVER_URL + route,
            {
                id: uid,
                name: this.name,
                surname: this.surname,
                patronymic: this.patronymic,
                phone: FormatServices.toNumericPhone(this.phone),
                email: this.email,
                birthday: this.birthday ? (this.birthday as Date).toISOString() : undefined,
                country: this.country,
                city: this.city,
                sex: this.isMale,
            },
            {
                headers: {
                    auth: token_services.header
                },
            }));

        this.isLoadingSave = false;
        if (res.status === EAuthFetch.Error) throw "error";
        else if (res.status === EAuthFetch.Unauthorized) throw "login";
        else if (res.data.error && res.data.error === "not_validated_error") {
            const errs = res.data.errors;
            if (errs.email === "unique_error") this.emailError = "Этот email уже используется";
        } else {
            const newUser = {
                name: this.name,
                surname: this.surname,
                patronymic: this.patronymic,
                phone: FormatServices.toNumericPhone(this.phone),
                email: this.email,
                birthday: this.birthday as Date,
                country: this.country,
                city: this.city,
                sex: this.isMale,
                fullName: this.fullName,
            } as UserType;
            UserStore.user = newUser;
            StorageServices.saveUser(newUser);
        }
    }

    changeProfilePic = async (files: FileList | null) : Promise<void> => {
        if (files === null) return;
        this.isLoadingSave = true;
        const uid = localStorage.getItem("uid");
        const isUser = localStorage.getItem("isUser");
        if (!uid || isUser == null) throw "logout";

        const bodyFormData = new FormData();
        bodyFormData.append("1", files[0]);

        const route = isUser ? `/api/user/setAvatar/${uid}` : `/api/doctor/${uid}`
        const res = await authFetch(() => axios({
            method: "POST",
            url: process.env.SERVER_URL + route,
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data', auth: token_services.header },
        }));

        action(() => {
            this.isLoadingSave = false;
            if (res.status === EAuthFetch.Error) throw "error";
            else if (res.status === EAuthFetch.Unauthorized) throw "login";
            else {
                this.profileImage = res.data.photoUrlPath;
                const newUser = {
                    ...UserStore.user,
                    fullName: this.fullName,
                    photoUrl: res.data.photoUrlPath,
                } as UserType;
                UserStore.user = newUser;
                StorageServices.saveUser(newUser);
            }
        })();
    }

    @action private _mapUserToClass = (user : UserType) : void => {
        this.name = user.name;
        this.surname = user.surname;
        this.profileImage = user.photoUrl;
        this.surname = user.surname;
        this.patronymic = user.patronymic ?? "";
        this.phone = FormatServices.formatNumericPhone(user.phone ?? 0);
        this.birthday = user.birthday ? new Date(user.birthday) : null;
        this.email = user.email;
        this.country = user.country ?? "";
        this.city = user.city ?? "";
        this.isMale = user.sex;
        this.fullName = `${user.name} ${user.surname}`;
    }

    get birthdayString(): string {
        return FormatServices.formatDate(this.birthday as Date);
    }
}
