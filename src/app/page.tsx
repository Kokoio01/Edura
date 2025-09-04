import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {getTranslations} from "next-intl/server";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const t = await getTranslations("HomePage")

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <h1 className="text-4xl font-semibold text-center text-primary">
                {t("title")}
            </h1>
            <p className="text-lg sm:text-xl text-center mt-4">
                {t("description")}
            </p>
            <Link className="mt-6" href="/login">
                <Button className="bg-primary py-2 px-6 rounded-lg hover:bg-primary-dark transition-all duration-300">
                    {t("button")}
                </Button>
            </Link>
        </div>
    );
}
