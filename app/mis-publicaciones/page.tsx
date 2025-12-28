"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Pause, Play, MapPin } from "lucide-react"
import type { PropertyListing } from "@/types"
import { createListing, updateListing, deleteListing, getCurrentUser, getMyListings } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function MisPublicacionesPage() {
  return (
    <AuthGuard allowedRoles={["landlord"]}>
      <MisPublicacionesContent />
    </AuthGuard>
  )
}

function MisPublicacionesContent() {
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingListing, setEditingListing] = useState<PropertyListing | null>(null)
  const { toast } = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    const result = await getMyListings()

    if (result.success) {
      setListings(result.listings)
    } else {
      console.error("[v0] Error loading listings:", result.error)
      toast({
        title: "Error al cargar publicaciones",
        description: result.error || "Intente nuevamente",
        variant: "destructive",
      })
      setListings([])
    }
  }

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const listingData = {
      ownerName: user?.name || "",
      ownerEmail: user?.email || "",
      ownerPhone: formData.get("phone") as string,
      propertyAddress: formData.get("propertyAddress") as string,
      propertyTypeAndSize: formData.get("propertyTypeAndSize") as string,
      pricePeriodCurrency: formData.get("pricePeriodCurrency") as string,
      hasSalaryGuarantors: formData.get("hasSalaryGuarantors") === "true",
      guarantorsMinSalary: formData.get("guarantorsMinSalary") as string,
      petsQuantitySizeAndType: formData.get("petsQuantitySizeAndType") as string,
      hasLandlordGuarantors: formData.get("hasLandlordGuarantors") as string,
      status: "published" as const,
      description: formData.get("description") as string,
    }

    if (editingListing) {
      await updateListing(editingListing.id, listingData)
      toast({ title: "Publicación actualizada" })
    } else {
      await createListing(listingData)
      toast({ title: "Publicación creada exitosamente" })
    }

    setShowCreateDialog(false)
    setEditingListing(null)
    loadListings()
  }

  const handleToggleStatus = async (listing: PropertyListing) => {
    const newStatus = listing.status === "published" ? "paused" : "published"
    await updateListing(listing.id, { status: newStatus })
    toast({
      title: newStatus === "published" ? "Publicación activada" : "Publicación pausada",
    })
    loadListings()
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta publicación?")) {
      await deleteListing(id)
      toast({ title: "Publicación eliminada" })
      loadListings()
    }
  }

  const ListingForm = () => (
    <form onSubmit={handleCreateOrUpdate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="propertyAddress">Dirección de la propiedad *</Label>
        <Input
          id="propertyAddress"
          name="propertyAddress"
          placeholder="Ej: Av. Santa Fe 3800, Palermo"
          defaultValue={editingListing?.propertyAddress}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyTypeAndSize">Tipo y tamaño *</Label>
        <Input
          id="propertyTypeAndSize"
          name="propertyTypeAndSize"
          placeholder="Ej: Departamento 3 ambientes, 65m²"
          defaultValue={editingListing?.propertyTypeAndSize}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pricePeriodCurrency">Precio y moneda *</Label>
        <Input
          id="pricePeriodCurrency"
          name="pricePeriodCurrency"
          placeholder="Ej: USD 700/mes"
          defaultValue={editingListing?.pricePeriodCurrency}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe la propiedad..."
          defaultValue={editingListing?.description}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hasSalaryGuarantors">¿Requiere garantía de sueldo? *</Label>
        <Select name="hasSalaryGuarantors" defaultValue={editingListing?.hasSalaryGuarantors ? "true" : "false"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Sí</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guarantorsMinSalary">Sueldo mínimo de garantes</Label>
        <Input
          id="guarantorsMinSalary"
          name="guarantorsMinSalary"
          placeholder="Ej: USD 2000"
          defaultValue={editingListing?.guarantorsMinSalary}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="petsQuantitySizeAndType">Mascotas *</Label>
        <Input
          id="petsQuantitySizeAndType"
          name="petsQuantitySizeAndType"
          placeholder="Ej: Acepta mascotas pequeñas"
          defaultValue={editingListing?.petsQuantitySizeAndType}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hasLandlordGuarantors">Garantía del propietario *</Label>
        <Select
          name="hasLandlordGuarantors"
          defaultValue={editingListing?.hasLandlordGuarantors || "libre disposición"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="libre disposición">Libre disposición</SelectItem>
            <SelectItem value="bien de familia">Bien de familia</SelectItem>
            <SelectItem value="no">No tiene</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono de contacto *</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="+54 11 1234-5678"
          defaultValue={editingListing?.ownerPhone}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {editingListing ? "Actualizar" : "Crear"} Publicación
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowCreateDialog(false)
            setEditingListing(null)
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mis Publicaciones</h1>
              <p className="text-muted-foreground">Administrá tus propiedades y publicaciones</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Crear Aviso
            </Button>
          </div>

          {listings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No tenés publicaciones</h3>
                <p className="text-muted-foreground mb-4">
                  Creá tu primera publicación para empezar a recibir consultas
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Publicación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={
                        listing.images?.[0] ||
                        `/placeholder.svg?height=300&width=400&query=apartment` ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={listing.propertyAddress}
                      className="object-cover w-full h-full"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant={listing.status === "published" ? "default" : "secondary"}
                    >
                      {listing.status === "published" ? "Publicado" : "Pausado"}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{listing.propertyTypeAndSize}</CardTitle>
                    <CardDescription className="flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {listing.propertyAddress}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-primary">{listing.pricePeriodCurrency}</div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingListing(listing)
                            setShowCreateDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleStatus(listing)}>
                          {listing.status === "published" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(listing.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open)
          if (!open) setEditingListing(null)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingListing ? "Editar" : "Crear"} Publicación</DialogTitle>
          </DialogHeader>
          <ListingForm />
        </DialogContent>
      </Dialog>
    </>
  )
}
