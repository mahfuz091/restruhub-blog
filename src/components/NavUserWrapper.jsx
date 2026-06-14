// app/(dashboard)/_components/NavUserWrapper.tsx
import { getUserProfile } from "@/app/actions/user/user.actions"
import { NavUser } from "./nav-user"

export default async function NavUserWrapper() {
  const { user } = await getUserProfile()

  if (!user) {
    return (
      <div className="text-sm text-gray-500 px-2 py-1">
        Not logged in
      </div>
    )
  }

  return <NavUser user={user} />
}
