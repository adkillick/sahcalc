
//Recalculate Post-Test Prob
function recalculate() {
    var myform = document.myform;

    var pretest = myform.pretest.value / 100;
    var posttest = pretest;

    for (var i = 0; i < myform.elements.length; i++) {
        var el = myform.elements[i];
        if (el.type == "radio") {
            if (el.checked) {
                var valstring = el.value;
                var pnz = valstring.substring(0, 1);
                if (pnz == 0) {continue} //(ignore 0)
                valstring = valstring.substring(1);
                var pr = valstring.substring(0, valstring.indexOf(";"));
                var nr = valstring.substring(valstring.indexOf(";") + 1);
                var sens = sensitivity(nr, pr)
                var spec = specificity(nr, pr)
                console.log("pr = ", pr)
                console.log("nr = ", nr)
                console.log("sens = ", sens)
                console.log("spec = ", spec)
                if (pnz == "+") {
                    posttest = getNewP(posttest, sens, spec, 1);
                } else if (pnz == "-") {
                    posttest = getNewP(posttest, sens, spec, -1);
                }
            }
        }
    }
    myform.posttest.value = Math.round(posttest * 1000) / 10;
}

function sensitivity(nr, pr) {
    return (nr * pr - pr) / (nr - pr)
}

function specificity(nr, pr) {
    return (1 - pr) / (nr - pr)
}


//Calculate a post-test probability from pretest, sens, spec, and mode
// where mode==1 is "+" test result, mode==-1 is "-" test result
function getNewP(pre, sens, spec, mode) {
    //ok, basically all we have to do is calculate that box
    /*         Disease
    * Test   +       -
    *  +     a       b
    *  -     c       d
    *
    * note that sens=a/(a+c), spec=d/(b+d), p=a+c.
    */
    var a = sens * pre;
    var c = (1 - sens) * pre;
    var d = spec * (1 - pre);
    var b = (1 - spec) * (1 - pre);

    if (mode == 1) {
        return a / (a + b);
    } else if (mode == -1) {
        return c / (c + d);
    }
}

function jump_next_dup(finding, number) {
    next_anchor = document.getElementById("_dup_" + finding + "_" + (number + 1));
    if (next_anchor == null) { //then start over from the beginning
        number = -1;
    }
    window.location = "#dup_" + finding + "_" + (number + 1);
}

let riskFactors = [
    {name:"test CSF", positiveLR: 6.1, negativeLR: 0.1},
    {name:"Ambulance Arrival", positiveLR: 2.95, negativeLR: 0.51},
    {name:"Witnessed LOC", positiveLR: 1.87, negativeLR: 0.91},
    {name:"Focal Neuro Deficit", positiveLR: 3.26, negativeLR: 0.81},
    {name:"Objective Neck Stiffness", positiveLR: 6.59, negativeLR: 0.78},
    {name:"Subjective Neck Stiffness", positiveLR: 4.12, negativeLR: 0.73},
    {name:"Exersion at onset", positiveLR: 1.7, negativeLR: 0.88},
    {name:"Vomitting", positiveLR: 1.92, negativeLR: 0.52},
    {name:"Awoke from Sleep", positiveLR: 0.63, negativeLR: 1.09},
    {name:"Blurred Vision", positiveLR: 3.14, negativeLR: 0.85},
    {name:"Burst or explode on onset", positiveLR: 1.34, negativeLR: 0.74},
    {name:"ED transfer", positiveLR: 2.2, negativeLR: 0.9},
    {name:"Intercourse at onset", positiveLR: 1.2, negativeLR: 1},
    {name:"Worst headache of life", positiveLR: 1.25, negativeLR: 0.24},
    {name:"Altered mental status", positiveLR: 2.18, negativeLR: 0.87}
]
let riskFactorsPreCT = [
    {name:"\< 6hours: Non contrast head CT", positiveLR: 234.55, negativeLR: 0.01},
    {name:"\> 6 hours: Non contrast CT head", positiveLR: 223.37, negativeLR: 0.07},
    {name:"Xanthochromia on visual inspection", positiveLR: 12.56, negativeLR: 0.3},
    {name:"RBC in tube 4 > 1000", positiveLR: 5.66, negativeLR: 0.21},
]

let makeTable = (id, factors) => {
    let table = document.getElementById(id)
    factors.forEach(
        (factor, index) => {

            var newRow = '<tr class="even" >\
            <td width="25%">\
                <a>'+factor.name+'</a>\
            </td>\
            <td width="15%">\
                <input type="radio" name='+id+index+' value="+'+factor.positiveLR+';'+factor.negativeLR+'" onClick="recalculate()">+\
                <input type="radio" name='+id+index+' value="0" onClick="recalculate()" checked>0\
                <input type="radio" name='+id+index+' value="-'+factor.positiveLR+';'+factor.negativeLR+'" onClick="recalculate()">-\
            </td>\
            <td width="10%">'+factor.positiveLR+'</td>\
            <td width="10%">'+factor.negativeLR+'</td>\
        </tr>'
            table.insertAdjacentHTML('beforeend', newRow);

    })
}