import ApiRequestService from './ApiRequestService';

class ParcelsService {
    /**
     * Fetch list of notifications
     *
     * @param email
     * @param password
     */
    public static async list(data: object = {}) {
        return ApiRequestService.get(`/dashboard/parcels`, data);
    }

    /**
     * Store notification by id
     *
     * @param data
     */
    public static async store(data: any) {
        return ApiRequestService.post(`/dashboard/parcels`, data);
    }

    /**
     * Fetch notification by id
     *
     * @param data
     */
    public static async read(id: number) {
        return ApiRequestService.get(`/dashboard/parcels/${id}`);
    }

    /**
     * Update notification by id
     *
     * @param data
     */
    public static async update(id: number, data: any) {
        return ApiRequestService.patch(`/dashboard/parcels/${id}`, data);
    }

    /**
     * Delete notification by id
     *
     * @param data
     */
    public static async delete(id: number) {
    return ApiRequestService._delete(`/dashboard/parcels/${id}`);
    }
}

export default ParcelsService;
