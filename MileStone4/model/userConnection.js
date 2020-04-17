module.exports = class userConnection {
  constructor(connection, rsvp) {
    this.connection=connection;
    this.rsvp=rsvp;
  }

  get getConnection(){
    return this.connection;
  }
  set setConnection(connection){
    this.connection = connection;
  }

  get getRSVP(){
    return this.rsvp;
  }
  set setRSVP(rsvp){
    this.rsvp = rsvp;
  }
}
