module.exports = class User{
  constructor(userId,firstName,lastName,emailAddress,address1Field,address2Field,city,state,pinCode,country){
    this.userId=userId;
    this.firstName=firstName;
    this.lastName=lastName;
    this.emailAddress=emailAddress;
    this.address1Field=address1Field;
    this.address2Field=address2Field;
    this.city=city;
    this.state=state;
    this.pinCode=pinCode;
    this.country=country;
  }

  get getUserId(){
    return this.userId;
  }
  set setUserId(userId){
    this.userId = userId;
  }

  get getFirstName(){
    return this.firstName;
  }
  set setFirstName(firstName){
    this.firstName = firstName;
  }

  get getLastName(){
    return this.lastName;
  }
  set setLastName(lastName){
    this.lastName = lastName;
  }

  get getEmailAddress(){
    return this.emailAddress;
  }
  set setEmailAddress(emailAddress){
    this.emailAddress = emailAddress;
  }

  get getAddress1Field(){
    return this.address1Field;
  }
  set setAddress1Field(address1Field){
    this.address1Field = address1Field;
  }

  get getAddress2Field(){
    return this.address2Field;
  }
  set setAddress2Field(address2Field){
    this.address2Field = address2Field;
  }

  get getCity(){
    return this.city;
  }
  set setCity(city){
    this.city = city;
  }

  get getState(){
    return this.state;
  }
  set setState(state){
    this.state = state;
  }

  get getPinCode(){
    return this.pinCode;
  }
  set setPinCode(pinCode){
    this.pinCode = pinCode;
  }

  get getCountry(){
    return this.country;
  }
  set setCountry(country){
    this.country = country;
  }

}
