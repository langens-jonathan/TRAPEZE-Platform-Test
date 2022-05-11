export default interface User {
    name: string
    email: string
    diplomaUsageRequestStatus: diplomaUsageRequestStatusEnum
}


export enum diplomaUsageRequestStatusEnum {
    accepted,
    rejected,
    not_answered
}
