import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import BaseLayout from "./layout/BaseLayout";
import DashboardView from "./views/DashboardView";

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route element={<BaseLayout/>}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardView />} />
            </Route>
        </Routes>
    </BrowserRouter>
}