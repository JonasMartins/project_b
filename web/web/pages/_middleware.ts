import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookie_name, existentRoutes } from "utils/consts";

export function middleware(req: NextRequest) {
    let cookie = req.cookies[cookie_name];
    if (!cookie && req.page.name) {
        if (
            req.page.name !== "/login" &&
            existentRoutes.includes(req.page.name)
        ) {
            return NextResponse.redirect("/login");
        }
    }
    return NextResponse.next();
}
