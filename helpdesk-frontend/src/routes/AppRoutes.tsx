import { Routes, Route } from "react-router";
import { AuthLayout, DashboardLayout } from "../components/layouts";
import { Login, Register } from "../pages";
import { Redirect } from "./Redirect";

// import { Home } from "../pages/Home"
// import { NotFound } from "../pages/NotFound"
// import { Products } from "../pages/Products"
// import { Product } from "../pages/Product"
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Redirect />} />

      <Route path="/" element={<AuthLayout />}>
        <Route path="/entrar" index element={<Login />} />
        <Route path="/cadastrar" index element={<Register />} />
      </Route>

      <Route path="/painel" element={<DashboardLayout />}>
        {/*<Route path="/products" element={<Products />} />*/}
        {/*<Route path="/product:id" element={<Product />} />*/}
      </Route>

      {/*<Route path="*" element={<NotFound />} />*/}
    </Routes>
  );
}
