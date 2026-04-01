import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (err: unknown) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg =
        err instanceof Error ? err.message : "Invalid email or password.";
      setError(msg.includes("401") || msg.includes("Invalid") ? "Invalid email or password." : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + 40,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <View
              style={[styles.logoCircle, { backgroundColor: colors.primaryLight }]}
            >
              <Ionicons name="medical" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.brand, { color: colors.foreground }]}>
              DentalCare
            </Text>
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
              Your personal dental companion
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
            ]}
          >
            <Text style={[styles.title, { color: colors.foreground }]}>
              Sign In
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Access your appointments and health records
            </Text>

            {error ? (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: colors.destructiveLight, borderColor: colors.destructive },
                ]}
              >
                <Ionicons name="alert-circle" size={16} color={colors.destructive} />
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.mutedForeground}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.loginBtn,
                {
                  backgroundColor: loading ? colors.primaryLight : colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          <Text style={[styles.footer, { color: colors.mutedForeground }]}>
            Contact your clinic to get your login credentials
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    gap: 24,
  },
  logoWrap: {
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  brand: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: -8,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    flex: 1,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  loginBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    minHeight: 52,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
  },
});
