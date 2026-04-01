import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { StatusBadge } from "@/components/StatusBadge";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  duration?: number;
  type?: string;
  status: string;
  patientName?: string;
  doctorName?: string;
  notes?: string;
  branchName?: string;
}

interface Props {
  appointment: Appointment;
  onPress?: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function AppointmentCard({ appointment, onPress }: Props) {
  const colors = useColors();

  const isUpcoming =
    appointment.status === "confirmed" || appointment.status === "scheduled";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.accent,
          {
            backgroundColor: isUpcoming ? colors.primary : colors.muted,
          },
        ]}
      />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.dateBlock}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.mutedForeground}
            />
            <Text style={[styles.dateText, { color: colors.foreground }]}>
              {formatDate(appointment.date)}
            </Text>
          </View>
          <StatusBadge status={appointment.status} size="sm" />
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.time, { color: colors.foreground }]}>
            {formatTime(appointment.time)}
          </Text>
          {appointment.duration ? (
            <Text style={[styles.duration, { color: colors.mutedForeground }]}>
              · {appointment.duration} min
            </Text>
          ) : null}
        </View>

        {appointment.doctorName ? (
          <View style={styles.doctorRow}>
            <Ionicons name="person-outline" size={14} color={colors.mutedForeground} />
            <Text style={[styles.doctor, { color: colors.mutedForeground }]}>
              {appointment.doctorName}
            </Text>
          </View>
        ) : null}

        {appointment.type ? (
          <View style={styles.typeRow}>
            <Ionicons name="medical-outline" size={14} color={colors.primary} />
            <Text style={[styles.type, { color: colors.primary }]}>
              {appointment.type}
            </Text>
          </View>
        ) : null}
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.muted}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  time: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  duration: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  doctor: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  type: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  chevron: {
    alignSelf: "center",
    marginRight: 12,
  },
});
