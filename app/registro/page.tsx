"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2 } from "lucide-react"
import { createTenantUser, createOwnerUser } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleTenantSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    try {
      const result = await createTenantUser({
        name,
        email,
        phone,
        address,
        userType: "tenant",
      })

      if (result.success) {
        toast({
          title: "Cuenta creada exitosamente",
          description: "Ya podés iniciar sesión con tu email",
        })
        router.push("/login")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Error al crear la cuenta",
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

  const handleOwnerSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    try {
      const result = await createOwnerUser({
        name,
        email,
        phone,
        address,
        userType: "landlord",
        propertyAddress: "",
        propertyTypeAndSize: "",
        pricePeriodCurrency: "",
        hasSalaryGuarantors: false,
        hasLandlordGuarantors: "",
      })

      if (result.success) {
        toast({
          title: "Cuenta creada exitosamente",
          description: "Ya podés iniciar sesión con tu email",
        })
        router.push("/login")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Error al crear la cuenta",
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

  const TenantSignUpForm = () => (
    <form onSubmit={handleTenantSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name-tenant">Nombre completo</Label>
        <Input id="name-tenant" name="name" type="text" placeholder="Juan Pérez" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-tenant">Email</Label>
        <Input id="email-tenant" name="email" type="email" placeholder="tu@email.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-tenant">Teléfono</Label>
        <Input id="phone-tenant" name="phone" type="tel" placeholder="+54 11 1234-5678" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address-tenant">Dirección actual</Label>
        <Input id="address-tenant" name="address" type="text" placeholder="Av. Corrientes 1234" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta de Inquilino"}
      </Button>
    </form>
  )

  const OwnerSignUpForm = () => (
    <form onSubmit={handleOwnerSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name-owner">Nombre completo</Label>
        <Input id="name-owner" name="name" type="text" placeholder="María González" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-owner">Email</Label>
        <Input id="email-owner" name="email" type="email" placeholder="tu@email.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-owner">Teléfono</Label>
        <Input id="phone-owner" name="phone" type="tel" placeholder="+54 11 1234-5678" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address-owner">Dirección</Label>
        <Input id="address-owner" name="address" type="text" placeholder="Av. Santa Fe 1234" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta de Propietario"}
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
          <CardTitle className="text-2xl">Crear cuenta en InmoApp</CardTitle>
          <CardDescription>Elegí tu tipo de cuenta para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tenant" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tenant">Inquilino</TabsTrigger>
              <TabsTrigger value="owner">Propietario</TabsTrigger>
            </TabsList>
            <TabsContent value="tenant" className="mt-6">
              <TenantSignUpForm />
            </TabsContent>
            <TabsContent value="owner" className="mt-6">
              <OwnerSignUpForm />
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Iniciá sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
