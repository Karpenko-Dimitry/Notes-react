import ApiRequestService from './ApiRequestService';

class NotificationsService {
    /**
     * Fetch list of notifications
     *
     * @param email
     * @param password
     */
    public static async list(data: object = {}) {
        return ApiRequestService.get('/notifications', data);
    }

    /**
     * Fetch notification by id
     *
     * @param data
     */
    public static async read(id: number) {
        return ApiRequestService.get('/notifications/' + id);
    }
}

export default NotificationsService;
