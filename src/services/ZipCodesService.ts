import ApiRequestService from './ApiRequestService';

class ZipCodesService {
    /**
     * Fetch list of notifications
     *
     * @param email
     * @param password
     */
    public static async list(data: object = {}) {
        return ApiRequestService.get(`/dashboard/zip-codes`, data);
    }

    /**
     * Store notification by id
     *
     * @param data
     */
    public static async store(data: any) {
        return ApiRequestService.post(`/dashboard/zip-codes`, data);
    }

    /**
     * Fetch notification by id
     *
     * @param data
     */
    public static async read(id: number) {
        return ApiRequestService.get(`/dashboard/zip-codes/${id}`);
    }

    /**
     * Update notification by id
     *
     * @param data
     */
    public static async update(id: number, data: any) {
        return ApiRequestService.patch(`/dashboard/zip-codes/${id}`, data);
    }

    /**
     * Delete notification by id
     *
     * @param data
     */
    public static async delete(id: number) {
        return ApiRequestService._delete(`/dashboard/zip-codes/${id}`);
    }
}

export default ZipCodesService;
