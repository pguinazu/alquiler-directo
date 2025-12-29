"use client"

import { Building2, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getCurrentRole, logout } from "@/lib/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = getCurrentUser()
  const role = getCurrentRole()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (pathname === "/login") {
    return null
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Alquiler Directo</span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <>
                {role === "tenant" && (
                  <Button variant="ghost" asChild>
                    <Link href="/buscar">Buscar Propiedades</Link>
                  </Button>
                )}
                {role === "landlord" && (
                  <Button variant="ghost" asChild>
                    <Link href="/mis-publicaciones">Mis Publicaciones</Link>
                  </Button>
                )}
                {role === "admin" && (
                  <Button variant="ghost" asChild>
                    <Link href="/admin">Panel Admin</Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
