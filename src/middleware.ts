import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id ?? null;
    if (!userId) {
        const {pathname} = req.nextUrl;
        const encodedPath = encodeURIComponent(pathname);
        const loginUrl = new URL(`/login?next=${encodedPath}`, req.url);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}
export const config = {
    matcher: ['/dashboard/:path*', '/subject/:path*'],
    runtime: "nodejs",
};
