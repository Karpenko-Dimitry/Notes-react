import ApiRequestService from './ApiRequestService';

class ZipCodeRequestsService {
    /**
     * Fetch list of notifications
     *
     * @param email
     * @param password
     */
    public static async list(data: object = {}) {
        return ApiRequestService.get(`/dashboard/zip-code-requests`, data);
    }

    /**
     * Fetch notification by id
     *
     * @param data
     */
    public static async read(id: number) {
        return ApiRequestService.get(`/dashboard/zip-code-requests/${id}`);
    }

    /**
     * Delete notification by id
     *
     * @param data
     */
    public static async delete(id: number) {
        return ApiRequestService._delete(`/dashboard/zip-code-requests/${id}`);
    }
}

export default ZipCodeRequestsService;
