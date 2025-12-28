"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Home, TrendingUp, DollarSign } from "lucide-react"

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminContent />
    </AuthGuard>
  )
}

function AdminContent() {
  const stats = [
    {
      title: "Total Usuarios",
      value: "1,234",
      change: "+12% del mes anterior",
      icon: Users,
    },
    {
      title: "Propiedades Activas",
      value: "567",
      change: "+8% del mes anterior",
      icon: Home,
    },
    {
      title: "Matches Exitosos",
      value: "89",
      change: "+23% del mes anterior",
      icon: TrendingUp,
    },
    {
      title: "Valor Promedio",
      value: "USD 650",
      change: "+5% del mes anterior",
      icon: DollarSign,
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios Recientes</CardTitle>
                <CardDescription>Últimos registros en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">Usuario {i}</p>
                        <p className="text-sm text-muted-foreground">usuario{i}@example.com</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Hace {i}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publicaciones Recientes</CardTitle>
                <CardDescription>Últimas propiedades publicadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">Propiedad en Palermo</p>
                        <p className="text-sm text-muted-foreground">USD {500 + i * 50}/mes</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Hace {i}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
