export enum ESpeciality {
    "Педиатр" = "Педиатр",
    "Терапевт" = "Терапевт",
    "Дерматолог" = "Дерматолог",
    "Психолог" = "Психолог",
    "Дефектолог" = "Дефектолог",
    "Логопед" = "Логопед",
    "Диетолог" = "Диетолог",
    "Аллерголог" = "Аллерголог",
    "Офтальмолог" = "Офтальмолог",
    "Невролог" = "Невролог",
    "Гинеколог" = "Гинеколог",
    "Венеролог" = "Венеролог",
    "Андролог" = "Андролог",
    "Кардиолог" = "Кардиолог",
    "Пульмонолог" = "Пульмонолог",
    "Отоларинголог" = "Отоларинголог",
    "Ортопед" = "Ортопед",
    "Стоматолог" = "Стоматолог",
    "Гастренторолог" = "Гастренторолог",
}

export const doctorSpecialities = [ "Педиатр", "Терапевт", "Дерматолог", "Психолог", "Дефектолог", "Логопед", "Диетолог", "Аллерголог", "Офтальмолог", "Невролог","Гинеколог","Венеролог","Андролог","Кардиолог","Пульмонолог","Отоларинголог", "Ортопед","Стоматолог", "Гастренторолог"]


// export enum EWorkExperience {
//     "Меньше 1 года" ,
//     "1 год",
//     "3 года" ,
//     "5 лет" ,
//     "больше 5 лет" ,
// }

export const workExperience = [
    "Меньше 1 года",
    "1 год",
    "3 года",
    "5 лет",
    "Больше 5 лет",
];

export const MWorkExperience = {
    LessYear: [0, 364],
    OneYear: [365, 1094],
    ThreeYears: [1095, 1824],
    FiveYears: [1825, 2190],
    MoreFiveYears: [2190, Infinity],
};
