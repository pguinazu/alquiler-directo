"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { getCurrentUser, getCurrentRole } from "@/lib/api"
import { RatingDisplay } from "@/components/rating-display"
import { mockReviews } from "@/lib/mockData"

export default function PerfilPage() {
  return (
    <AuthGuard allowedRoles={["tenant", "landlord", "admin"]}>
      <PerfilContent />
    </AuthGuard>
  )
}

function PerfilContent() {
  const user = getCurrentUser()
  const role = getCurrentRole()

  const roleLabels = {
    tenant: "Inquilino",
    landlord: "Propietario",
    admin: "Administrador",
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>

          <div className="grid gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{user?.name || "Usuario"}</CardTitle>
                      <Badge>{roleLabels[role as keyof typeof roleLabels]}</Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user?.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        +54 11 1234-5678
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Buenos Aires, Argentina
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Miembro desde enero 2024
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Rating Card */}
            {role !== "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Calificaciones</CardTitle>
                  <CardDescription>
                    Lo que otros usuarios opinan sobre {role === "tenant" ? "ti" : "tus propiedades"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <RatingDisplay rating={4.5} reviewCount={mockReviews.length} size="lg" />
                  </div>

                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.userName}</p>
                            <RatingDisplay rating={review.rating} reviewCount={0} size="sm" showCount={false} />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
