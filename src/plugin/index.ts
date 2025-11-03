import { ConfigPlugin } from "@expo/config-plugins";
import { RastmobileDengagePluginProps } from "./types";
import withRastmobileDengageIos from "./withRastmobileDengageIos";
import withRastmobileDengageAndroid from "./withRastmobileDengageAndroid";


const withRastmobileDengage: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  config = withRastmobileDengageIos(config, props);
  config = withRastmobileDengageAndroid(config, props);
  return config;
};

export default withRastmobileDengage;
