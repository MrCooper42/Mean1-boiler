import {AppPage} from './app.po';

describe('MEAN2-BoilerPlate App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    AppPage.navigateTo();
    expect(AppPage.getParagraphText()).toEqual('Welcome to app!');
  });
});
