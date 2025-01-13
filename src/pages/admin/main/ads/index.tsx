import DashboardLayout from "@/components/admin/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import React from "react";

const Ads: NextPageWithLayout = () => {
  return <div>index</div>;
};

Ads.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Ads;
