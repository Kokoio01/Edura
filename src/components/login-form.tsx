'use client'
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {signIn} from "@/lib/auth-client";
import {FormEvent, useEffect, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";
import {useTranslations} from "next-intl";
import posthog from "posthog-js"

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const t = useTranslations("LoginForm");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [redirectTo, setRedirectTo] = useState("/dashboard");
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [RememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // TODO: Prevent Phisihing here
        const redirect = searchParams.get("redirect");
        if (redirect) setRedirectTo(redirect);
        else setRedirectTo("/dashboard");
    }, [searchParams]);

    async function onSubmit(e:FormEvent) {
        e.preventDefault()
        await signIn.email({
            email: email,
            password: pass,
            rememberMe: RememberMe
        },
        {
            onRequest: async () => {
                setLoading(true);
                setError("");
            },
            onResponse: async (ctx) => {
                setLoading(false);
                const cloned = ctx.response.clone();
                const json = await cloned.json();
                if (cloned.status === 200) {
                    if (json.user && json.user.id) {
                        posthog.identify(json.user.id);
                    }
                    router.push(redirectTo);
                } else {
                    setError(json.message);
                }
            },
        }
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t("title")}</CardTitle>
                    <CardDescription>
                        {t("subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                {error !== "" ? (
                                    <div className="grid gap-3">
                                        <span className="text-red-600 text-center text-sm">
                                          {error}
                                        </span>
                                    </div>
                                ) : null}
                                <div className="grid gap-3">
                                    <Label htmlFor="email">{t("email")}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t("email_placeholder")}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">{t("password")}</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            {t("forgot_password")}
                                        </a>
                                    </div>
                                    <Input id="password" type="password" required
                                           onChange={(e) => setPass(e.target.value)}/>
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            onClick={() => {
                                                setRememberMe(!RememberMe);
                                            }}
                                        />
                                        <Label htmlFor="remberme">{t("remember_me")}</Label>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {t("login")}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                {t("no_account")} {" "}
                                <a href="#" className="underline underline-offset-4">
                                    {t("sign_up")}
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                {t("terms_prefix")} <a href="#">{t("terms_tos")}</a>{" "}
                {t("terms_and")} <a href="#">{t("terms_pp")}</a>.
            </div>
        </div>
    )
}
