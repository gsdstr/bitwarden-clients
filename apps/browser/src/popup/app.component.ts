import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  SecurityContext,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { IndividualConfig, ToastrService } from "ngx-toastr";
import { filter, concatMap, Subject, takeUntil } from "rxjs";
import Swal from "sweetalert2";

import { DialogServiceAbstraction, SimpleDialogOptions } from "@bitwarden/angular/services/dialog";
import { BroadcasterService } from "@bitwarden/common/abstractions/broadcaster.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { AuthService } from "@bitwarden/common/auth/abstractions/auth.service";

import { BrowserApi } from "../browser/browserApi";
import { BrowserStateService } from "../services/abstractions/browser-state.service";

import { routerTransition } from "./app-routing.animations";

@Component({
  selector: "app-root",
  styles: [],
  animations: [routerTransition],
  template: ` <div [@routerTransition]="getState(o)">
    <router-outlet #o="outlet"></router-outlet>
  </div>`,
})
export class AppComponent implements OnInit, OnDestroy {
  private lastActivity: number = null;
  private activeUserId: string;

  private destroy$ = new Subject<void>();

  constructor(
    private toastrService: ToastrService,
    private broadcasterService: BroadcasterService,
    private authService: AuthService,
    private i18nService: I18nService,
    private router: Router,
    private stateService: BrowserStateService,
    private messagingService: MessagingService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private platformUtilsService: PlatformUtilsService,
    private dialogService: DialogServiceAbstraction
  ) {}

  async ngOnInit() {
    // Component states must not persist between closing and reopening the popup, otherwise they become dead objects
    // Clear them aggressively to make sure this doesn't occur
    await this.clearComponentStates();

    this.stateService.activeAccount$.pipe(takeUntil(this.destroy$)).subscribe((userId) => {
      this.activeUserId = userId;
    });

    this.stateService.activeAccountUnlocked$
      .pipe(
        filter((unlocked) => unlocked),
        concatMap(async () => {
          await this.recordActivity();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.ngZone.runOutsideAngular(() => {
      window.onmousedown = () => this.recordActivity();
      window.ontouchstart = () => this.recordActivity();
      window.onclick = () => this.recordActivity();
      window.onscroll = () => this.recordActivity();
      window.onkeypress = () => this.recordActivity();
    });

    (window as any).bitwardenPopupMainMessageListener = async (
      msg: any,
      sender: any,
      sendResponse: any
    ) => {
      if (msg.command === "doneLoggingOut") {
        this.ngZone.run(async () => {
          this.authService.logOut(async () => {
            if (msg.expired) {
              this.showToast({
                type: "warning",
                title: this.i18nService.t("loggedOut"),
                text: this.i18nService.t("loginExpired"),
              });
            }

            if (this.activeUserId === null) {
              this.router.navigate(["home"]);
            }
          });
          this.changeDetectorRef.detectChanges();
        });
      } else if (msg.command === "authBlocked") {
        this.ngZone.run(() => {
          this.router.navigate(["home"]);
        });
      } else if (msg.command === "locked") {
        if (msg.userId == null || msg.userId === (await this.stateService.getUserId())) {
          this.ngZone.run(() => {
            this.router.navigate(["lock"]);
          });
        }
      } else if (msg.command === "showDialog") {
        await this.showDialog(msg);
      } else if (msg.command === "showNativeMessagingFinterprintDialog") {
        // TODO: Should be refactored to live in another service.
        await this.showNativeMessagingFingerprintDialog(msg);
      } else if (msg.command === "showToast") {
        this.ngZone.run(() => {
          this.showToast(msg);
        });
      } else if (msg.command === "reloadProcess") {
        const forceWindowReload =
          this.platformUtilsService.isSafari() ||
          this.platformUtilsService.isFirefox() ||
          this.platformUtilsService.isOpera();
        // Wait to make sure background has reloaded first.
        window.setTimeout(
          () => BrowserApi.reloadExtension(forceWindowReload ? window : null),
          2000
        );
      } else if (msg.command === "reloadPopup") {
        this.ngZone.run(() => {
          this.router.navigate(["/"]);
        });
      } else if (msg.command === "convertAccountToKeyConnector") {
        this.ngZone.run(async () => {
          this.router.navigate(["/remove-password"]);
        });
      } else {
        msg.webExtSender = sender;
        this.broadcasterService.send(msg);
      }
    };

    BrowserApi.messageListener("app.component", (window as any).bitwardenPopupMainMessageListener);

    // eslint-disable-next-line rxjs/no-async-subscribe
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url || "";
        if (
          url.startsWith("/tabs/") &&
          (window as any).previousPopupUrl != null &&
          (window as any).previousPopupUrl.startsWith("/tabs/")
        ) {
          await this.clearComponentStates();
        }
        if (url.startsWith("/tabs/")) {
          await this.stateService.setAddEditCipherInfo(null);
        }
        (window as any).previousPopupUrl = url;

        // Clear route direction after animation (400ms)
        if ((window as any).routeDirection != null) {
          window.setTimeout(() => {
            (window as any).routeDirection = null;
          }, 400);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getState(outlet: RouterOutlet) {
    if (outlet.activatedRouteData.state === "ciphers") {
      const routeDirection =
        (window as any).routeDirection != null ? (window as any).routeDirection : "";
      return (
        "ciphers_direction=" +
        routeDirection +
        "_" +
        (outlet.activatedRoute.queryParams as any).value.folderId +
        "_" +
        (outlet.activatedRoute.queryParams as any).value.collectionId
      );
    } else {
      return outlet.activatedRouteData.state;
    }
  }

  private async recordActivity() {
    if (this.activeUserId == null) {
      return;
    }

    const now = new Date().getTime();
    if (this.lastActivity != null && now - this.lastActivity < 250) {
      return;
    }

    this.lastActivity = now;
    await this.stateService.setLastActive(now, { userId: this.activeUserId });
  }

  private showToast(msg: any) {
    let message = "";

    const options: Partial<IndividualConfig> = {};

    if (typeof msg.text === "string") {
      message = msg.text;
    } else if (msg.text.length === 1) {
      message = msg.text[0];
    } else {
      msg.text.forEach(
        (t: string) =>
          (message += "<p>" + this.sanitizer.sanitize(SecurityContext.HTML, t) + "</p>")
      );
      options.enableHtml = true;
    }
    if (msg.options != null) {
      if (msg.options.trustedHtml === true) {
        options.enableHtml = true;
      }
      if (msg.options.timeout != null && msg.options.timeout > 0) {
        options.timeOut = msg.options.timeout;
      }
    }

    this.toastrService.show(message, msg.title, options, "toast-" + msg.type);
  }

  private async showDialog(msg: SimpleDialogOptions) {
    await this.dialogService.openSimpleDialog(msg);
  }

  private async showNativeMessagingFingerprintDialog(msg: any) {
    await Swal.fire({
      heightAuto: false,
      buttonsStyling: false,
      icon: "warning",
      iconHtml: '<i class="swal-custom-icon bwi bwi-exclamation-triangle text-warning"></i>',
      html: `${this.i18nService.t("desktopIntegrationVerificationText")}<br><br><strong>${
        msg.fingerprint
      }</strong>`,
      titleText: this.i18nService.t("desktopSyncVerificationTitle"),
      showConfirmButton: true,
      confirmButtonText: this.i18nService.t("ok"),
      timer: 300000,
    });
  }

  private async clearComponentStates() {
    if (!(await this.stateService.getIsAuthenticated())) {
      return;
    }

    await Promise.all([
      this.stateService.setBrowserGroupingComponentState(null),
      this.stateService.setBrowserVaultItemsComponentState(null),
      this.stateService.setBrowserSendComponentState(null),
      this.stateService.setBrowserSendTypeComponentState(null),
    ]);
  }
}
