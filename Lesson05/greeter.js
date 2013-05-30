
function Greeter (lang) {
    this.language = lang;

    this.greet = function () {
        if (this.language == 'en')
            return "Hello world";
        else if (this.language == 'fr')
            return "Bonjour tout le monde";
        else if (this.language == 'it')
            return "Buongiorno a tutti!";
        
        return "We don't speak that language.";
    };
}


module.exports = Greeter;
