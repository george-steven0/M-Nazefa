import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type {
  clientFormPropsType,
  reservationDetailsData,
} from "../../../components/Utilities/Types/types";

type pdfAddress = NonNullable<clientFormPropsType["address"]>[number];

// Register standard fonts if needed, but Helvetica is default
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#374151",
    backgroundColor: "#ffffff",
    textTransform: "capitalize",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#f97316",
    paddingBottom: 15,
    marginBottom: 20,
  },
  headerText: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 24,
    color: "#1a365d",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1a365d",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: "#111827",
    fontFamily: "Helvetica-Bold",
  },
  card: {
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginRight: 10,
  },
  cardNoMargin: {
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  flexRow: {
    flexDirection: "row",
  },
  packagesSection: {
    marginTop: 10,
  },
  packageCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1a365d",
  },
  packageAmount: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#f97316",
  },
  extraServiceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  extraServiceText: {
    fontSize: 10,
    color: "#4b5563",
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  summaryBox: {
    width: 250,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#1a365d",
  },
  summaryTotalText: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  summaryText: {
    color: "#374151",
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

export const ReservationDetailsPdf = ({
  data,
  customer,
  address,
}: {
  data: reservationDetailsData;
  customer?: clientFormPropsType;
  address?: pdfAddress;
}) => {
  const { t } = useTranslation();
  if (!data)
    return (
      <Document>
        <Page size="A4">
          <Text>{t("NO_DATA_FOUND")}</Text>
        </Page>
      </Document>
    );

  // const phoneNumbersObj = data.phoneNumbers || [{ id: 1, phone: "N/A" }];

  let grandTotal = 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{t("RESERVATION_DETAILS")}</Text>
            <Text style={styles.headerSubtitle}>REF: #{data.id || "N/A"}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>{t("DATE")}</Text>
            <Text style={styles.value}>
              {data.reservationDate
                ? dayjs(data.reservationDate).format("DD/MM/YYYY")
                : "N/A"}
            </Text>
            <Text style={[styles.label, { marginTop: 4 }]}>{t("TIME")}</Text>
            <Text style={styles.value}>
              {data.reservationDate
                ? dayjs(data.reservationDate).format("hh:mm A")
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("CUSTOMER_INFORMATION")}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("FIRST_NAME")}</Text>
              <Text style={styles.value}>
                {customer?.firstName ||
                  data.customerName?.split(" ")[0] ||
                  "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("MIDDLE_NAME")}</Text>
              <Text style={styles.value}>{customer?.middleName || "N/A"}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("LAST_NAME")}</Text>
              <Text style={styles.value}>{customer?.lastName || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("NATIONAL_ID")}</Text>
              <Text style={styles.value}>
                {(customer?.idNumber as string) ||
                  data.customerNationalId ||
                  "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("PHONE")}</Text>
              <Text style={styles.value}>
                {customer?.phoneNumbers?.map((p) => p.phoneNumber).join(", ") ||
                  data.customerPhoneNumbers
                    ?.map((p) => p.phoneNumber)
                    .join(", ") ||
                  "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("EMAIL")}</Text>
              <Text style={styles.value}>{customer?.email || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("CUSTOMER_TYPE")}</Text>
              <Text style={styles.value}>
                {customer?.customerTypeName || "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("HAS_MEMBERSHIP")}</Text>
              <Text style={styles.value}>
                {customer?.hasMembership ? t("YES") : t("NO")}
              </Text>
            </View>
            {/* <View style={styles.col}>
              <Text style={styles.label}>Membership Number</Text>
              <Text style={styles.value}>
                {customer?.memberShipNumber || "N/A"}
              </Text>
            </View> */}
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("WHATSAPP")}</Text>
              <Text style={styles.value}>
                {(customer?.whatsAppNumber as string) || "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("OLD_CUSTOMER")}</Text>
              <Text style={styles.value}>{customer?.isOld ? t("YES") : t("NO")}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("NO_OF_RESERVATIONS")}</Text>
              <Text style={styles.value}>
                {(customer?.noOfReservations as string) || "0"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("LAST_RESERVATION_DATE")}</Text>
              <Text style={styles.value}>
                {customer?.lastReservationDate
                  ? dayjs(customer.lastReservationDate).format("DD/MM/YYYY")
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("CUSTOMER_FAVOURITES")}</Text>
              <Text style={styles.value}>
                {`${customer?.customerFavourites?.favoriteList?.length || 0} Fav / ${customer?.customerFavourites?.notRecommendedWorkerList?.length || 0} Not Rec`}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("GENERAL_NOTES")}</Text>
              <Text style={styles.value}>
                {customer?.generalNotes || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Address Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("SELECTED_ADDRESS_DETAILS")}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("ADDRESS")}</Text>
              <Text style={styles.value}>
                {data.customerAddressName || "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("CITY")}</Text>
              <Text style={styles.value}>
                {data.cityName || address?.cityName?.toString() || "N/A"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("AREA")}</Text>
              <Text style={styles.value}>
                {data.areaName || address?.areaName?.toString() || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("STREET")}</Text>
              <Text style={styles.value}>{address?.street || "N/A"}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("APARTMENT")}</Text>
              <Text style={styles.value}>{address?.apartment || "N/A"}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("FLOOR")}</Text>
              <Text style={styles.value}>
                {address?.floor?.toString() || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("LANDMARK")}</Text>
              <Text style={styles.value}>
                {address?.landMark || address?.landmark || "N/A"}
              </Text>
            </View>
            <View style={[styles.col, { flex: 2 }]}>
              <Text style={styles.label}>{t("DESCRIPTION")}</Text>
              <Text style={styles.value}>
                {address?.fullDescription || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("NOTES")}</Text>
              <Text style={styles.value}>{address?.notes || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Building Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("BUILDING_DETAILS")}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("SPACE")}</Text>
              <Text style={styles.value}>{address?.space || "N/A"}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("KITCHENS")}</Text>
              <Text style={styles.value}>
                {address?.numberOfKitchens?.toString() || "0"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("BEDROOMS")}</Text>
              <Text style={styles.value}>
                {address?.numberOfBedrooms?.toString() || "0"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("BATHROOMS")}</Text>
              <Text style={styles.value}>
                {address?.numberOfBathrooms?.toString() || "0"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("NUMBER_OF_LIVING_ROOMS")}</Text>
              <Text style={styles.value}>
                {address?.numberOfLivingRooms?.toString() || "0"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("NUMBER_OF_RECEPTION_ROOMS")}</Text>
              <Text style={styles.value}>
                {address?.numberOfReceptionrooms?.toString() || "0"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("FLOORS")}</Text>
              <Text style={styles.value}>
                {address?.noOfFloors?.toString() ||
                  address?.numberOfFloors?.toString() ||
                  "0"}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("WINDOWS")}</Text>
              <Text style={styles.value}>
                {address?.numberOfWindows?.toString() || "0"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("HAS_PETS")}</Text>
              <Text style={styles.value}>
                {address?.hasPets ? t("YES") : t("NO")}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("INSECTS")}</Text>
              <Text style={styles.value}>{data.insects ? t("YES") : t("NO")}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("RODENTS")}</Text>
              <Text style={styles.value}>{data.rodents ? t("YES") : t("NO")}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>{t("APARTMENT_CLOSING_PERIOD")}</Text>
              <Text style={styles.value}>
                {data.apartmentClosingPeriod || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>{t("GENERAL_COMMENTS")}</Text>
              <Text style={styles.value}>{data.generalComments || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Packages Section */}
        <View style={styles.packagesSection} break wrap>
          <Text style={styles.sectionTitle}>{t("SELECTED_PACKAGES")}</Text>

          {(data.getPackageDtoList || []).map((pkg, index: number) => {
            const packageDto = pkg.getPackageDto || {};
            const extraServices = pkg.reservationPackageExtraServices || [];
            const count = Number(pkg.count) || 1;
            const basePrice =
              Number(pkg.packageAmount ?? packageDto.price) || 0;
            const discount = Number(packageDto.discount) || 0;
            const rawIsPercentage =
              packageDto.isPercentage ?? packageDto.isPercentage;
            const isPercentage = rawIsPercentage === true;

            let discountAmount = 0;
            if (discount > 0) {
              if (isPercentage) {
                discountAmount = (basePrice * discount) / 100;
              } else {
                discountAmount = discount;
              }
            }

            const priceAfterDiscount = Math.max(0, basePrice - discountAmount);
            const extraServicesTotal = extraServices.reduce(
              (sum, es) => sum + (Number(es.price) || 0),
              0,
            );
            const calculatedTotal =
              (priceAfterDiscount + extraServicesTotal) * count;
            grandTotal += calculatedTotal;

            return (
              <View key={index} style={styles.packageCard}>
                <View style={styles.packageHeader}>
                  {/* use title directly, assuming standard font for pdf. Arabic might not render correctly without custom fonts, but keeping it simple as requested */}
                  <Text style={styles.packageTitle}>
                    {packageDto.title || t("PACKAGE")}
                  </Text>
                  <Text style={styles.packageAmount}>
                    {calculatedTotal.toLocaleString()} L.E
                  </Text>
                </View>

                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.label}>{t("BASE_PRICE")}</Text>
                    <Text style={styles.value}>
                      {basePrice} L.E {count > 1 ? `x ${count}` : ""}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>{t("WORKERS")}</Text>
                    <Text style={styles.value}>
                      {packageDto.numberOfWorkers || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>{t("ROOMS")}</Text>
                    <Text style={styles.value}>
                      {packageDto.numberOfRooms || "N/A"}
                    </Text>
                  </View>
                </View>

                {discount > 0 && (
                  <View style={[styles.row, { marginTop: 4 }]}>
                    <View style={styles.col}>
                      <Text style={styles.label}>{t("DISCOUNT")}</Text>
                      <Text style={[styles.value, { color: "#ef4444" }]}>
                        - {discountAmount.toLocaleString()} L.E (
                        {isPercentage ? `${discount}%` : t("FIXED")})
                      </Text>
                    </View>
                  </View>
                )}

                {extraServices.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>{t("EXTRA_SERVICES")}</Text>
                    {extraServices.map((es, esIdx) => (
                      <View key={esIdx} style={styles.extraServiceItem}>
                        <Text style={styles.extraServiceText}>
                          • {es.service}
                        </Text>
                        <Text style={styles.extraServiceText}>
                          + {Number(es.price).toLocaleString()} L.E
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Summary Footer */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalText}>{t("TOTAL_AMOUNT")}</Text>
              <Text style={styles.summaryTotalText}>
                {grandTotal.toLocaleString()} L.E
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {t("GENERATED_ON")} {dayjs().format("DD/MM/YYYY hh:mm A")} • Madame Nazifa
          Services
        </Text>
      </Page>
    </Document>
  );
};
