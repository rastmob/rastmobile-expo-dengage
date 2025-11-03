export type RastmobileDengagePluginProps = {
  productionIntegrationKeys: Props;
  developmentIntegrationKeys: Props;
  dengageApiUrl: string;
  dengageEventApiUrl: string;
  dengageGeofenceApiUrl: string;
  mode: "production" | "development";
  devTeam: string;
  smallIcons?: string[];
  largeIcons?: string[];
  contentExtensionIosBundle: string;
  notificationServiceIosBundle: string;
  iosGroupBundle: string;
};

type Props = {
  ios: string;
  android: string;
};
