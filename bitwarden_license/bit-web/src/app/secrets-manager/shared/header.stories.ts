import { Component, Injectable } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Meta, Story, moduleMetadata, componentWrapperDecorator } from "@storybook/angular";
import { BehaviorSubject, combineLatest, map } from "rxjs";

import { JslibModule } from "@bitwarden/angular/jslib.module";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import {
  AvatarModule,
  BreadcrumbsModule,
  ButtonModule,
  IconButtonModule,
  IconModule,
  MenuModule,
  NavigationModule,
  TabsModule,
  TypographyModule,
} from "@bitwarden/components";
import { InputModule } from "@bitwarden/components/src/input/input.module";
import { PreloadedEnglishI18nModule } from "@bitwarden/web-vault/app/tests/preloaded-english-i18n.module";

import { HeaderComponent } from "./header.component";

@Injectable({
  providedIn: "root",
})
class MockStateService {
  activeAccount$ = new BehaviorSubject("1").asObservable();
  accounts$ = new BehaviorSubject({ "1": { profile: { name: "Foo" } } }).asObservable();
}

class MockMessagingService implements MessagingService {
  send(subscriber: string, arg?: any) {
    alert(subscriber);
  }
}

@Component({
  selector: "product-switcher",
  template: `<button bitIconButton="bwi-filter"></button>`,
})
class MockProductSwitcher {}

@Component({
  selector: "dynamic-avatar",
  template: `<bit-avatar [text]="name$ | async"></bit-avatar>`,
})
class MockDynamicAvatar {
  protected name$ = combineLatest([
    this.stateService.accounts$,
    this.stateService.activeAccount$,
  ]).pipe(
    map(
      ([accounts, activeAccount]) => accounts[activeAccount as keyof typeof accounts].profile.name
    )
  );
  constructor(private stateService: MockStateService) {}
}

export default {
  title: "Web/Header",
  component: HeaderComponent,
  decorators: [
    componentWrapperDecorator(
      (story) => `<div class="tw-min-h-screen tw-flex-1 tw-p-6 tw-text-main">${story}</div>`
    ),
    moduleMetadata({
      imports: [
        JslibModule,
        RouterModule.forRoot(
          [
            {
              path: "",
              component: HeaderComponent,
            },
          ],
          { useHash: true }
        ),
        AvatarModule,
        BreadcrumbsModule,
        ButtonModule,
        IconButtonModule,
        IconModule,
        InputModule,
        MenuModule,
        TabsModule,
        TypographyModule,
        NavigationModule,
        PreloadedEnglishI18nModule,
      ],
      declarations: [HeaderComponent, MockProductSwitcher, MockDynamicAvatar],
      providers: [
        { provide: StateService, useClass: MockStateService },
        {
          provide: MessagingService,
          useFactory: () => {
            return new MockMessagingService();
          },
        },
      ],
    }),
  ],
} as Meta;

export const KitchenSink: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="LongTitleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" icon="bwi-bug">
      <bit-breadcrumbs slot="breadcrumbs">
        <bit-breadcrumb>Foo</bit-breadcrumb>
        <bit-breadcrumb>Bar</bit-breadcrumb>
      </bit-breadcrumbs>
      <input
        bitInput
        placeholder="Ask Jeeves"
        type="text"
      />
      <button bitButton buttonType="primary">New</button>
      <button bitButton slot="secondary">Click Me 🎉</button>
      <bit-tab-nav-bar slot="tabs">
        <bit-tab-link route="">Foo</bit-tab-link>
        <bit-tab-link route="#bar">Bar</bit-tab-link>
      </bit-tab-nav-bar>
    </sm-header>
  `,
});

export const Basic: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="Foobar" icon="bwi-bug"></sm-header>
  `,
});

export const WithLongTitle: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="LongTitleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" icon="bwi-bug"></sm-header>
  `,
});

export const WithBreadcrumbs: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="Foobar" icon="bwi-bug" class="tw-text-main">
      <bit-breadcrumbs slot="breadcrumbs">
        <bit-breadcrumb>Foo</bit-breadcrumb>
        <bit-breadcrumb>Bar</bit-breadcrumb>
      </bit-breadcrumbs>
    </sm-header>
  `,
});

export const WithSearch: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="Foobar" icon="bwi-bug" class="tw-text-main">
      <input
        bitInput
        placeholder="Ask Jeeves"
        type="text"
      />
    </sm-header>
  `,
});

export const WithSecondaryContent: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="Foobar" icon="bwi-bug" class="tw-text-main">
      <button bitButton slot="secondary">Click Me 🎉</button>
    </sm-header>
  `,
});

export const WithTabs: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="Foobar" icon="bwi-bug" class="tw-text-main">
      <bit-tab-nav-bar slot="tabs">
        <bit-tab-link route="">Foo</bit-tab-link>
        <bit-tab-link route="#bar">Bar</bit-tab-link>
      </bit-tab-nav-bar>
    </sm-header>
  `,
});

export const WithCustomTitleComponent: Story = (args) => ({
  props: args,
  template: `
    <sm-header title="Foobar" icon="bwi-bug" class="tw-text-main">
      <h1 slot="title" class="tw-text-3xl tw-font-semibold" style="font-family: 'Comic Sans MS'">Bitwarden</h1>
    </sm-header>
  `,
});
