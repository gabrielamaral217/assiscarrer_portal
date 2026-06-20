import type {
  LeadStatus,
  ProjectStatus,
  ProposalStatus,
  TaskStatus,
  UserRole,
} from "@/lib/types/database";
import {
  LayoutDashboard,
  Users2,
  FileText,
  BarChart3,
  FileBarChart,
  MessageCircle,
  KanbanSquare,
  HardDrive,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const LEAD_STATUS: Record<LeadStatus, { label: string; color: string }> = {
  novo: { label: "Novo", color: "#1971c2" },
  contatado: { label: "Contatado", color: "#0c8599" },
  qualificado: { label: "Qualificado", color: "#6741d9" },
  proposta: { label: "Proposta enviada", color: "#e67700" },
  ganho: { label: "Ganho", color: "#2f9e44" },
  perdido: { label: "Perdido", color: "#e03131" },
};
export const LEAD_PIPELINE: LeadStatus[] = [
  "novo",
  "contatado",
  "qualificado",
  "proposta",
  "ganho",
  "perdido",
];

export const PROJECT_STATUS: Record<ProjectStatus, { label: string; color: string }> = {
  briefing: { label: "Briefing", color: "#868e96" },
  em_andamento: { label: "Em andamento", color: "#1971c2" },
  revisao: { label: "Em revisão", color: "#e67700" },
  entregue: { label: "Entregue", color: "#2f9e44" },
  pausado: { label: "Pausado", color: "#e03131" },
};

export const PROPOSAL_STATUS: Record<ProposalStatus, { label: string; color: string }> = {
  rascunho: { label: "Rascunho", color: "#868e96" },
  enviada: { label: "Enviada", color: "#1971c2" },
  aceita: { label: "Aceita", color: "#2f9e44" },
  recusada: { label: "Recusada", color: "#e03131" },
};

export const TASK_STATUS: Record<TaskStatus, { label: string; color: string }> = {
  a_fazer: { label: "A fazer", color: "#868e96" },
  fazendo: { label: "Fazendo", color: "#1971c2" },
  concluido: { label: "Concluído", color: "#2f9e44" },
};
export const TASK_PIPELINE: TaskStatus[] = ["a_fazer", "fazendo", "concluido"];

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrador",
  marketing: "Marketing",
  arquiteta: "Arquiteta",
};

/** Matriz de acesso por módulo — usado no servidor e no cliente (módulo puro). */
export const ACCESS_MATRIX: Record<string, UserRole[]> = {
  dashboard: ["admin", "marketing", "arquiteta"],
  crm: ["admin", "marketing"],
  propostas: ["admin", "marketing"],
  analytics: ["admin", "marketing"],
  relatorios: ["admin", "marketing"],
  whatsapp: ["admin", "marketing"],
  trabalho: ["admin", "marketing", "arquiteta"],
  drive: ["admin", "marketing", "arquiteta"],
  admin: ["admin"],
};

export function canAccess(role: UserRole, module: string): boolean {
  return (ACCESS_MATRIX[module] ?? []).includes(role);
}

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  module: string;
};

export const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
  { href: "/crm", label: "CRM / Leads", icon: Users2, module: "crm" },
  { href: "/propostas", label: "Propostas", icon: FileText, module: "propostas" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, module: "analytics" },
  { href: "/relatorios", label: "Relatórios", icon: FileBarChart, module: "relatorios" },
  { href: "/whatsapp", label: "WhatsApp", icon: MessageCircle, module: "whatsapp" },
  { href: "/trabalho", label: "Área de trabalho", icon: KanbanSquare, module: "trabalho" },
  { href: "/drive", label: "Google Drive", icon: HardDrive, module: "drive" },
  { href: "/admin", label: "Administração", icon: Settings, module: "admin" },
];
