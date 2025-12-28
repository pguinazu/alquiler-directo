"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentRole } from "@/lib/api"
import type { UserRole } from "@/types"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  redirectTo?: string
}

export function AuthGuard({ children, allowedRoles, redirectTo = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const role = getCurrentRole()

    if (!role || !allowedRoles.includes(role)) {
      router.push(redirectTo)
    } else {
      setIsAuthorized(true)
    }
  }, [allowedRoles, redirectTo, router])

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
