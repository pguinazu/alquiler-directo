"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2 } from "lucide-react"
import { loginWithRole } from "@/lib/api"
import type { UserRole } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, role: UserRole) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await loginWithRole(email, password, role)
      if (result.success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido ${email}`,
        })

        // Redirect based on role
        if (role === "tenant") {
          router.push("/buscar")
        } else if (role === "landlord") {
          router.push("/mis-publicaciones")
        } else {
          router.push("/admin")
        }
      } else {
        const errorMessage =
          result.error === "WRONG_PASSWORD" ? "Contraseña incorrecta" : result.error || "Error al iniciar sesión"

        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      })
    } finally {
      setLoading(false)
    }
  }

  const LoginForm = ({ role }: { role: UserRole }) => (
    <form onSubmit={(e) => handleLogin(e, role)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`email-${role}`}>Email</Label>
        <Input id={`email-${role}`} name="email" type="email" placeholder="tu@email.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`password-${role}`}>Contraseña</Label>
        <Input id={`password-${role}`} name="password" type="password" placeholder="••••••••" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Bienvenido a Alquiler Directo</CardTitle>
          <CardDescription>Ingresá con tu rol para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tenant" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tenant">Inquilino</TabsTrigger>
              <TabsTrigger value="landlord">Propietario</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="tenant" className="mt-6">
              <LoginForm role="tenant" />
            </TabsContent>
            <TabsContent value="landlord" className="mt-6">
              <LoginForm role="landlord" />
            </TabsContent>
            <TabsContent value="admin" className="mt-6">
              <LoginForm role="admin" />
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/registro" className="text-primary hover:underline">
              Registrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
