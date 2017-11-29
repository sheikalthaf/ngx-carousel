import { ResTestingPage } from './app.po';

describe('res-testing App', () => {
  let page: ResTestingPage;

  beforeEach(() => {
    page = new ResTestingPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
