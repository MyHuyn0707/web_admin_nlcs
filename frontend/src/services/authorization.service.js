import createApiAdmin from "./api.auth.service";

class AuthorizationServiceAdmin {
    constructor(baseUrl = "auth") {
        this.api = createApiAdmin(baseUrl);
    }

    async submitLogin(credentials) {
        const response = await this.api.post("/login", credentials);
        return response;
    }

    async logOut(data) {
        return (await this.api.get("/logout", data)).data;
    }
}

export default new AuthorizationServiceAdmin();
