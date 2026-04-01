import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  const colors = useColors();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.msg, { color: colors.mutedForeground }]}>{message}</Text>
    </View>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  const colors = useColors();
  return (
    <View style={styles.center}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.destructive} />
      <Text style={[styles.errorMsg, { color: colors.foreground }]}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={[styles.retryBtn, { backgroundColor: colors.primaryLight }]}
        >
          <Text style={[styles.retryText, { color: colors.primary }]}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = "folder-open-outline", title, subtitle }: EmptyStateProps) {
  const colors = useColors();
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={56} color={colors.muted} />
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  msg: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  errorMsg: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_500Medium",
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans_600SemiBold",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
