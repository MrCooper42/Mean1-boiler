import { browser, by, element } from 'protractor';
import { promise } from 'selenium-webdriver';

export class AppPage {
  static navigateTo(): promise.Promise<any> {
    return browser.get('/');
  }

  static getParagraphText(): any {
    return element(by.css('app-root h1')).getText();
  }
}
