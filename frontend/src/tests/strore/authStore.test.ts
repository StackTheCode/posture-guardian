import { beforeEach, describe, it, expect} from "vitest";
import { useAuthStore } from "../../store/authStore";


describe("authStore", () => {
    beforeEach(() => {
        useAuthStore.setState({
            token: null,
            username: null,
            email: null,
            isAuthenticated: false,

        });
        localStorage.clear();
    })


    it('should have initial state', () => {
        const state = useAuthStore.getInitialState();

        expect(state.token).toBeNull();
        expect(state.username).toBeNull();
        expect(state.email).toBeNull();
        expect(state.isAuthenticated).toBeFalsy();


    })

    it('should login user and set state', () => {
        const { login } = useAuthStore.getState();

        login("test-token", "testuser", "test@mail.com")
        const state = useAuthStore.getState()
        expect(state.token).toBe("test-token");
        expect(state.username).toBe("testuser");
        expect(state.email).toBe("test@mail.com");
        expect(state.isAuthenticated).toBeTruthy();
        expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token")

    })

    it('should logout user and clear state', () => {

        const { logout ,login} = useAuthStore.getState();

         login("test-token", "testuser", "test@mail.com")
        logout();
        const state = useAuthStore.getState();
        expect(state.token).toBeNull();
        expect(state.username).toBeNull();
        expect(state.email).toBeNull();
        expect(state.isAuthenticated).toBeFalsy();
        expect(localStorage.removeItem).toHaveBeenCalledWith("token")
    })


})