// import { da } from 'date-fns/locale';
import ApiRequestService from './ApiRequestService';

class FilesServices {
    /**
     * Fetch list of notifications
     *
     * @param email
     * @param password
     */
    public static async list(user_id: number|null, data: object = {}) {
        if (!user_id) {
            return ApiRequestService.get(`/notes`, data);
        }

        return ApiRequestService.get(`/users/${user_id}/notes`, data);
    }

    /**
     * Store notification by id
     *
     * @param data
     */
    public static async store(data: any) {
        return ApiRequestService.post(`/files`, data, {
            'Content-Type': undefined,
        });
    }

    /**
     * Fetch notification by id
     *
     * @param data
     */
    public static async read(uid: string) {
        return ApiRequestService.get(`/notes/${uid}`);
    }

    /**
     * Update notification by id
     *
     * @param data
     */
    public static async update(uid: string, data: any) {
        return ApiRequestService.put(`/notes/${uid}`, data);
    }

    /**
     * Delete notification by id
     *
     * @param data
     */
    public static async delete(id: number) {
        return ApiRequestService._delete(`/files/${id}`);
    }
    
    /**
     * Share note by id
     * 
     * @param uid 
     * @param email 
     */
    public static async share(uid: string, email: string) {
        return ApiRequestService.post(`/notes/${uid}/send`, { email });
    }
}

export default FilesServices;
