import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import storageServices from "@/services/storage_services";
import tokenServices from "@/services/token-services";
import { observer } from "mobx-react";

let lastLocation = '/';

const Menu: React.FC = () => {
    let selected = "/"
    const router = useRouter();

    if (router.pathname !== lastLocation) {
        selected = router.asPath;
    }

    const user = storageServices.getUser();
    if (user && (!user?.photoUrl || user.photoUrl.length == 0)) user.photoUrl = "../static/images/user-placeholder.jpg";

    const profileImgUrl = {
        backgroundImage: `url(${user?.photoUrl})`,
    };

    return <menu>
        <Link href="/">
            <div className="name">
                <img src="../static/logo.svg" alt="Лого"/>
                <h3>Горы Здоровья</h3>
            </div>
        </Link>
        <div className="tabs">
            <div className="links">
                <Link href="/consultations">
                    <div className={"tab " + (selected === "/consultation" ? "selected" : "")}>
                        <span className="link">Консультации</span>
                        <div className="circle"/>
                    </div>
                </Link>
                <Link href="/symptoms">
                    <div className={"tab " + (selected === "/symptoms" ? "selected" : "")}>
                        <span className="link">Симптомы</span>
                        <div className="circle"/>
                    </div>
                </Link>
                <Link href="/find-doctor" >
                    <div className={"tab " + (selected === "/find-doctor" ? "selected" : "")}>
                        <span className="link ">Врачи</span>
                        <div className="circle"/>
                    </div>
                </Link>
            </div>
        </div>


        {
            tokenServices.isLogin()
                ? <Link href="/settings/account">
                    <div className="profile">
                        <div className="photo" style={profileImgUrl}/>
                        <span className="span-name">{getName(user)}</span>
                    </div>
                </Link>
                : <div className="auth">
                    <Link href="/login">
                        <button className="login">Войти</button>
                    </Link>

                    <Link href="/signup">
                        <button className="signup">Регистрация</button>
                    </Link>
                </div>
        }


        <div className="hamburger-menu">
            <input id="menu__toggle" type="checkbox"/>
            <label className="menu__btn">
                <span/>
            </label>
            <ul className="menu__box">
                <Link href="/consulations">
                    <div className={"tab " + (selected === "/consultation" ? "selected" : "")}>
                        <span className="link">Консультации</span>
                        <div className="circle"/>
                    </div>
                </Link>
                <Link href="/symptoms">
                    <div className={"tab " + (selected === "/symptoms" ? "selected" : "")}>
                        <span className="link">Симптомы</span>
                        <div className="circle"/>
                    </div>
                </Link>
                <Link href="/find-doctor">
                    <div className={"tab " + (selected === "/find-doctor" ? "selected" : "")}>
                        <span className="link ">Врачи</span>
                        <div className="circle"/>
                    </div>
                </Link>
            </ul>
        </div>
    </menu>
}

const getName = (user: UserType | null): string => {
    if (!user) return "";
    let name = "";
    if (user.name) name += user.name + " ";
    if (user.surname) name += user.surname;
    return name;
};

export default observer(Menu);