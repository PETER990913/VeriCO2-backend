module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        user: String,
        email: String,
        phoneNumber: Number,
        birthday: String,
        password: String,
        companyName: String
        // role: String,
        // photo: String,
      },
      { timestamps: true }
    );
  
    const User = mongoose.model("users", schema);
    return User;
  };