import { Globe, Smartphone, Code } from "lucide-react";

export const getPlatformIcon = (platform) => {
  switch (platform) {
    case "Web":
      return <Globe className="w-4 h-4" />;
    case "Android":
      return <Smartphone className="w-4 h-4" />;
    case "iOS":
      return <Smartphone className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
};

export const platformConfig = {
  web: {
    name: "Web",
    icon: "Globe",
    description: "Web-based applications and websites",
  },
  android: {
    name: "Android",
    icon: "Smartphone",
    description: "Android mobile applications",
  },
  ios: {
    name: "iOS",
    icon: "Smartphone",
    description: "iOS mobile applications",
  },
};
