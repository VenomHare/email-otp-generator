import { createContext } from "react";

export const mailContext = createContext({
    mail: "",
    setMail: ()=>{}
});
export const uuidContext = createContext({
    uuid: "",
    setUuid: ()=>{}
})
export const authenticatedContext = createContext({
    authenticated: "",
    setAuthenticated: ()=>{}
})