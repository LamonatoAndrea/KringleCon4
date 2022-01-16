

function digitFromSuperscript(superChar) {
    var result = "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(superChar);
    if(result > -1) { return result; }
    else { return superChar; }
}

eval("(not True or True) and (True or False)".toLowerCase().replaceAll("not", "!").replaceAll("and", "&&").replaceAll("or", "||"))

