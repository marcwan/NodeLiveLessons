
function Greeter (lang) {
  this.language = lang;

  this.greet = function () {
    switch (this.language) {
      case 'en': return "Hello!";
      case 'fr': return 'Bonjour!';
      case 'it': return 'Ciao!';
      default: return "Don't speak that sorry";
    }
  };
}

module.exports = Greeter;
