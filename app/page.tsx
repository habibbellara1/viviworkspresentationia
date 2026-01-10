"use client"

import { ViviworksContent } from "@/components/viviworks-content"
import { EntrepriseFormSimple } from "@/components/entreprise-form-simple"
import { SensibilisationContent } from "@/components/sensibilisation-content"
import { ReglesIncontournablesContent } from "@/components/regles-incontournables-content"
import { ShowroomContent } from "@/components/showroom-content"
import { CaracteristiquesContent } from "@/components/caracteristiques-content"
import { CampagneAdsContent } from "@/components/campagne-ads-content"
import { OffrePartenariatContent } from "@/components/offre-partenariat-content"
import { ConditionsPartenariatContent } from "@/components/conditions-partenariat-content"
import { ArborescenceContent } from "@/components/arborescence-content"
import { ValidationContent } from "@/components/validation-content"
import { DossierPartenaireContent } from "@/components/dossier-partenaire-content"
import { ModificationsContent } from "@/components/modifications-content"
import { DevisContent } from "@/components/devis-content"
import { ListeDevisContent } from "@/components/liste-devis-content"
import { EtapesPartenariatContent } from "@/components/etapes-partenariat-content"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { LoginForm } from "@/components/login-form"
import { Toaster } from "@/components/ui/sonner"
import { User, Menu } from "lucide-react"
import { ViviworksLogo } from "@/components/viviworks-logo"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier si l'utilisateur est déjà connecté au chargement de la page
  useEffect(() => {
    const loginStatus = localStorage.getItem('viviworks-login')
    const savedUser = localStorage.getItem('viviworks-user')
    if (loginStatus === 'true' && savedUser) {
      setIsLoggedIn(true)
      setCurrentUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (success: boolean, username?: string) => {
    setIsLoggedIn(success)
    if (success && username) {
      const userInfo = {
        username: username,
        role: "Administrateur"
      }
      setCurrentUser(userInfo)
      localStorage.setItem('viviworks-login', 'true')
      localStorage.setItem('viviworks-user', JSON.stringify(userInfo))
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('viviworks-login')
    localStorage.removeItem('viviworks-user')
  }

  // Afficher un écran de chargement pendant la vérification de l'état de connexion
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur n'est pas connecté, afficher l'interface de connexion
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLogin={handleLogin} />
        <Toaster />
      </>
    )
  }

  // Si l'utilisateur est connecté, afficher l'application principale
  return (
    <>
      <SidebarProvider>
        <AppSidebar 
          onSectionChange={setActiveSection} 
          onLogout={handleLogout} 
          currentUser={currentUser}
        />
        <SidebarInset>
          {/* Header mobile avec bouton de menu */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <ViviworksLogo size="sm" showTagline={false} />
            </div>
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#804d3b] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser.username}
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-2 sm:p-3 md:p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {activeSection === "viviworks" ? (
                <ViviworksContent />
              ) : activeSection === "entreprise" ? (
                <EntrepriseFormSimple />
              ) : activeSection === "etapes-partenariat" ? (
                <EtapesPartenariatContent />
              ) : activeSection === "sensibilisation" ? (
                <SensibilisationContent />
              ) : activeSection === "regles" ? (
                <ReglesIncontournablesContent />
              ) : activeSection === "showroom" ? (
                <ShowroomContent />
              ) : activeSection === "caracteristiques" ? (
                <CaracteristiquesContent />
              ) : activeSection === "campagne" ? (
                <CampagneAdsContent />
              ) : activeSection === "offre" ? (
                <OffrePartenariatContent />
              ) : activeSection === "conditions" ? (
                <ConditionsPartenariatContent />
              ) : activeSection === "arborescence" ? (
                <ArborescenceContent />
              ) : activeSection === "validation" ? (
                <ValidationContent />
              ) : activeSection === "dossier" ? (
                <DossierPartenaireContent />
              ) : activeSection === "modifications" ? (
                <ModificationsContent />
              ) : activeSection === "devis" ? (
                <DevisContent />
              ) : activeSection === "liste-devis" ? (
                <ListeDevisContent />
              ) : (
                <div className="text-center py-8 sm:py-12 md:py-20">
                  <div className="max-w-2xl mx-auto px-4">
                    <div className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <ViviworksLogo size="xl" showTagline={false} className="mb-4" />
                      <div className="text-center">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                          Bienvenue chez Viviworks
                        </h1>
                        {currentUser && (
                          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                            <span className="text-slate-600 text-sm sm:text-base md:text-lg">
                              Connecté en tant que <strong className="text-blue-600">{currentUser.username}</strong>
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {currentUser.role}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm sm:text-base md:text-lg">
                      Sélectionnez une section dans la sidebar pour commencer.
                    </p>
                    
                    {/* Indicateur mobile */}
                    <div className="mt-6 sm:hidden bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Menu className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700">
                          Utilisez le bouton menu pour naviguer
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  )
}
