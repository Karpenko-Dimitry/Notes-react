import ApiRequestService from './ApiRequestService';

class AuthService {
    /**
     * Registration endpoint
     *
     * @param email
     * @param password
     */
    public static async signUp(data: {}) {
        return ApiRequestService.post('/auth/registration', data);
    }

    /**
     * Email confirmation
     * 
     * @param user_id number
     * @param timestamp number
     * @param signature string
     */
    public static async signUpEmailConfirm(user_id: number, timestamp: number, signature: string) {
        return ApiRequestService.post('/auth/verify-registration', {
            user_id: user_id, 
            timestamp: timestamp, 
            signature: signature,
        });
    }

    /**
     * Authorization endpoint
     *
     * @param email
     * @param password
     */
    public static async signIn(email: string, password: string) {
        return ApiRequestService.post('/users/login', {
            email: email,
            password: password,
        });
    }

    /**
     * Fetch user profile
     *
     * @param data
     */
    public static async profile() {
        return ApiRequestService.get('/users/profile');
    }
}

export default AuthService;
