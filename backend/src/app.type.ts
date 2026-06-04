import { auth } from "backend/lib/auth"

interface Variables {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}

export interface AppContext {
  Variables: Variables
}

export interface AppAuthContext {
  Variables: {
    user: typeof auth.$Infer.Session.user
    session: typeof auth.$Infer.Session.session
  }
}
