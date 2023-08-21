module.exports = mongoose => {
    var category_schema = mongoose.Schema(
      {
        title: String,
        details: [String]
        // role: String,
        // photo: String,
      },
      { timestamps: true }
    );
  
    const Category = mongoose.model("categories", category_schema);
    return Category;
  };