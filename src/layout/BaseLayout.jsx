import { Outlet } from "react-router";

export default function BaseLayout() {
    return <div className="flex flex-col bg-gray-800 h-screen">
        <Outlet></Outlet>
    </div>
}