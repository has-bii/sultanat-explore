import { OpenTripSection } from "./open-trip-section";
import { PrivateTripSection } from "./private-trip-section";
import { UmrahSection } from "./umrah-section";

export function ServicesSection() {
  return (
    <>
      <OpenTripSection />
      <PrivateTripSection />
      <UmrahSection />
    </>
  );
}
