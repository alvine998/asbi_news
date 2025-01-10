// pages/admin/dashboard.tsx
import DashboardLayout from "@/components/admin/Layout";
import type { NextPageWithLayout } from "@/pages/_app";

const Dashboard: NextPageWithLayout = () => {
  return <div>Welcome to the Admin Dashboard</div>;
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
