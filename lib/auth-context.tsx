import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getImageBase64DataUrl } from "./_core/image-base64";
import { getApiBaseUrl } from "@/constants/oauth";
import superjson from "superjson";

// Função utilitária para adicionar notificação de novo cadastro
const addNewRegistrationNotification = async (userName: string, userEmail: string, unitName: string) => {
  try {
    const NOTIFICATIONS_KEY = "@grupo_one_notifications";
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const existingNotifications = stored ? JSON.parse(stored) : [];
    
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: "system",
      title: "🔔 Novo cadastro pendente",
      message: `${userName} (${unitName}) solicitou acesso ao aplicativo.`,
      data: { 
        type: "new_registration",
        userEmail,
        userName,
        unitName 
      },
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Verificar se já existe notificação para este cadastro hoje
    const today = new Date().toISOString().split("T")[0];
    const isDuplicate = existingNotifications.some((n: any) => {
      const nDate = new Date(n.createdAt).toISOString().split("T")[0];
      return (
        n.type === "system" &&
        n.data?.type === "new_registration" &&
        n.data?.userEmail === userEmail &&
        nDate === today
      );
    });

    if (!isDuplicate) {
      const updatedNotifications = [newNotification, ...existingNotifications];
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    }
  } catch (error) {
    // Erro silencioso
  }
};

export type AppRole = "socio" | "gerente" | "consultora" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface AppUser {
  id: number;
  name: string;
  email: string;
  appRole: AppRole;
  unitIds: number[]; // Sócios podem ter múltiplas unidades
  unitNames: string[];
  avatarUrl?: string;
  photoUrl?: string;
  approvalStatus: ApprovalStatus;
  registeredAt?: Date;
  saudacao?: string;
}

export interface Unit {
  id: number;
  name: string;
  city: string;
  state: string;
}

export interface UnitAccess {
  unitName: string;
  relatoriosMensais: string;
  notasFiscais: string;
  fonteDados: string;
}

export interface PendingUser {
  id: number;
  name: string;
  email: string;
  appRole: AppRole;
  unitId: number;
  unitName: string;
  avatarUrl?: string;
  registeredAt: Date;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSocio: boolean;
  loading: boolean;
  units: Unit[];
  pendingUsers: PendingUser[];
  getUserUnitAccess: () => UnitAccess[];
  login: (identifier: string, password: string) => Promise<{ success: boolean; pending?: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  approveUser: (userId: number) => Promise<void>;
  rejectUser: (userId: number) => Promise<void>;
  logout: () => Promise<void>;
  refreshPendingUsers: () => Promise<void>;
  updateProfilePhoto: (photoUrl: string) => Promise<void>;
  updateProfile: (data: { name?: string; unitId?: number }) => Promise<void>;
  removeUser: (userEmail: string) => Promise<void>;
  getApprovedUsers: () => { email: string; name: string; appRole: AppRole; unitNames: string[] }[];
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  unitId: number;
  appRole: "gerente" | "consultora";
  photo: { uri: string; mimeType?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "@grupo_one_user";
const REGISTERED_USERS_KEY = "@grupo_one_registered_users";
const PENDING_USERS_KEY = "@grupo_one_pending_users";

// E-mail do administrador
const ADMIN_EMAIL = "agenciatrafegon@gmail.com";

// Unidades do Grupo ONE
export const UNITS: Unit[] = [
  { id: 1, name: "Araripina", city: "Araripina", state: "PE" },
  { id: 2, name: "Serra Talhada", city: "Serra Talhada", state: "PE" },
  { id: 3, name: "Garanhuns", city: "Garanhuns", state: "PE" },
  { id: 4, name: "Cajazeiras", city: "Cajazeiras", state: "PB" },
  { id: 5, name: "Vitória de Santo Antão", city: "Vitória de Santo Antão", state: "PE" },
  { id: 6, name: "Santana do Livramento", city: "Santana do Livramento", state: "RS" },
  { id: 7, name: "Muriaé", city: "Muriaé", state: "MG" },
  { id: 8, name: "Vilhena", city: "Vilhena", state: "RO" },
  { id: 9, name: "Corumbá", city: "Corumbá", state: "MS" },
  { id: 10, name: "Fortaleza", city: "Fortaleza", state: "CE" },
  { id: 11, name: "Macaé Shopping", city: "Macaé", state: "RJ" },
  { id: 12, name: "Macaé Centro", city: "Macaé", state: "RJ" },
];

// Configuração de acesso por unidade (links do Drive)
const UNIT_ACCESS_CONFIG: Record<string, UnitAccess> = {
  "Araripina": {
    unitName: "Araripina",
    relatoriosMensais: "https://drive.google.com/drive/folders/1_ruchybS9pn0wJLPPxQ532ERujkaFkXv?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1KzbqZIewrEoKOajE3fO8ktOG25GCyb9z?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI/edit?usp=sharing",
  },
  "Serra Talhada": {
    unitName: "Serra Talhada",
    relatoriosMensais: "https://drive.google.com/drive/folders/1rGELW3lZHYCSWwdxa-hKR2q3jHPi-RHy?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/19gVgCa02Hew0kZhek7FmUMG0FvY-_yKH?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/1xkhRGEhHMyntv2DcGtZPovX3vAzKglqEnbIRAFPxx10/edit?usp=sharing",
  },
  "Vitória de Santo Antão": {
    unitName: "Vitória de Santo Antão",
    relatoriosMensais: "https://drive.google.com/drive/folders/1wJRrTnvmljdl6rAUdCiV-h8BjNjGUrDI?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/11LxWga_VVM2BRszI06pCdjNuM5EKxXn1?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/1bZYM4-lw-7TWMtNcgX1apj5jrSpR1pBPXKAVxciSOWo/edit?usp=sharing",
  },
  "Santana do Livramento": {
    unitName: "Santana do Livramento",
    relatoriosMensais: "https://drive.google.com/drive/folders/1j_r24CSTMmCNogC0gTjBhj7MwRG2i0ka?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1naISJBwVcAnHG5PLHOFU1DbTh-BRVcgP?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/1NOeinp7l0oiXKb5zdjzmJ6C1YwMmwrsAqBrfGgnJ0cU/edit?usp=sharing",
  },
  "Muriaé": {
    unitName: "Muriaé",
    relatoriosMensais: "https://drive.google.com/drive/folders/1ujtuox4piCGb9J301p90v-XuPMH7sn__?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/13X2o3N3Zw0CkCCdi7bjgoF1Sq_4SARge?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/12kkXFpvxDbn-iOAEph1BW6kVJCed2C41ht37rPt6ZJM/edit?usp=sharing",
  },
  "Garanhuns": {
    unitName: "Garanhuns",
    relatoriosMensais: "https://drive.google.com/drive/folders/1iKWGCbn1WwmHAb9mnpqwCXhVBs2igiD_?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1kUjXtqx4kkO5ZjL_FcDm6vVEMh7TRXiv?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/1XPFZn437dv9wzMG7jX9kZVpPhsuzlRkWPlhmSC19DYY/edit?usp=sharing",
  },
  "Cajazeiras": {
    unitName: "Cajazeiras",
    relatoriosMensais: "https://drive.google.com/drive/folders/10HR6RhTKkvRxEy5N5NGY2wL4ZTHvt7PS?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1EVFh7SNUhb6P2F61860ny8P3Lsm_DeeZ?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/12eWifNFUc5gVLGdPG48OUgWXzgiKnCxckNz2bXT3e_Q/edit?usp=sharing",
  },
  "Vilhena": {
    unitName: "Vilhena",
    relatoriosMensais: "https://drive.google.com/drive/folders/12CiALcyE-MdDfwDcRyZi4mi8HT6H_kgJ?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1jHryFarRc2KZqQW36npAR8L5fOHj2fpJ?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/19XhgdbWXFZLM3WbNASowzuBhKEhBxXHw2erhZwrHaY0/edit?usp=sharing",
  },
  "Corumbá": {
    unitName: "Corumbá",
    relatoriosMensais: "https://drive.google.com/drive/folders/1Lc3NbJi4L107sZVOuniKJIXk1BM5--WD?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1Su6GpN6imCEeNAN3_SeJz62hpBP5GWN2?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/1eK26sKMqm_B8jyVXBeMJ9XYp1lK94yDsI8vk4xkv95k/edit?usp=sharing",
  },
  "Fortaleza": {
    unitName: "Fortaleza",
    relatoriosMensais: "https://drive.google.com/drive/folders/1DiPG8EKHT4ifF9U0UtGo7OS3sQo3vtJ_?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/12e9p8KE8l_EUvRs05sVef-2q5RNQtoSR?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/197SLVpeuz1Bt3W9oLmnto_MyFU5fijUcGo-OjKzhN6c/edit?usp=sharing",
  },
  "Macaé Shopping": {
    unitName: "Macaé Shopping",
    relatoriosMensais: "https://drive.google.com/drive/folders/1dWjMOMh_4UPWAa553bT-WHNxpe7vLxJV?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1sDRzGPbnanSmXuup83UiG5KvFDWqEcin?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/1oVNAUdxSa1v-54QfAOLP7lyq0s-NYunU24sItzolrBw/edit?usp=sharing",
  },
  "Macaé Centro": {
    unitName: "Macaé Centro",
    relatoriosMensais: "https://drive.google.com/drive/folders/1-xOyrz-s8-kUVA6z5c1A6q5nR1Q94t8R?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/10TEPFSoYWXsxY2QAvfLQ39ZrQJlK7SE0?usp=sharing",
    fonteDados: "https://docs.google.com/spreadsheets/d/15A37s0jyQEsLK5KTlRHkOPO1Hu1Bc3l-xQV1nWUiIZM/edit?usp=sharing",
  },
};

// Sócios pré-cadastrados (login com nome + senha de 4 dígitos)
interface SocioConfig {
  password: string;
  unitNames: string[];
  saudacao: string;
}

const SOCIOS_CONFIG: Record<string, SocioConfig> = {
  "lia": {
    password: "1346",
    unitNames: ["Araripina"],
    saudacao: "Olá, Lia!",
  },
  "márcio": {
    password: "4679",
    unitNames: ["Serra Talhada", "Vitória de Santo Antão", "Santana do Livramento", "Muriaé"],
    saudacao: "Olá, Márcio!",
  },
  "marcio": {
    password: "4679",
    unitNames: ["Serra Talhada", "Vitória de Santo Antão", "Santana do Livramento", "Muriaé"],
    saudacao: "Olá, Márcio!",
  },
  "raquel": {
    password: "7946",
    unitNames: ["Garanhuns", "Cajazeiras"],
    saudacao: "Olá, Raquel!",
  },
  "evaristo": {
    password: "7946",
    unitNames: ["Garanhuns", "Cajazeiras"],
    saudacao: "Olá, Evaristo!",
  },
  "nádia": {
    password: "3121",
    unitNames: ["Vilhena"],
    saudacao: "Olá, Nádia!",
  },
  "nadia": {
    password: "3121",
    unitNames: ["Vilhena"],
    saudacao: "Olá, Nádia!",
  },
  "fran": {
    password: "9864",
    unitNames: ["Macaé Shopping", "Macaé Centro"],
    saudacao: "Olá, Fran!",
  },
  "eduardo": {
    password: "5612",
    unitNames: ["Corumbá", "Fortaleza", "Macaé Shopping", "Macaé Centro"],
    saudacao: "Olá, Eduardo!",
  },
};

// Administrador
const ADMIN_CONFIG = {
  email: "agenciatrafegon@gmail.com",
  password: "admin2024",
  name: "Kamurath",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, { password: string; user: AppUser }>>({});
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedUser, storedRegistered, storedPending] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(REGISTERED_USERS_KEY),
        AsyncStorage.getItem(PENDING_USERS_KEY),
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedRegistered) {
        setRegisteredUsers(JSON.parse(storedRegistered));
      }

      if (storedPending) {
        const parsed = JSON.parse(storedPending);
        setPendingUsers(parsed.map((p: PendingUser) => ({ ...p, registeredAt: new Date(p.registeredAt) })));
      }
    } catch (error) {
      // Erro silencioso - dados serão inicializados vazios
    } finally {
      setLoading(false);
    }
  };

  const refreshPendingUsers = async () => {
    try {
      const storedPending = await AsyncStorage.getItem(PENDING_USERS_KEY);
      if (storedPending) {
        const parsed = JSON.parse(storedPending);
        setPendingUsers(parsed.map((p: PendingUser) => ({ ...p, registeredAt: new Date(p.registeredAt) })));
      }
    } catch (error) {
      // Erro silencioso
    }
  };

  const login = async (identifier: string, password: string): Promise<{ success: boolean; pending?: boolean; error?: string }> => {
    const normalizedIdentifier = identifier.toLowerCase().trim();

    // Check if it's admin login (by email)
    if (normalizedIdentifier === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
      const adminUser: AppUser = {
        id: 1,
        name: ADMIN_CONFIG.name,
        email: ADMIN_CONFIG.email,
        appRole: "admin",
        unitIds: [],
        unitNames: ["Todas"],
        approvalStatus: "approved",
      };
      setUser(adminUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      return { success: true };
    }

    // Check if it's a sócio login (by name)
    const socioConfig = SOCIOS_CONFIG[normalizedIdentifier];
    if (socioConfig && socioConfig.password === password) {
      const unitIds = socioConfig.unitNames.map((name) => {
        const unit = UNITS.find((u) => u.name === name);
        return unit?.id || 0;
      }).filter((id) => id > 0);

      const socioUser: AppUser = {
        id: Date.now(),
        name: normalizedIdentifier.charAt(0).toUpperCase() + normalizedIdentifier.slice(1),
        email: "",
        appRole: "socio",
        unitIds,
        unitNames: socioConfig.unitNames,
        approvalStatus: "approved",
        saudacao: socioConfig.saudacao,
      };
      setUser(socioUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(socioUser));
      return { success: true };
    }

    // Check registered users (gerentes and consultoras by email)
    const registeredUser = registeredUsers[normalizedIdentifier];
    if (registeredUser && registeredUser.password === password) {
      if (registeredUser.user.approvalStatus === "pending") {
        return { success: false, pending: true };
      }
      if (registeredUser.user.approvalStatus === "rejected") {
        return { success: false, error: "Seu cadastro foi rejeitado. Entre em contato com o administrador." };
      }
      setUser(registeredUser.user);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUser.user));
      return { success: true };
    }

    return { success: false, error: "Credenciais inválidas" };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if email already exists
    if (registeredUsers[normalizedEmail]) {
      return { success: false, error: "Este e-mail já está cadastrado" };
    }

    // Check if trying to use a sócio name as email
    const namePart = normalizedEmail.split("@")[0];
    if (SOCIOS_CONFIG[namePart]) {
      return { success: false, error: "Este identificador está reservado para sócios" };
    }

    const unit = UNITS.find((u) => u.id === data.unitId);
    if (!unit) {
      return { success: false, error: "Unidade inválida" };
    }

    // Upload da foto para Cloudinary
    let avatarUrl: string | undefined;
    try {
      const normalized = await getImageBase64DataUrl({
        uri: data.photo.uri,
        mimeType: data.photo.mimeType,
      });

      // Fazer chamada direta à API tRPC (rota pública)
      // Formato tRPC: POST /api/trpc/[procedure] com body { "0": { "json": {...} } }
      const serialized = superjson.serialize({
        imageBase64: normalized.dataUrl,
        mimeType: normalized.mimeType,
      });

      const response = await fetch(`${getApiBaseUrl()}/api/trpc/auth.uploadAvatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "0": {
            json: serialized,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      // tRPC retorna { "0": { "json": {...} } }
      const uploadResult = superjson.deserialize(result[0]?.json) as { url: string };

      if (uploadResult?.url) {
        avatarUrl = uploadResult.url;
      } else {
        return { success: false, error: "Erro ao fazer upload da foto" };
      }
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      return { success: false, error: "Erro ao fazer upload da foto. Tente novamente." };
    }

    const newUser: AppUser = {
      id: Date.now(),
      name: data.name,
      email: normalizedEmail,
      appRole: data.appRole,
      unitIds: [data.unitId],
      unitNames: [unit.name],
      avatarUrl,
      approvalStatus: "pending",
      registeredAt: new Date(),
    };

    // Add to registered users with pending status
    const updatedRegistered = {
      ...registeredUsers,
      [normalizedEmail]: { password: data.password, user: newUser },
    };

    // Add to pending users list
    const newPendingUser: PendingUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      appRole: newUser.appRole,
      unitId: data.unitId,
      unitName: unit.name,
      avatarUrl,
      registeredAt: new Date(),
    };

    const updatedPending = [...pendingUsers, newPendingUser];

    setRegisteredUsers(updatedRegistered);
    setPendingUsers(updatedPending);

    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedRegistered));
    await AsyncStorage.setItem(PENDING_USERS_KEY, JSON.stringify(updatedPending));

    // Criar notificação para admin/sócios sobre novo cadastro
    await addNewRegistrationNotification(newUser.name, newUser.email, unit.name);

    return { success: true };
  };

  const approveUser = async (userId: number) => {
    const pendingUser = pendingUsers.find((p) => p.id === userId);
    if (!pendingUser) return;

    const userEmail = pendingUser.email;
    const registeredUser = registeredUsers[userEmail];
    if (registeredUser) {
      const updatedUser = { ...registeredUser.user, approvalStatus: "approved" as ApprovalStatus };
      const updatedRegistered = {
        ...registeredUsers,
        [userEmail]: { ...registeredUser, user: updatedUser },
      };
      setRegisteredUsers(updatedRegistered);
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedRegistered));
    }

    const updatedPending = pendingUsers.filter((p) => p.id !== userId);
    setPendingUsers(updatedPending);
    await AsyncStorage.setItem(PENDING_USERS_KEY, JSON.stringify(updatedPending));
  };

  const rejectUser = async (userId: number) => {
    const pendingUser = pendingUsers.find((p) => p.id === userId);
    if (!pendingUser) return;

    const userEmail = pendingUser.email;
    const registeredUser = registeredUsers[userEmail];
    if (registeredUser) {
      const updatedUser = { ...registeredUser.user, approvalStatus: "rejected" as ApprovalStatus };
      const updatedRegistered = {
        ...registeredUsers,
        [userEmail]: { ...registeredUser, user: updatedUser },
      };
      setRegisteredUsers(updatedRegistered);
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedRegistered));
    }

    const updatedPending = pendingUsers.filter((p) => p.id !== userId);
    setPendingUsers(updatedPending);
    await AsyncStorage.setItem(PENDING_USERS_KEY, JSON.stringify(updatedPending));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const updateProfilePhoto = async (photoUrl: string) => {
    if (!user) return;
    const updatedUser = { ...user, avatarUrl: photoUrl };
    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Also update in registered users if applicable
    if (user.email && registeredUsers[user.email]) {
      const updatedRegistered = {
        ...registeredUsers,
        [user.email]: { ...registeredUsers[user.email], user: updatedUser },
      };
      setRegisteredUsers(updatedRegistered);
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedRegistered));
    }
  };

  const updateProfile = async (data: { name?: string; unitId?: number }) => {
    if (!user) return;

    const updatedUser = { ...user };

    // Atualizar nome se fornecido
    if (data.name !== undefined && data.name.trim()) {
      updatedUser.name = data.name.trim();
    }

    // Atualizar unidade se fornecido (apenas para membros, não sócios)
    if (data.unitId !== undefined && user.appRole !== "socio" && user.appRole !== "admin") {
      const unit = UNITS.find((u) => u.id === data.unitId);
      if (unit) {
        updatedUser.unitIds = [data.unitId];
        updatedUser.unitNames = [unit.name];
      }
    }

    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Also update in registered users if applicable
    if (user.email && registeredUsers[user.email]) {
      const updatedRegistered = {
        ...registeredUsers,
        [user.email]: { ...registeredUsers[user.email], user: updatedUser },
      };
      setRegisteredUsers(updatedRegistered);
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedRegistered));
    }
  };

  const getUserUnitAccess = (): UnitAccess[] => {
    if (!user || user.appRole !== "socio") return [];
    return user.unitNames
      .map((name) => UNIT_ACCESS_CONFIG[name])
      .filter((access): access is UnitAccess => !!access);
  };

  const removeUser = async (userEmail: string) => {
    const normalizedEmail = userEmail.toLowerCase().trim();
    
    // Remove from registered users
    const { [normalizedEmail]: removed, ...remainingUsers } = registeredUsers;
    setRegisteredUsers(remainingUsers);
    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(remainingUsers));
    
    // Also remove from pending if exists
    const updatedPending = pendingUsers.filter((p) => p.email.toLowerCase() !== normalizedEmail);
    setPendingUsers(updatedPending);
    await AsyncStorage.setItem(PENDING_USERS_KEY, JSON.stringify(updatedPending));
  };

  const getApprovedUsers = () => {
    return Object.entries(registeredUsers)
      .filter(([_, data]) => data.user.approvalStatus === "approved")
      .map(([email, data]) => ({
        email,
        name: data.user.name,
        appRole: data.user.appRole,
        unitNames: data.user.unitNames,
      }));
  };

  const isAdmin = user?.appRole === "admin";
  const isSocio = user?.appRole === "socio";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.approvalStatus === "approved",
        isAdmin,
        isSocio,
        loading,
        units: UNITS,
        pendingUsers,
        getUserUnitAccess,
        login,
        register,
        approveUser,
        rejectUser,
        logout,
        refreshPendingUsers,
        updateProfilePhoto,
        updateProfile,
        removeUser,
        getApprovedUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAppAuth must be used within an AuthProvider");
  }
  return context;
}
