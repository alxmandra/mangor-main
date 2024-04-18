module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("image", {
      author: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.BLOB("long"),
      },
      preview: {
        type: DataTypes.BLOB("long"),
      },
      compressed: {
        type: DataTypes.BLOB("long"),
      },
    });
  
    return Image;
  };