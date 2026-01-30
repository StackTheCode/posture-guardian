import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../../store/authStore";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import LoginPage from "../../pages/LoginPage";
import { authApi } from "../../services/api";

vi.mock("../../services/api");
vi.mock("react-hot-toast");


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage",() =>{
    beforeEach(() =>{
        vi.clearAllMocks();
        useAuthStore.setState({
            token:null,
            username:null,
            email:null,
            isAuthenticated:false,
        });
        
    });


const renderLoginPage = () =>{
    return render(
        <BrowserRouter>
        <LoginPage/>
        </BrowserRouter>
    );
};
    
it("renders login form",() =>{
    renderLoginPage();

    expect(screen.getByText("Posture Guardian"))
    expect(screen.getByPlaceholderText("Enter your username"))
    expect(screen.getByPlaceholderText("Enter your password"))
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();


});
it("shows validation error when fields are empty",async() =>{

renderLoginPage();
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // HTML5 validation will prevent submission
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    expect(usernameInput).toBeRequired();

});

it("submits form with valid credentials", async() =>{
    const mockResponse = {
        data:{
        token: 'fake-jwt-token',
        username: 'testuser',
        email: 'test@example.com',
        }
    };
  vi.mocked(authApi.login).mockResolvedValue(mockResponse as any);
  renderLoginPage();
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText("Enter your username"), "testuser");
  await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
  await user.click(screen.getByRole("button", { name:/sign in/i}));

  await waitFor(() => {
    expect(authApi.login).toHaveBeenCalledWith("testuser","password123");
  })
  await waitFor(() =>{
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  })




});


it("shows error message on login failure", async() =>{
    vi.mocked(authApi.login).mockRejectedValue({
        response: { data : {message: "Login failed. Please check your credentials."}}
    })
    renderLoginPage();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Enter your username'), "wronguser");
    await user.type(screen.getByPlaceholderText("Enter your password"), "wrongpass");
    await user.click(screen.getByRole("button", {name:/sign in/i}))

    await waitFor(() =>{
        expect(authApi.login).toHaveBeenCalled();
    })
})

  it('toggles password visibility', async () => {
renderLoginPage();
const user = userEvent.setup();
const passwordInput = screen.getByPlaceholderText("Enter your password");
expect(passwordInput).toHaveAttribute("type","password" );

const toggleButton = screen.getByRole("button", {name:''})
await user.click(toggleButton);

expect(passwordInput).toHaveAttribute("type", "text")

await user.click(toggleButton);
expect(passwordInput).toHaveAttribute("type", "password")


})



it("navigates to register page", async() =>{
    renderLoginPage();
    const user = userEvent.setup();

    const registerLink = screen.getByText("Sign up")


    await user.click(registerLink);
    expect(mockNavigate).toHaveBeenCalledWith("/register")
})

})
