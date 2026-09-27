import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { clerkEnabled } from "@/lib/auth";

const clerkConfigured = clerkEnabled && Boolean(process.env.CLERK_SECRET_KEY?.trim().startsWith("sk_"));
const clerk = clerkConfigured ? clerkMiddleware() : null;

// Without valid Clerk keys the app runs on the client-side mock session, so middleware is a pass-through.
// No routes are protected, so if Clerk ever fails at runtime we serve the page rather than a 500.
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!clerk) return NextResponse.next();
  try {
    return await clerk(req, event);
  } catch (err) {
    console.error("[middleware] Clerk failed; serving request without auth", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
