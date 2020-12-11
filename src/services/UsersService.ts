import ApiRequestService from './ApiRequestService';

class UsersService {
    /**
     * Fetch list of notifications
     *
     * @param email
     * @param password
     */
    public static async list(data: object = {}) {
        return ApiRequestService.get(`/dashboard/users`, data);
    }

    /**
     * Store notification by id
     *
     * @param data
     */
    public static async store(data: any) {
        return ApiRequestService.post(`/users`, data);
    }

    /**
     *
     * Store user avatar
     *
     * @param data
     */
    public static async storeAvatar(userId: number, data: any) {
        return ApiRequestService.post(`/user/${userId}/avatar`, data, {
            'Content-Type': undefined,
        });
    }

    /**
     * Fetch notification by id
     *
     * @param data
     */
    public static async read(id: number) {
        return ApiRequestService.get(`/dashboard/users/${id}`);
    }

    /**
     * Update notification by id
     *
     * @param data
     */
    public static async update(id: number, data: any) {
        return ApiRequestService.patch(`/dashboard/users/${id}`, data);
    }

    /**
     * Delete notification by id
     *
     * @param data
     */
    public static async delete(id: number) {
        return ApiRequestService._delete(`/dashboard/users/${id}`);
    }
}

export default UsersService;
