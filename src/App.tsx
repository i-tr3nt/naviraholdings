import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Users from "./pages/Users";
import Shop from "./pages/Shop";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";
import ShopCatalog from "./pages/ShopCatalog";
import ShopDepartment from "./pages/ShopDepartment";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OnlineOrders from "./pages/OnlineOrders";
import CompanyInfo from "./pages/CompanyInfo";
import FindStore from "./pages/FindStore";
import AdminCompanySettings from "./pages/AdminCompanySettings";
import Returns from "./pages/Returns";
import NotFound from "./pages/NotFound";
import { RequireShopLogin } from "./components/shop/RequireShopLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="navira-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/staff" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/users" element={<Users />} />
            <Route path="/shop/register" element={<CustomerRegister />} />
            <Route path="/shop/login" element={<CustomerLogin />} />
            <Route
              path="/shop"
              element={
                <RequireShopLogin>
                  <Shop />
                </RequireShopLogin>
              }
            />
            <Route path="/shop/catalog" element={<ShopCatalog />} />
            <Route path="/shop/department/:departmentId" element={<ShopDepartment />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/online-orders" element={<OnlineOrders />} />
            <Route path="/company-info" element={<CompanyInfo />} />
            <Route path="/find-store" element={<FindStore />} />
            <Route path="/admin/company-settings" element={<AdminCompanySettings />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
