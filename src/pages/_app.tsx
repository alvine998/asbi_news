import DashboardLayout from "@/components/admin/Layout";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useParams, usePathname } from "next/navigation";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const pathname = usePathname();

  return (
    <SessionProvider session={session}>
      {!pathname?.includes("admin") && (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      {pathname?.includes("login") && <Component {...pageProps} />}
      {pathname?.includes("admin") && (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      )}
    </SessionProvider>
  );
}
