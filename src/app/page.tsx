import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <h1 className="text-4xl font-semibold text-center text-primary">
                Edura – Your personal homework tracker
            </h1>
            <p className="text-lg sm:text-xl text-center mt-4">
                Edura is user-friendly tool that helps you
                organize your homework effectively and always keep track of everything.
                Plan, manage, and track—all in a personal environment.
            </p>
            <Link className="mt-6" href="/login">
                <Button className="bg-primary py-2 px-6 rounded-lg hover:bg-primary-dark transition-all duration-300">
                    Starte Jetzt
                </Button>
            </Link>
        </div>
    );
}
