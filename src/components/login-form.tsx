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

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
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
                setError(json.message);
                if (cloned.status === 200) {
                    console.log(redirectTo);
                    router.push(redirectTo);
                }
            },
        }
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Account
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
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
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
                                        <Label htmlFor="remberme">Remember Me</Label>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    Login
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <a href="#" className="underline underline-offset-4">
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
