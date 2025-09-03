import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
    return (
        <div className="flex h-full w-full bg-background">
            <DashboardClient/>
        </div>
    );
}