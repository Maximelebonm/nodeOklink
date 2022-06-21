class StringHelpers {
    static initialize = () => {
      String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
      };
  
      String.prototype.camelize = function () {
        return this.replace(/_(.)/g, function ($1) {
          return $1.toUpperCase();
        })
          .replace(/_/g, "")
          .replace(/^(.)/, function ($1) {
            return $1.toLowerCase();
          })
          .capitalize();
      };
  
      String.prototype.unCamelize = function () {
        return this.replace(/([A-Z])/g, "_$1") //récupére la premiere lettre en ($1) et la remplace par une minuscule
          .replace(/_(.)/g, function ($1) {
            return $1.toLowerCase();
          })
          .replace("_", "");// resulta "Auth" deviens "auth"
      };
  
      String.prototype.containsOneOf = function (...patterns) {
        let result = false;
        patterns.forEach((p) => {
          if (this.includes(p)) {
            result = true;
          }
        });
        return result;
      };
  
      String.prototype.toJson = function () {
        let result;
        try {
          result = JSON.parse(this);
        } catch (error) {
          console.log(error, this);
        }
        return result;
      };
    };
  }
  
  module.exports = StringHelpers.initialize();
  