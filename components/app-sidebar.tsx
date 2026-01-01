"use client"

import React, { useState } from "react"
import Image from "next/image"

import {
  Building2,
  Eye,
  FileText,
  Monitor,
  Network,
  Settings,
  TrendingUp,
  Handshake,
  FileCheck,
  FolderOpen,
  CheckSquare,
  Calendar,
  LogOut,
  User,
  Edit,
  FileSpreadsheet,
  Sparkles,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  onSectionChange?: (section: string) => void
  onLogout?: () => void
  currentUser?: {
    username: string
    role: string
  } | null
}

const menuItems = [
  {
    title: "viviworks",
    icon: Sparkles,
    key: "viviworks",
    highlight: true,
  },
  {
    title: "Votre entreprise",
    icon: Building2,
    key: "entreprise",
  },
  {
    title: "Sensibilisation",
    icon: Eye,
    key: "sensibilisation",
  },
  {
    title: "Règles incontournables",
    icon: FileText,
    key: "regles",
  },
  {
    title: "Showroom",
    icon: Monitor,
    key: "showroom",
  },
  {
    title: "L'arborescence",
    icon: Network,
    key: "arborescence",
  },
  {
    title: "Caractéristiques",
    icon: Settings,
    key: "caracteristiques",
  },
  {
    title: "Campagne Ads",
    icon: TrendingUp,
    key: "campagne",
  },
  {
    title: "Offre de partenariat",
    icon: Handshake,
    key: "offre",
  },
  {
    title: "Conditions de partenariat",
    icon: FileCheck,
    key: "conditions",
  },
  {
    title: "Dossier partenaire",
    icon: FolderOpen,
    key: "dossier",
  },
  {
    title: "Validation",
    icon: CheckSquare,
    key: "validation",
  },
  {
    title: "Modifications",
    icon: Edit,
    key: "modifications",
  },
  {
    title: "Devis",
    icon: FileSpreadsheet,
    key: "devis",
  },
  {
    title: "Liste des devis",
    icon: FileText,
    key: "liste-devis",
  },
  {
    title: "Prochaines étapes",
    icon: Calendar,
    key: "etapes",
  },
]

export function AppSidebar({ onSectionChange, onLogout, currentUser }: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [activeItem, setActiveItem] = useState<string>("viviworks")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleItemClick = (key: string) => {
    setActiveItem(key)
    onSectionChange?.(key)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleLogout = () => {
    onLogout?.()
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar className="border-r-0">
      <div className="bg-gradient-to-b from-black via-gray-950 to-black h-full flex flex-col overflow-hidden">
        {/* Header avec logo */}
        <SidebarHeader className="p-0 flex-shrink-0">
          <div className="relative overflow-hidden">
            {/* Fond animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0671] via-[#ff3d8f] to-[#FF0671] opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative px-4 py-5 flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <Image
                  src="/vivi.png"
                  alt="Viviworks"
                  width={32}
                  height={32}
                  className="w-7 h-7 md:w-8 md:h-8 object-contain"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <a 
                  href="https://www.viviworks.ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white font-bold text-lg md:text-xl tracking-tight cursor-pointer"
                >
                  viviworks<span className="text-white/70">.ai</span>
                </a>
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = activeItem === item.key
                  const isHovered = hoveredItem === item.key
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        className={`
                          relative group w-full rounded-xl py-3 px-3 
                          transition-all duration-300 ease-out
                          ${isActive 
                            ? "bg-gradient-to-r from-[#FF0671] to-[#ff3d8f] text-white shadow-lg shadow-[#FF0671]/30" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                          }
                        `}
                        onClick={() => handleItemClick(item.key)}
                        onMouseEnter={() => setHoveredItem(item.key)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {/* Indicateur actif */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                        )}
                        
                        {/* Icône avec effet */}
                        <div className={`
                          relative flex items-center justify-center w-8 h-8 rounded-lg mr-3
                          transition-all duration-300
                          ${isActive 
                            ? "bg-white/20" 
                            : isHovered 
                              ? "bg-[#FF0671]/20" 
                              : "bg-transparent"
                          }
                        `}>
                          <Icon className={`
                            w-4 h-4 md:w-5 md:h-5 transition-transform duration-300
                            ${isHovered && !isActive ? "scale-110" : ""}
                          `} />
                        </div>
                        
                        {/* Texte */}
                        <span className="flex-1 text-left text-sm font-medium truncate">
                          {item.title}
                        </span>
                        
                        {/* Flèche au hover */}
                        <ChevronRight className={`
                          w-4 h-4 transition-all duration-300
                          ${isActive || isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                        `} />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer avec utilisateur */}
        <div className="mt-auto border-t border-white/10">
          {currentUser && (
            <div className="p-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF0671] to-[#ff3d8f] rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-950" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {currentUser.username}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bouton déconnexion */}
          <div className="p-4 pt-0">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-center gap-2 
                py-3 px-4 rounded-xl
                bg-white/5 hover:bg-red-500/20 
                text-gray-400 hover:text-red-400
                transition-all duration-300
                group
              "
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
