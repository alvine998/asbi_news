import axiosInstance from "@/utils/api";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET, // Set this to a strong secret
    callbacks: {
        async signIn({ user }) {
            const email = user.email;
            // 🔹 Call your API to check if the email is allowed
            const res = await axiosInstance.get(`/users?email=${email}`);

            const data = await res.data?.items;

            if (data.length === 0) {
                return false; // 🔴 Reject login if not allowed
            }

            return true; // ✅ Allow login
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }: any) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
});
