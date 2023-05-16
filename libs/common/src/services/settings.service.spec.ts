// eslint-disable-next-line no-restricted-imports
import { Arg, Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import { BehaviorSubject, firstValueFrom } from "rxjs";

import { CryptoService } from "../abstractions/crypto.service";
import { EncryptService } from "../abstractions/encrypt.service";

import { ContainerService } from "./container.service";
import { SettingsService } from "./settings.service";
import { StateService } from "./state.service";

describe("SettingsService", () => {
  let settingsService: SettingsService;

  let cryptoService: SubstituteOf<CryptoService>;
  let encryptService: SubstituteOf<EncryptService>;
  let stateService: SubstituteOf<StateService>;
  let activeAccount: BehaviorSubject<string>;
  let activeAccountUnlocked: BehaviorSubject<boolean>;

  const mockEquivalentDomains = [
    ["example.com", "exampleapp.com", "example.co.uk", "ejemplo.es"],
    ["bitwarden.com", "bitwarden.co.uk", "sm-bitwarden.com"],
    ["example.co.uk", "exampleapp.co.uk"],
  ];

  beforeEach(() => {
    cryptoService = Substitute.for();
    encryptService = Substitute.for();
    stateService = Substitute.for();
    activeAccount = new BehaviorSubject("123");
    activeAccountUnlocked = new BehaviorSubject(true);

    stateService.getSettings().resolves({ equivalentDomains: mockEquivalentDomains });
    stateService.activeAccount$.returns(activeAccount);
    stateService.activeAccountUnlocked$.returns(activeAccountUnlocked);
    (window as any).bitwardenContainerService = new ContainerService(cryptoService, encryptService);

    settingsService = new SettingsService(stateService);
  });

  afterEach(() => {
    activeAccount.complete();
    activeAccountUnlocked.complete();
  });

  describe("getEquivalentDomains", () => {
    it("returns all equivalent domains for a URL", async () => {
      const actual = settingsService.getEquivalentDomains("example.co.uk");
      const expected = new Set([
        "example.com",
        "exampleapp.com",
        "example.co.uk",
        "ejemplo.es",
        "exampleapp.co.uk",
      ]);
      expect(actual).toEqual(expected);
    });

    it("returns an empty set if there are no equivalent domains", () => {
      const actual = settingsService.getEquivalentDomains("asdf");
      expect(actual).toEqual(new Set());
    });
  });

  it("setEquivalentDomains", async () => {
    await settingsService.setEquivalentDomains([["test2"], ["domains2"]]);

    stateService.received(1).setSettings(Arg.any());

    expect((await firstValueFrom(settingsService.settings$)).equivalentDomains).toEqual([
      ["test2"],
      ["domains2"],
    ]);
  });

  it("clear", async () => {
    await settingsService.clear();

    stateService.received(1).setSettings(Arg.any(), Arg.any());

    expect(await firstValueFrom(settingsService.settings$)).toEqual({});
  });
});
