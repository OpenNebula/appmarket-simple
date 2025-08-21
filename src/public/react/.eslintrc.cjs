// .eslintrc.cjs
module.exports = {
  extends: ["opennebula"],
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["src", "./src"]
        ],
        extensions: [".js", ".jsx"]
      }
    }
  }
};
