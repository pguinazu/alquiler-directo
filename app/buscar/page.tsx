"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, MapPin, Home, User, Phone, Mail } from "lucide-react"
import type { PropertyListing, SearchFilters } from "@/types"
import { parseSearchQuery } from "@/lib/searchParser"
import { searchListings } from "@/lib/api"
import { RatingDisplay } from "@/components/rating-display"

export default function BuscarPage() {
  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <BuscarContent />
    </AuthGuard>
  )
}

function BuscarContent() {
  const [searchText, setSearchText] = useState("")
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [filters, setFilters] = useState<SearchFilters>({})
  const [interpretation, setInterpretation] = useState("")
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    setLoading(true)
    const result = await searchListings({})
    if (result.success) {
      setListings(result.listings)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    setLoading(true)
    const parsed = parseSearchQuery(searchText)
    setFilters(parsed.filters)
    setInterpretation(parsed.interpretation)

    const result = await searchListings({
      queryText: searchText,
      filters: parsed.filters,
    })

    if (result.success) {
      setListings(result.listings)
    }
    setLoading(false)
  }

  const handleFilterChange = async (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setLoading(true)

    const result = await searchListings({ filters: newFilters })
    if (result.success) {
      setListings(result.listings)
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Encontrá tu próximo hogar</h1>
            <p className="text-muted-foreground">Buscá con texto libre o usá los filtros avanzados</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Ej: departamento 2 ambientes en palermo hasta 800 dólares, acepta mascotas"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button onClick={handleSearch} size="lg" disabled={loading}>
              Buscar
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros de búsqueda</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Operación</Label>
                    <Select
                      value={filters.operation}
                      onValueChange={(value) => handleFilterChange({ ...filters, operation: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alquiler">Alquiler</SelectItem>
                        <SelectItem value="venta">Venta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Moneda</Label>
                    <Select
                      value={filters.currency}
                      onValueChange={(value) => handleFilterChange({ ...filters, currency: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Zona</Label>
                    <Input
                      placeholder="Ej: Palermo"
                      value={filters.zone || ""}
                      onChange={(e) => handleFilterChange({ ...filters, zone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Ambientes</Label>
                    <Select
                      value={filters.bedrooms?.toString()}
                      onValueChange={(value) => handleFilterChange({ ...filters, bedrooms: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 ambiente</SelectItem>
                        <SelectItem value="2">2 ambientes</SelectItem>
                        <SelectItem value="3">3 ambientes</SelectItem>
                        <SelectItem value="4">4+ ambientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de propiedad</Label>
                    <Select
                      value={filters.propertyType}
                      onValueChange={(value) => handleFilterChange({ ...filters, propertyType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="departamento">Departamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="ph">PH</SelectItem>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Interpretation */}
          {interpretation && (
            <div className="mb-6">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Interpretación de búsqueda:</span> {interpretation}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="mb-4">
            <p className="text-muted-foreground">
              {loading ? "Buscando..." : `${listings.length} propiedades encontradas`}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedListing(listing)}
              >
                <div className="aspect-video bg-muted relative">
                  <img
                    src={
                      listing.images?.[0] ||
                      `/placeholder.svg?height=300&width=400&query=apartment+interior` ||
                      "/placeholder.svg"
                    }
                    alt={listing.propertyAddress}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2">
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{listing.pricePeriodCurrency}</span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {listing.hasSalaryGuarantors
                            ? `Requiere garantía (${listing.guarantorsMinSalary})`
                            : "Sin garantía"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🐾</span>
                        <span>{listing.petsQuantitySizeAndType}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{listing.ownerName}</span>
                      </div>
                      <RatingDisplay rating={4.5} reviewCount={8} size="sm" />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedListing(listing)
                      }}
                    >
                      Ver detalle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {listings.length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron propiedades</h3>
                <p className="text-muted-foreground">Intentá con otros criterios de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedListing.propertyTypeAndSize}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={
                      selectedListing.images?.[0] ||
                      `/placeholder.svg?height=400&width=600&query=apartment+interior` ||
                      "/placeholder.svg"
                    }
                    alt={selectedListing.propertyAddress}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-2xl mb-2">{selectedListing.pricePeriodCurrency}</h3>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5" />
                    <span>{selectedListing.propertyAddress}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Descripción</h4>
                  <p className="text-muted-foreground">
                    {selectedListing.description || "Hermosa propiedad en excelente ubicación."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Requisitos</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      •{" "}
                      {selectedListing.hasSalaryGuarantors
                        ? `Requiere garantía propietaria o sueldo mínimo de ${selectedListing.guarantorsMinSalary}`
                        : "No requiere garantía propietaria"}
                    </li>
                    <li>• {selectedListing.petsQuantitySizeAndType}</li>
                    <li>• Garantía del propietario: {selectedListing.hasLandlordGuarantors}</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold">Información del propietario</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedListing.ownerName}</span>
                    </div>
                    <RatingDisplay rating={4.5} reviewCount={8} size="sm" />
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedListing.ownerEmail}`} className="text-primary hover:underline">
                        {selectedListing.ownerEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedListing.ownerPhone}`} className="text-primary hover:underline">
                        {selectedListing.ownerPhone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Contactar</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Guardar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
