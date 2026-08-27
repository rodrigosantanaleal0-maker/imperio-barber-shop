import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/barbeiro", "/admin"];
const LOGIN_PATH: Record<string, string> = {
  "/barbeiro": "/barbeiro/login",
  "/admin": "/admin/login",
};

// Proxy faz só a checagem OTIMISTA (existe sessão?) e redireciona pro login
// correspondente antes de renderizar qualquer coisa. A autorização por role
// (barber/admin) é sempre revalidada no servidor mais perto dos dados — ver
// src/infrastructure/auth/guards.ts, chamado em cada layout/page protegida.
// O proxy nunca deve ser a única linha de defesa.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const matchedPrefix = PROTECTED_PREFIXES.find(
    (prefix) => path.startsWith(prefix) && !path.startsWith(`${prefix}/login`),
  );

  if (matchedPrefix && !user) {
    const loginUrl = new URL(LOGIN_PATH[matchedPrefix], request.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
