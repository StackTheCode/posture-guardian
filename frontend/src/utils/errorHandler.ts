import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const handleApiError = (error: unknown, fallbackMessage: string = 'An error occurred') => {
    if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message || fallbackMessage;
        const status = error.response?.status;

        switch (status) {
            case 401:
                toast.error("Token session expired");
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                break;
            case 403:
                toast.error('You do not have permission to perform this action.');
                break;

            case 404:
                toast.error('Resource not found.');
                break;

            case 500:
                toast.error('Server error. Please try again later.');
                break;
            default:
                toast.error(message);
        }
        return message;
    }

// For non Axious errors
    const message = error instanceof Error ? error.message : fallbackMessage;
    toast.error(message);
    return message;


}
export const showSuccess = (message: string) => {
    toast.success(message);
}


export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast =( toastId:string) =>{
    toast.dismiss(toastId);
}