import { auth } from "./lib/auth"

interface Variables {
  user: typeof auth.$Infer.Session.user
  session: typeof auth.$Infer.Session.session
}

export interface AppContext {
  Variables: Variables
}
