import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { api } from "~/utils/api";

type Props = {
    children?: ReactNode
}

const SignInRedirect: React.FC<Props> = (props) => {
    console.log('Redirect Props: ', props);
    const router = useRouter();
    const { user } = useUser();

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId });

    // TODO: This should use the loading component
    if (accountQuery.isLoading)
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
                <h1 className="text-4xl font-thin mb-10">loading...</h1>
            </div>
        );

    const account = accountQuery.data;

    if (account == null && !user)
        router.push('/').catch((err) => console.error(err));

    if (account == null && user)
        router.push('/account/creation').catch((err) => console.error(err));

    if (account?.id != null && user)
        router.push(`/account/${account?.id}`).catch((err) => console.error(err));

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin mb-10">Sign In Redirect</h1>
        </div>
    );
}

export default SignInRedirect;