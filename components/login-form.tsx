"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { toast } from "sonner"
import { ViviworksLogo } from "@/components/viviworks-logo"

interface LoginFormProps {
  onLogin: (success: boolean, username?: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Vérification des identifiants
    if ((username === "aymen" && password === "aymen2025") || 
        (username === "mustafa" && password === "must2025")) {
      toast.success("Connexion réussie ! Bienvenue chez Viviworks")
      onLogin(true, username)
    } else {
      toast.error("Identifiants incorrects. Veuillez vérifier votre nom d'utilisateur et mot de passe.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-6 sm:mb-8">
          <ViviworksLogo size="xl" showTagline={false} className="mb-4 sm:mb-6" />
          <p className="text-gray-600 text-sm sm:text-base">Accédez à votre espace de présentation</p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Connexion
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500">
              Entrez vos identifiants pour continuer
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Nom d'utilisateur */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Nom d'utilisateur
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre nom d'utilisateur"
                    className="pl-10 h-11 sm:h-12 border-gray-300 focus:border-[#804d3b] focus:ring-[#804d3b] bg-white"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="pl-10 pr-10 h-11 sm:h-12 border-gray-300 focus:border-[#804d3b] focus:ring-[#804d3b] bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 sm:h-12 bg-[#804d3b] hover:bg-[#6a3f2f] text-white font-semibold text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Note mobile */}
        <div className="mt-4 sm:hidden text-center">
          <p className="text-xs text-gray-500">
            Interface optimisée pour mobile
          </p>
        </div>
      </div>
    </div>
  )
}