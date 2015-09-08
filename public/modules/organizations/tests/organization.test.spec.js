describe('Organization Management', function() {
  
  var baseUrl = 'http://localhost:3000/#!';
  var userCredentials = {
    email: 'users@mail.com',
    password: 'password',
    firstName: 'John'
  }
  var organization = {
    name: 'New Organization',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id, ipsum?'
  }

  var signin = function() {
    browser.get(baseUrl + '/');
    element(by.css('a.signin')).click();
    browser.wait(EC.visibilityOf($('#user-signin-email')), 2000);
    element(by.css('#user-signin-email')).sendKeys(userCredentials.email);    
    element(by.css('#user-signin-password')).sendKeys(userCredentials.password);       
    element(by.css('button#signin')).click(); 
  }

  var EC = protractor.ExpectedConditions;

  // it('should add an organization to the user', function() {
  //   // user sign in
  //   signin();
  //   browser.wait(EC.visibilityOf($('.organization-create')), 5000);
  //   element(by.css('a.organization-create')).click(); 
  //   expect(browser.getLocationAbsUrl())
  //     .toBe('/organizations/create'); 
  //   // browser.wait(EC.visibilityOf($('#organization-name')), 5000);
  //   element(by.css('#organization-name')).sendKeys(organization.name);    

  //   element(by.cssContainingText('option', 'Vendor')).click();

  //   element(by.css('#organization-description')).sendKeys(organization.description);    
  //   element(by.buttonText('Save Organization')).click();

  // });

  // it('should enable user to add availability to a plant', function() {
  //   // user sign in
  //   signin();
  //   // navigate to the user's organization
  //   browser.wait(EC.visibilityOf($('.organization-user')), 2000);
  //   element(by.css('a.organization-user')).click();
  //   browser.wait(EC.visibilityOf($('.org-container')), 2000);
  //   expect(browser.getLocationAbsUrl())
  //     .toBe('/organizations/55e8b1df5e62f5d39d65d49e');
  //   // click on a plant to manage
  //   // select add availability
  //   // input date and quantity
  //   // save availability
  // });

  afterEach(function(){
    browser.get(baseUrl + '/');
    browser.wait(EC.visibilityOf($('#signout')), 2000);
    element(by.css('#signout')).click();
  })

});
