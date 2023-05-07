import { EnvironmentUrls } from "../../auth/models/domain/environment-urls";
import { StateVersion, ThemeType } from "../../enums";

import { WindowState } from "./window-state";

export class GlobalState {
  enableAlwaysOnTop?: boolean;
  installedVersion?: string;
  locale?: string;
  organizationInvitation?: any;
  emergencyAccessInvitation?: any;
  ssoCodeVerifier?: string;
  ssoOrganizationIdentifier?: string;
  ssoState?: string;
  rememberedEmail?: string;
  theme?: ThemeType = ThemeType.System;
  window?: WindowState = new WindowState();
  twoFactorToken?: string;
  disableFavicon?: boolean;
  biometricAwaitingAcceptance?: boolean;
  biometricFingerprintValidated?: boolean;
  vaultTimeout?: number;
  vaultTimeoutAction?: string;
  loginRedirect?: any;
  mainWindowSize?: number;
  enableBiometrics?: boolean;
  biometricText?: string;
  noAutoPromptBiometricsText?: string;
  stateVersion: StateVersion = StateVersion.One;
  environmentUrls: EnvironmentUrls = new EnvironmentUrls();
  enableTray?: boolean;
  enableMinimizeToTray?: boolean;
  enableCloseToTray?: boolean;
  enableStartToTray?: boolean;
  openAtLogin?: boolean;
  alwaysShowDock?: boolean;
  enableBrowserIntegration?: boolean;
  enableBrowserIntegrationFingerprint?: boolean;
  enableDuckDuckGoBrowserIntegration?: boolean;
}
