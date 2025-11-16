import { createAxiosInstance } from "./AxiosInstance";

export const useApiClients = () => {
  const loginApi = createAxiosInstance(import.meta.env.VITE_LOGIN_URL);
  const portfolioApi = createAxiosInstance(import.meta.env.VITE_PORTFOLIO_URL);

  return { loginApi, portfolioApi };
};
