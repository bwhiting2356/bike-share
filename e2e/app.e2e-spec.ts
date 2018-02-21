import { BikeSharePage } from './app.po';

describe('bike-share App', () => {
  let page: BikeSharePage;

  beforeEach(() => {
    page = new BikeSharePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
