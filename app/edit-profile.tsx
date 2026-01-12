import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth, UNITS } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAppAuth();
  const { unreadCount } = useNotifications();
  const [name, setName] = useState(user?.name || "");
  const [selectedUnitId, setSelectedUnitId] = useState(user?.unitIds?.[0] || 1);
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedUnit = UNITS.find((u) => u.id === selectedUnitId);
  const canChangeUnit = user?.appRole !== "socio" && user?.appRole !== "admin";

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "O nome é obrigatório");
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        name: name.trim(),
        unitId: canChangeUnit ? selectedUnitId : undefined,
      });

      if (Platform.OS === "web") {
        alert("Perfil atualizado com sucesso!");
      } else {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      }
      router.back();
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Erro ao atualizar perfil. Tente novamente.");
      } else {
        Alert.alert("Erro", "Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader 
        notificationCount={unreadCount}
        onNotificationPress={() => router.push("/notifications" as any)}
        showBack
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 600, alignSelf: "center", width: "100%" }}>
          
          {/* Card de Edição */}
          <View className="bg-white mx-4 mt-4 rounded-xl p-6 border border-gray-100">
            <Text className="text-xl font-bold text-gray-900 mb-6">Editar Perfil</Text>

            {/* Nome */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-600 mb-2">Nome completo</Text>
              <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50" style={{ height: 56 }}>
                <IconSymbol name="person.fill" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 px-3 text-base text-gray-900"
                  style={{ height: 56 }}
                  placeholder="Seu nome"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Unidade (apenas para membros) */}
            {canChangeUnit ? (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-600 mb-2">Unidade</Text>
                <TouchableOpacity
                  className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50"
                  style={{ height: 56 }}
                  onPress={() => setShowUnitSelector(true)}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="building.2.fill" size={20} color="#6B7280" />
                  <Text className="flex-1 px-3 text-base text-gray-900">
                    {selectedUnit?.name || "Selecione"}
                  </Text>
                  <IconSymbol name="chevron.right" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-600 mb-2">Unidade</Text>
                <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50" style={{ height: 56 }}>
                  <IconSymbol name="building.2.fill" size={20} color="#6B7280" />
                  <Text className="flex-1 px-3 text-base text-gray-500">
                    {user?.unitNames?.join(", ") || "N/A"}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 mt-1">
                  Sócios e administradores não podem alterar a unidade
                </Text>
              </View>
            )}

            {/* Botão Salvar */}
            <TouchableOpacity
              className="rounded-xl items-center justify-center mt-4"
              style={{ 
                backgroundColor: "#003FC3",
                height: 56
              }}
              onPress={handleSave}
              disabled={loading || !name.trim()}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-base">Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Unidade */}
      {showUnitSelector && (
        <View className="absolute inset-0 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">Selecione sua Unidade</Text>
              <TouchableOpacity onPress={() => setShowUnitSelector(false)}>
                <IconSymbol name="xmark" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-4">
              {UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit.id}
                  className="flex-row items-center p-4 mb-2 rounded-xl"
                  style={{
                    backgroundColor: selectedUnitId === unit.id ? "#E6F0FF" : "#F5F7FA",
                    borderWidth: selectedUnitId === unit.id ? 1 : 0,
                    borderColor: "#003FC3",
                  }}
                  onPress={() => {
                    setSelectedUnitId(unit.id);
                    setShowUnitSelector(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">{unit.name}</Text>
                    <Text className="text-sm text-gray-500">{unit.city} - {unit.state}</Text>
                  </View>
                  {selectedUnitId === unit.id && (
                    <IconSymbol name="checkmark" size={20} color="#003FC3" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
