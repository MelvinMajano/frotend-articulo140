import { RouterProvider } from "react-router"
import { router } from "./articuloAppRouter/ArticuloAppRouter.router";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";
import { authStore } from "./auth/store/authStore";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export const CheckAuthProvider = ({children}:PropsWithChildren) =>{
const {chekAuthStatus} = authStore();
const {isLoading} = useQuery({
  queryKey:['auth'],
  queryFn:chekAuthStatus,
  retry:false,
  refetchInterval: 1000 * 60 * 0.5,
  refetchOnWindowFocus:true
});

  if (isLoading) return <CustomFullScreenLoading />;

    return children;
}

export const Articulo140App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster/>
      <CheckAuthProvider>
        <RouterProvider router={router} />
        </CheckAuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
};
