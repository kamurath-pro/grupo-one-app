import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Verifica se push notifications estão disponíveis.
 * Push notifications NÃO funcionam no Expo Go (apenas em development builds e production).
 * 
 * @returns true se push notifications estão disponíveis, false caso contrário
 */
function isPushNotificationsAvailable(): boolean {
  if (Platform.OS === "web") {
    return false; // Push notifications não funcionam na web
  }

  // No Expo Go, appOwnership é "expo"
  // Em development builds e production, appOwnership é null ou não "expo"
  const isExpoGo = Constants.appOwnership === "expo";
  
  if (isExpoGo) {
    // No Expo Go, push notifications não funcionam
    // Apenas log, não tenta registrar
    return false;
  }

  // Em development builds e production, push notifications funcionam
  return true;
}

// Configurar como as notificações são exibidas quando o app está em primeiro plano
// Apenas se push notifications estão disponíveis
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Tipos de notificação
export type NotificationType = "birthday" | "recognition" | "post" | "system";

// Interface de uma notificação interna
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

// Interface do contexto
interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  scheduleBirthdayNotification: (name: string, date: Date) => Promise<void>;
  checkTodayBirthdays: () => void;
  expoPushToken: string | null;
  requestPermissions: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = "@grupo_one_notifications";

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  // Carregar notificações do AsyncStorage
  useEffect(() => {
    loadNotifications();
    registerForPushNotifications();
  }, []);

  // Salvar notificações quando mudam
  useEffect(() => {
    saveNotifications();
  }, [notifications]);

  // Função para remover duplicatas
  const removeDuplicates = (notifications: AppNotification[]): AppNotification[] => {
    const seen = new Map<string, AppNotification>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return notifications.filter((notification) => {
      // Para aniversários, usar tipo + birthdayId como chave
      if (notification.type === "birthday" && notification.data?.birthdayId) {
        const key = `birthday_${notification.data.birthdayId}`;
        if (seen.has(key)) {
          return false; // Duplicata
        }
        seen.set(key, notification);
        return true;
      }

      // Para outros tipos, usar tipo + título + mensagem + data como chave
      const nDate = new Date(notification.createdAt);
      nDate.setHours(0, 0, 0, 0);
      const key = `${notification.type}_${notification.title}_${notification.message}_${nDate.getTime()}`;
      
      if (seen.has(key)) {
        return false; // Duplicata
      }
      seen.set(key, notification);
      return true;
    });
  };

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter strings de data para objetos Date
        const withDates = parsed.map((n: AppNotification) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        // Remover duplicatas ao carregar
        const uniqueNotifications = removeDuplicates(withDates);
        setNotifications(uniqueNotifications);
      }
    } catch (error) {
      // Erro silencioso - notificações serão inicializadas vazias
    }
  };

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error("Erro ao salvar notificações:", error);
    }
  };

  // Registrar para push notifications
  const registerForPushNotifications = async () => {
    // Verificar se push notifications estão disponíveis (não funciona no Expo Go)
    if (!isPushNotificationsAvailable()) {
      // Expo Go: push notifications não disponíveis (comportamento esperado)
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return;
      }

      // Obter o token do Expo Push
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "grupo-one-app", // Usar o slug do app
      });
      setExpoPushToken(tokenData.data);

      // Configurar canal de notificação para Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("birthdays", {
          name: "Aniversários",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#003FC3",
        });
      }
    } catch (error) {
      // Erro silencioso - push notifications não funcionarão
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "web") {
      return false;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  };

  // Verificar se uma notificação é duplicada
  const isDuplicate = (notification: Omit<AppNotification, "id" | "read" | "createdAt">, existing: AppNotification[]): boolean => {
    // Para aniversários, verificar por tipo e birthdayId
    if (notification.type === "birthday" && notification.data?.birthdayId) {
      return existing.some(
        (n) => n.type === "birthday" && n.data?.birthdayId === notification.data?.birthdayId
      );
    }

    // Para outros tipos, verificar por tipo, título e mensagem no mesmo dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return existing.some((n) => {
      const nDate = new Date(n.createdAt);
      nDate.setHours(0, 0, 0, 0);
      return (
        n.type === notification.type &&
        n.title === notification.title &&
        n.message === notification.message &&
        nDate.getTime() === today.getTime()
      );
    });
  };

  // Adicionar uma nova notificação interna
  const addNotification = useCallback((notification: Omit<AppNotification, "id" | "read" | "createdAt">) => {
    setNotifications((prev) => {
      // Verificar se já existe uma notificação duplicada
      if (isDuplicate(notification, prev)) {
        // Notificação já existe, não adicionar duplicata
        return prev;
      }

      // Não é duplicata, adicionar nova notificação
      const newNotification: AppNotification = {
        ...notification,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        read: false,
        createdAt: new Date(),
      };

      return [newNotification, ...prev];
    });
  }, []);

  // Marcar uma notificação como lida
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Limpar todas as notificações
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Agendar notificação push para aniversário
  const scheduleBirthdayNotification = async (name: string, date: Date) => {
    // Verificar se push notifications estão disponíveis (não funciona no Expo Go)
    if (!isPushNotificationsAvailable()) {
      // Expo Go: notificações não disponíveis (comportamento esperado)
      return;
    }

    try {
      // Criar a data de disparo (no dia do aniversário às 9h)
      const triggerDate = new Date(date);
      triggerDate.setHours(9, 0, 0, 0);

      // Se a data já passou hoje, não agendar
      if (triggerDate < new Date()) {
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎂 Aniversário no Grupo ONE!",
          body: "Hoje é aniversário de " + name + "! Não esqueça de dar os parabéns!",
          data: { type: "birthday", name },
          sound: true,
        },
        trigger: {
          date: triggerDate,
          channelId: "birthdays",
        },
      });

    } catch (error) {
      // Não falha o app se agendamento falhar
    }
  };

  // Verificar aniversariantes de hoje e criar notificações
  const checkTodayBirthdays = useCallback(() => {
    // Esta função será chamada pelo componente que tem acesso aos dados de aniversariantes
    // Implementação será feita quando necessário
  }, []);

  // Calcular contagem de não lidas
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    scheduleBirthdayNotification,
    checkTodayBirthdays,
    expoPushToken,
    requestPermissions,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook para usar o contexto
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

// Função utilitária para enviar push notification imediata
export async function sendImmediatePushNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  // Verificar se push notifications estão disponíveis (não funciona no Expo Go)
  if (!isPushNotificationsAvailable()) {
    // No Expo Go, push notifications não disponíveis
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // null = imediato
    });
  } catch (error) {
    // Erro silencioso - notificação não será enviada
  }
}
