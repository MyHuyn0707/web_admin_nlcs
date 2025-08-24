import createApiAdmin from "./api.service";

class PostService {
    constructor(baseUrl = "/post") {
        this.api = createApiAdmin(baseUrl);
    }
    async getPosts() {
        return api.get("/get-post").data;
    }
    async createPost(data) {
        return api.post("/create-post", data).data;
    }
    async updatePost(id, data) {
        return api.post(`/update-post/${id}`, data).data;
    }
    async deletePost(id) {
        return api.delete(`/delete-post/${id}`).data;
    }
}

export default new PostService();
