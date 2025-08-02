import { logout } from '@/app/(auth)/login/actions'

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="w-full text-left px-3 py-2 hover:bg-muted rounded-md">
        Log out
      </button>
    </form>
  )
}
