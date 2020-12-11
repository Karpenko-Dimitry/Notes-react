// import { da } from 'date-fns/locale';
import ApiRequestService from './ApiRequestService';
import { FALLBACK_LOCALE } from '../env';

class NoteService {
    /**
     * Fetch list of notifications
     *
     * @param email
     * @param password
     */
    public static async list(user_id: number|null, data: object = {}, headers: object = {'locale': FALLBACK_LOCALE}) {
        if (!user_id) {
            return ApiRequestService.get(`/notes`, data, headers);
        }

        return ApiRequestService.get(`/users/${user_id}/notes`, data, headers);
    }

    // /**
    //  * Store notification by id
    //  *
    //  * @param data
    //  */
    // public static async store(data: any) {
    //     return ApiRequestService.post(`/notes`, data, {
    //         'Content-Type': undefined,
    //     });
    // }

     /**
     * Store notification by id
     *
     * @param data
     */
    public static async store(data: any) {
        return ApiRequestService.post(`/notes`, data);
    }

    /**
     * Fetch notification by id
     *
     * @param data
     */
    public static async read(uid: string, data: object = {}, headers: object = {'locale': FALLBACK_LOCALE} ) {
        return ApiRequestService.get(`/notes/${uid}`, data, headers);
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
    public static async delete(uid: string) {
        return ApiRequestService._delete(`/notes/${uid}`);
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

export default NoteService;
