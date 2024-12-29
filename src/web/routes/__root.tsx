import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Layout } from "../components";
import { ErrorComponent } from "../components/error-component";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </Layout>
  ),
  errorComponent: ErrorComponent,
});
