import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  onPress: () => void;
  color?: string;
  showArrow?: boolean;
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const initials = (user?.name ?? "P")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout().then(() => router.replace("/(auth)/login"));
      return;
    }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "calendar-outline",
      label: "My Appointments",
      sublabel: "View and manage your visits",
      onPress: () => router.push("/(tabs)/appointments"),
      showArrow: true,
    },
    {
      icon: "receipt-outline",
      label: "Billing History",
      sublabel: "View invoices and payments",
      onPress: () => router.push("/(tabs)/bills"),
      showArrow: true,
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy & Security",
      sublabel: "Manage your account security",
      onPress: () => {},
      showArrow: true,
    },
    {
      icon: "information-circle-outline",
      label: "About DentalCare",
      sublabel: "Version 1.0.0",
      onPress: () => {},
      showArrow: true,
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topPad + 16,
            paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 80,
          },
        ]}
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          Profile
        </Text>

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View
            style={[
              styles.avatarLarge,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {user?.name ?? "Patient"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
              {user?.email ?? ""}
            </Text>
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons name="person-circle-outline" size={13} color={colors.primary} />
              <Text style={[styles.roleText, { color: colors.primary }]}>
                Patient
              </Text>
            </View>
          </View>
        </View>

        {user?.patientId && (
          <View
            style={[
              styles.idCard,
              {
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary + "30",
              },
            ]}
          >
            <Ionicons name="id-card-outline" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.idLabel, { color: colors.mutedForeground }]}>
                Patient ID
              </Text>
              <Text style={[styles.idValue, { color: colors.primary }]}>
                #{user.patientId}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.menuGroup}>
          {menuItems.map((item, i) => (
            <Pressable
              key={i}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.88 : 1,
                  borderTopWidth: i === 0 ? 1 : 0,
                  borderBottomWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderTopLeftRadius: i === 0 ? 16 : 0,
                  borderTopRightRadius: i === 0 ? 16 : 0,
                  borderBottomLeftRadius: i === menuItems.length - 1 ? 16 : 0,
                  borderBottomRightRadius:
                    i === menuItems.length - 1 ? 16 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: item.color ? item.color + "20" : colors.primaryLight },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.color ?? colors.primary}
                />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>
                  {item.label}
                </Text>
                {item.sublabel && (
                  <Text
                    style={[styles.menuSub, { color: colors.mutedForeground }]}
                  >
                    {item.sublabel}
                  </Text>
                )}
              </View>
              {item.showArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.muted}
                />
              )}
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutBtn,
            {
              backgroundColor: colors.destructiveLight,
              borderColor: colors.destructive + "40",
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>
            Sign Out
          </Text>
        </Pressable>

        <Text style={[styles.footerNote, { color: colors.mutedForeground }]}>
          DentalCare · Powered by DenApps
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  pageTitle: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  userInfo: { flex: 1, gap: 4 },
  userName: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  userEmail: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  idCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  idLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  idValue: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  menuGroup: { gap: 0 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1, gap: 2 },
  menuLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  menuSub: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: 4,
  },
});
