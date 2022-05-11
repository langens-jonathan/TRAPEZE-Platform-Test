import User, { diplomaUsageRequestStatusEnum } from "../../models/User";

interface JsonAPIError {
    title: string
}
interface JsonAPIErrorResponse {
    errors: JsonAPIError[]
}

interface JSONAPIDataResponse<Resource, Attributes, Relationships> {
    data: {
        type: Resource
        id: string
        attributes: Attributes,
        relationships: Relationships
    },
}

// type SessionsResponse = JSONAPIDataResponse<"sessions", {}, {
//     account: {
//         data: {
//             type: "accounts"
//             id: string
//         }
//     }
// }>

// The mu-login service is not respecting json:api for its relationships placement, use this in the meantime
interface SessionsResponse {
    data: {
        id: string,
        type: "sessions"
    },
    relationships: {
        account: {
            data: {
                type: "accounts",
                id: string
            }
        }
    }
}

type AccountsResponse = JSONAPIDataResponse<"accounts", {}, {
    user: {
        links: {
            related: string
        }
    }
}>

type UsersResponse = JSONAPIDataResponse<"users", {
    name: string
    email: string
}, {}>

export async function restoreSession(): Promise<User> {
    const response = await fetch("/sessions/current", {
        method: "GET",
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    });
    let sessionResponse : SessionsResponse | JsonAPIErrorResponse = await response.json();
    if(![200, 201].includes(response.status)) {
        sessionResponse = sessionResponse as JsonAPIErrorResponse;
        throw new Error(sessionResponse.errors[0].title);
    }
    sessionResponse = sessionResponse as SessionsResponse;
    const accountResponse = await getAccount(sessionResponse.relationships.account.data.id);
    return await getUser(accountResponse.data.relationships.user.links.related);
}

export async function createSession(username: string, password: string): Promise<User> {
    const response = await fetch("/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/vnd.api+json"
        },
        body: JSON.stringify({data: { type:"sessions", attributes: {nickname: username, password: password}}})
    });
    let sessionResponse : SessionsResponse | JsonAPIErrorResponse = await response.json();
    if(![200, 201].includes(response.status)) {
        sessionResponse = sessionResponse as JsonAPIErrorResponse;
        throw new Error(sessionResponse.errors[0].title);
    }
    sessionResponse = sessionResponse as SessionsResponse;
    const accountResponse = await getAccount(sessionResponse.relationships.account.data.id);
    return await getUser(accountResponse.data.relationships.user.links.related);
}

export async function deleteSession() {
    const response = await fetch("/sessions/current", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/vnd.api+json"
        },
    });
    if(![200, 204].includes(response.status)) {
        const json = await response.json();
        throw new Error(json.errors[0].title);
    }
    return true;
}

export async function getAccount(id: string): Promise<AccountsResponse> {
    const response = await fetch(`/accounts/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/vnd.api+json"
        },
    });
    let accountResponse = await response.json() as AccountsResponse | JsonAPIErrorResponse;
    if(![200].includes(response.status)) {
        accountResponse = accountResponse as JsonAPIErrorResponse;
        throw new Error(accountResponse.errors[0].title);
    }
    return accountResponse as AccountsResponse;
}

export async function getUser(path: string): Promise<User> {
    const response = await fetch(path, {
        method: "GET",
        headers: {
            "Content-Type": "application/vnd.api+json"
        },
    });
    let userResponse = await response.json() as UsersResponse | JsonAPIErrorResponse;
    if(![200].includes(response.status)) {
        userResponse = userResponse as JsonAPIErrorResponse;
        throw new Error(userResponse.errors[0].title);
    }
    userResponse = userResponse as UsersResponse;
    const diplomaRequestStatus = userResponse.data.attributes.name === "Bernard Antoine"
      ? diplomaUsageRequestStatusEnum.not_answered
      : userResponse.data.attributes.name === "Roger Frederick"
        ? diplomaUsageRequestStatusEnum.rejected
        : diplomaUsageRequestStatusEnum.accepted;
    return { name: userResponse.data.attributes.name, email: userResponse.data.attributes.email, diplomaUsageRequestStatus: diplomaRequestStatus}
}
