import { RouterProvider } from "react-router"
import { router } from "./articuloAppRouter/ArticuloAppRouter.router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient()

export const Articulo140App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
