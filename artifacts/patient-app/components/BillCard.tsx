import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { StatusBadge } from "@/components/StatusBadge";

export interface Invoice {
  id: number;
  invoiceNumber?: string;
  patientId?: number;
  patientName?: string;
  doctorName?: string;
  total: number;
  balance: number;
  amountPaid: number;
  status: string;
  createdAt?: string;
  currency?: string;
}

interface Props {
  invoice: Invoice;
  onPress?: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function BillCard({ invoice, onPress }: Props) {
  const colors = useColors();
  const isPaid = invoice.status === "paid";
  const isDue = invoice.balance > 0;

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
      <View style={styles.header}>
        <View>
          <Text style={[styles.invoiceNumber, { color: colors.foreground }]}>
            {invoice.invoiceNumber ?? `#${invoice.id}`}
          </Text>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            {formatDate(invoice.createdAt)}
          </Text>
        </View>
        <StatusBadge status={invoice.status} size="sm" />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.muted }]} />

      <View style={styles.amounts}>
        <View style={styles.amountItem}>
          <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>
            Total
          </Text>
          <Text style={[styles.amountValue, { color: colors.foreground }]}>
            {formatCurrency(invoice.total, invoice.currency)}
          </Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>
            Paid
          </Text>
          <Text style={[styles.amountValue, { color: colors.success }]}>
            {formatCurrency(invoice.amountPaid, invoice.currency)}
          </Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>
            Balance
          </Text>
          <Text
            style={[
              styles.amountValue,
              { color: isDue ? colors.destructive : colors.success },
              styles.balanceBold,
            ]}
          >
            {formatCurrency(invoice.balance, invoice.currency)}
          </Text>
        </View>
      </View>

      {invoice.doctorName ? (
        <View style={styles.doctorRow}>
          <Ionicons name="person-outline" size={13} color={colors.mutedForeground} />
          <Text style={[styles.doctorName, { color: colors.mutedForeground }]}>
            {invoice.doctorName}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  date: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  amounts: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountItem: {
    alignItems: "center",
    flex: 1,
  },
  amountLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  balanceBold: {
    fontFamily: "PlusJakartaSans_700Bold",
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#dce6f0",
  },
  doctorName: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
  },
});
