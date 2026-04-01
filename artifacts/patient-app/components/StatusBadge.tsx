import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

type Status =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "pending"
  | "paid"
  | "partially_paid"
  | string;

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  confirmed:      { label: "Confirmed",     bg: "#e8f1fd", text: "#1272e0" },
  completed:      { label: "Completed",     bg: "#e6f7f2", text: "#059669" },
  cancelled:      { label: "Cancelled",     bg: "#fdeaea", text: "#dc2626" },
  no_show:        { label: "No Show",       bg: "#fef3c7", text: "#b45309" },
  pending:        { label: "Pending",       bg: "#fef3c7", text: "#b45309" },
  paid:           { label: "Paid",          bg: "#e6f7f2", text: "#059669" },
  partially_paid: { label: "Partial",       bg: "#e5f7fd", text: "#0891b2" },
  scheduled:      { label: "Scheduled",     bg: "#e8f1fd", text: "#1272e0" },
  draft:          { label: "Draft",         bg: "#f3f4f6", text: "#6b7280" },
};

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const colors = useColors();
  const cfg = STATUS_CONFIG[status] ?? {
    label: status.replace(/_/g, " "),
    bg: colors.muted,
    text: colors.mutedForeground,
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: cfg.bg },
        size === "sm" && styles.badgeSm,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: cfg.text },
          size === "sm" && styles.labelSm,
        ]}
      >
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: 11,
  },
});
