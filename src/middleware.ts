import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ['/', '/services', '/about-us', '/resources'],

  // This is where we will handle checking if the account exists in our database
  // and starting the sign in/sign up work flow
  afterAuth: (auth, req) => {

    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (global.sessionId !== auth.sessionId) {
      const userId = auth?.userId;

      if (!userId && !auth.isPublicRoute) {
        const signInUrl = new URL('/sign-in', req.url);

        signInUrl.searchParams.set('redirect_url', req.url);

        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        global.sessionId = auth.sessionId;
        return NextResponse.redirect(signInUrl.toString(), { status: 302 });
      }

      if (userId && req.nextUrl.pathname !== '/signInRedirect') {
        const signInRedirectURL = new URL('/signInRedirect', req.url);

        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        global.sessionId = auth.sessionId;
        return NextResponse.redirect(signInRedirectURL.toString(), { status: 302 });
      }
    }
    
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    global.sessionId = auth.sessionId;
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/",  "/(api|trpc)(.*)"],
};